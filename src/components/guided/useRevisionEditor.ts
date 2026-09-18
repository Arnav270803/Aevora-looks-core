import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, getApiErrorMessage } from '../../api/client';
import type { CreativeRevision, GuidedWorkspace } from '../../api/guidedWorkspaceApi';

type Options<T> = {
  storageKey: string; revision?: CreativeRevision<T>; empty: T;
  save: (expectedRevisionId: string | null, content: T) => Promise<GuidedWorkspace>;
  accept: (workspace: GuidedWorkspace) => void;
  resolve: (workspace: GuidedWorkspace) => CreativeRevision<T> | undefined;
  validate: (content: T) => string | null;
};
type EditorState<T> = { draft: T; baseId: string | null; baseVersion: number; baseText: string };

export function useRevisionEditor<T>(options: Options<T>) {
  const latest = useRef(options);
  latest.current = options;
  const [state, setState] = useState<EditorState<T>>(() => {
    const content = options.revision?.content ?? options.empty;
    const initial = { draft: content, baseId: options.revision?.id ?? null, baseVersion: options.revision?.version ?? 0, baseText: JSON.stringify(content) };
    try {
      const scratch = JSON.parse(localStorage.getItem(options.storageKey) ?? 'null') as { content: T; baseId: string | null; baseText: string; baseVersion: number } | null;
      if (scratch && scratch.content && typeof scratch.baseText === 'string') return { ...initial, draft: scratch.content, baseId: scratch.baseId, baseText: scratch.baseText, baseVersion: scratch.baseVersion ?? 0 };
    } catch { /* Browser storage is optional. Server revisions remain authoritative. */ }
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);
  const [history, setHistory] = useState<{ undo: T[]; redo: T[] }>({ undo: [], redo: [] });
  const stateRef = useRef(state);
  stateRef.current = state;
  const savingRef = useRef(false);
  const pendingSave = useRef<Promise<boolean> | null>(null);
  const savedRevision = useRef(options.revision);
  if (options.revision && options.revision.version >= (savedRevision.current?.version ?? 0)) savedRevision.current = options.revision;
  const mounted = useRef(true);
  const dirty = JSON.stringify(state.draft) !== state.baseText;
  const validation = options.validate(state.draft);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    const incoming = options.revision;
    const incomingId = incoming?.id ?? null;
    if (incomingId === state.baseId || (incoming?.version ?? 0) < state.baseVersion) return;
    if (dirty) { setConflict(true); return; }
    const content = incoming?.content ?? options.empty;
    setState({ draft: content, baseId: incomingId, baseVersion: incoming?.version ?? 0, baseText: JSON.stringify(content) });
    setConflict(false);
    setHistory({ undo: [], redo: [] });
  }, [options.revision?.id, state.baseId, state.baseVersion, dirty]);

  useEffect(() => {
    try {
      if (dirty) localStorage.setItem(options.storageKey, JSON.stringify({ content: state.draft, baseId: state.baseId, baseText: state.baseText, baseVersion: state.baseVersion }));
      else localStorage.removeItem(options.storageKey);
    } catch { /* Keep editing when local storage is unavailable. */ }
    window.dispatchEvent(new CustomEvent('aevora-editor-dirty', { detail: { key: options.storageKey, dirty } }));
    const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [state, dirty, options.storageKey]);
  useEffect(() => () => {
    window.dispatchEvent(new CustomEvent('aevora-editor-dirty', { detail: { key: options.storageKey, dirty: false } }));
  }, [options.storageKey]);

  const setDraft = useCallback((next: T | ((current: T) => T)) => {
    const previous = stateRef.current.draft;
    const content = typeof next === 'function' ? (next as (current: T) => T)(previous) : next;
    setHistory((value) => ({ undo: [...value.undo.slice(-49), previous], redo: [] }));
    const updated = { ...stateRef.current, draft: content };
    stateRef.current = updated;
    setState(updated);
    setError(null);
  }, []);

  const executeSave = useCallback(async () => {
    if (savingRef.current) return false;
    const snapshot = stateRef.current;
    const invalid = latest.current.validate(snapshot.draft);
    if (invalid) { setError(invalid); return false; }
    if (JSON.stringify(snapshot.draft) === snapshot.baseText && snapshot.baseId) return true;
    savingRef.current = true;
    setSaving(true);
    setError(null);
    try {
      const workspace = await latest.current.save(snapshot.baseId, snapshot.draft);
      const revision = latest.current.resolve(workspace);
      if (!revision) throw new Error('The server did not return the saved revision. Reload the workspace before continuing.');
      savedRevision.current = revision;
      const changedDuringSave = JSON.stringify(stateRef.current.draft) !== JSON.stringify(snapshot.draft);
      const next = { draft: changedDuringSave ? stateRef.current.draft : revision.content, baseId: revision.id, baseVersion: revision.version, baseText: JSON.stringify(revision.content) };
      // A response may arrive after navigation. Advance the recoverable scratch base too.
      try {
        if (JSON.stringify(next.draft) === next.baseText) localStorage.removeItem(latest.current.storageKey);
        else localStorage.setItem(latest.current.storageKey, JSON.stringify({ content: next.draft, baseId: next.baseId, baseVersion: next.baseVersion, baseText: next.baseText }));
      } catch { /* Server save succeeded even if browser storage is unavailable. */ }
      // A user may continue typing while a save is in flight. Only the saved base advances.
      stateRef.current = next;
      latest.current.accept(workspace);
      if (!mounted.current) return true;
      setState(next);
      setConflict(false);
      return true;
    } catch (cause) {
      if (mounted.current) {
        if (cause instanceof ApiError && cause.status === 409) setConflict(true);
        setError(getApiErrorMessage(cause, 'Unable to save. Your local edits are retained.'));
      }
      return false;
    } finally {
      savingRef.current = false;
      if (mounted.current) setSaving(false);
    }
  }, []);
  const save = useCallback(() => {
    if (pendingSave.current) return pendingSave.current;
    const request = executeSave();
    pendingSave.current = request;
    void request.finally(() => { if (pendingSave.current === request) pendingSave.current = null; });
    return request;
  }, [executeSave]);
  const flush = useCallback(async () => {
    if (pendingSave.current && !await pendingSave.current) return undefined;
    if (!await save()) return undefined;
    return savedRevision.current;
  }, [save]);

  useEffect(() => {
    if (!dirty || saving || conflict || validation || error) return;
    const timer = window.setTimeout(() => { void save(); }, 1200);
    return () => window.clearTimeout(timer);
  }, [state.draft, dirty, saving, conflict, validation, error, save]);

  const reload = () => {
    const revision = latest.current.revision;
    const content = revision?.content ?? latest.current.empty;
    const next = { draft: content, baseId: revision?.id ?? null, baseVersion: revision?.version ?? 0, baseText: JSON.stringify(content) };
    stateRef.current = next;
    setState(next);
    setConflict(false);
    setError(null);
    setHistory({ undo: [], redo: [] });
  };
  const rebase = () => {
    const revision = latest.current.revision;
    const next = { ...stateRef.current, baseId: revision?.id ?? null, baseVersion: revision?.version ?? 0, baseText: JSON.stringify(revision?.content ?? latest.current.empty) };
    stateRef.current = next;
    setState(next);
    setConflict(false);
    setError(null);
  };
  const undo = () => {
    const target = history.undo.at(-1);
    if (!target) return;
    setHistory({ undo: history.undo.slice(0, -1), redo: [...history.redo, state.draft] });
    const next = { ...stateRef.current, draft: target };
    stateRef.current = next;
    setState(next);
    setError(null);
  };
  const redo = () => {
    const target = history.redo.at(-1);
    if (!target) return;
    setHistory({ undo: [...history.undo, state.draft], redo: history.redo.slice(0, -1) });
    const next = { ...stateRef.current, draft: target };
    stateRef.current = next;
    setState(next);
    setError(null);
  };
  return { draft: state.draft, setDraft, baseId: state.baseId, dirty, saving, error, conflict, validation, save, flush, reload, rebase, undo, redo, canUndo: history.undo.length > 0, canRedo: history.redo.length > 0 };
}
