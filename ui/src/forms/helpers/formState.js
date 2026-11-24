/**
 * Shared helpers for form sections.
 */

/**
 * Build a `<SectionRenderer />`-friendly list of fields from a section
 * definition and the runtime config (countries, languages, etc.).
 *
 * The caller passes `resolvers` — a map of resolver name → function that
 * returns `[{ value, label }]`. This is populated by the section components
 * from context hooks (countries, languages, organizationTypes, etc.).
 */
export function resolveSectionFields(section, resolvers) {
  if (!section?.fields) return [];
  return section.fields.map((key) => {
    const field = require('../configuration/fields.js').getField(key);
    if (field.optionsResolver && resolvers?.[field.optionsResolver]) {
      return { ...field, options: resolvers[field.optionsResolver]() };
    }
    return field;
  });
}

/**
 * Merge draft values over initial values. Fields that exist in initial but
 * not in draft are preserved; fields that exist in both prefer draft.
 */
export function mergeDraft(initial, draft) {
  if (!draft) return initial;
  return { ...initial, ...draft };
}

/**
 * Extract the fields that should be shown for a given step.
 */
export function fieldsForStep(section) {
  return section?.fields ?? [];
}