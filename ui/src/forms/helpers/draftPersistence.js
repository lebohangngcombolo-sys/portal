/**
 * Draft persistence for multi-step forms.
 *
 * Uses tb-state Storage so drafts survive page reloads (session + local
 * mirror). Drafts are keyed by workflowId + optional entityId so multiple
 * concurrent drafts don't collide.
 */

import { Storage, StorageKeys } from 'tb-state';

const storage = new Storage();

/**
 * @param {string} workflowId
 * @param {string} [entityId]
 */
function draftKey(workflowId, entityId) {
  return `${StorageKeys.FORM_DRAFT_PREFIX}${workflowId}${entityId ? `:${entityId}` : ''}`;
}

export function loadDraft(workflowId, entityId = null) {
  try {
    return storage.get(draftKey(workflowId, entityId)) || null;
  } catch {
    return null;
  }
}

export function saveDraft(workflowId, values, entityId = null) {
  try {
    storage.set(draftKey(workflowId, entityId), values);
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(workflowId, entityId = null) {
  try {
    storage.remove(draftKey(workflowId, entityId));
  } catch {
    // ignore
  }
}

export function clearAllDraftsForWorkflow(workflowId) {
  try {
    const keys = storage.keys().filter((k) =>
      k.startsWith(`${StorageKeys.FORM_DRAFT_PREFIX}${workflowId}`),
    );
    keys.forEach((k) => storage.remove(k));
  } catch {
    // ignore
  }
}