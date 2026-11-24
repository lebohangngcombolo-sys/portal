/**
 * Track whether form values differ from the last saved snapshot.
 */

export function serialize(values) {
  try {
    return JSON.stringify(values ?? {});
  } catch {
    return '';
  }
}

export function isDirty(current, snapshot) {
  return serialize(current) !== serialize(snapshot);
}

/**
 * Detect which top-level keys changed between two value snapshots.
 */
export function diffKeys(current, snapshot) {
  const changed = new Set();
  const all = new Set([
    ...Object.keys(current || {}),
    ...Object.keys(snapshot || {}),
  ]);
  for (const key of all) {
    if (serialize(current?.[key]) !== serialize(snapshot?.[key])) {
      changed.add(key);
    }
  }
  return Array.from(changed);
}