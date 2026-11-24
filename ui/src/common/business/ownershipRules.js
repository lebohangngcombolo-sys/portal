/**
 * Client-side ownership rules (spec §6.4).
 *
 * The default threshold (25%) comes from the country configuration.
 * Customer Service fetches this per-country; the UI uses the value
 * returned by `/api/v1/countries/{code}/configuration` when available.
 */

export const DEFAULT_OWNERSHIP_THRESHOLD = 25.0;

/**
 * Sum ownership percentages across a set of owners.
 */
export function aggregateOwnership(owners) {
  if (!Array.isArray(owners)) return 0;
  return owners
    .filter((o) =>
      o?.controlType === 'DIRECT' || o?.controlType === 'INDIRECT',
    )
    .reduce((sum, o) => sum + (Number(o.ownershipPercentage) || 0), 0);
}

/**
 * True if the aggregate meets the configured threshold.
 */
export function meetsThreshold(owners, threshold = DEFAULT_OWNERSHIP_THRESHOLD) {
  return aggregateOwnership(owners) >= threshold;
}

/**
 * True if the aggregate ownership is above 100% (invalid declaration).
 */
export function exceedsAggregate(owners) {
  return aggregateOwnership(owners) > 100.0001;
}

/**
 * True if a proposed percentage would push the aggregate above 100%.
 */
export function wouldExceedAggregate(owners, proposedPercentage, excludeOwnerId = null) {
  const current = (owners || [])
    .filter((o) => o?.id !== excludeOwnerId)
    .filter((o) => o?.controlType === 'DIRECT' || o?.controlType === 'INDIRECT')
    .reduce((sum, o) => sum + (Number(o.ownershipPercentage) || 0), 0);
  return current + (Number(proposedPercentage) || 0) > 100.0001;
}

/**
 * Human-readable summary for the declaration step.
 */
export function ownershipSummary(owners, threshold = DEFAULT_OWNERSHIP_THRESHOLD) {
  const aggregate = aggregateOwnership(owners);
  const count = (owners || []).length;
  return {
    aggregate,
    count,
    threshold,
    meetsThreshold: aggregate >= threshold,
    overLimit: aggregate > 100.0001,
  };
}