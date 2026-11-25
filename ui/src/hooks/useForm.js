/**
 * Yup-backed form state hook.
 *
 * Usage:
 *   const form = useForm({
 *     initialValues: { email: '', password: '' },
 *     validationSchema: yup.object({
 *       email: yup.string().email().required(),
 *       password: yup.string().min(12).required(),
 *     }),
 *     onSubmit: async (values) => { ... },
 *   });
 *
 * Provides:
 * - `values`, `errors`, `touched`
 * - `setFieldValue(name, value)`
 * - `setFieldTouched(name, bool)`
 * - `handleSubmit(event)`
 * - `resetForm()`
 * - `isValid`, `isDirty`, `isSubmitting`
 * - `getFieldProps(name)` — spread into a `<input>` for convenience
 */

import { useCallback, useMemo, useState } from 'react';
import { ValidationError } from 'yup';

export function useForm({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = useCallback(
    async (candidate) => {
      if (!validationSchema) return {};
      try {
        await validationSchema.validate(candidate, { abortEarly: false });
        return {};
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err;
        const next = {};
        for (const issue of err.inner) {
          if (issue.path && !next[issue.path]) {
            next[issue.path] = issue.message;
          }
        }
        return next;
      }
    },
    [validationSchema],
  );

  const setFieldValue = useCallback(
    async (name, value) => {
      const next = setIn(values, name, value);
      setValues(next);
      if (validateOnChange) {
        const fieldErrors = await validate(next);
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || null }));
      }
    },
    [values, validate, validateOnChange],
  );

  const setFieldTouched = useCallback(
    async (name, isTouched = true) => {
      setTouched((prev) => setIn(prev, name, isTouched));
      if (isTouched && validateOnBlur) {
        const fieldErrors = await validate(values);
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || null }));
      }
    },
    [values, validate, validateOnBlur],
  );

  const setValuesSafe = useCallback(
    async (updater) => {
      const next = typeof updater === 'function' ? updater(values) : updater;
      setValues(next);
      if (validateOnChange) {
        const errs = await validate(next);
        setErrors(errs);
      }
    },
    [values, validate, validateOnChange],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault?.();
      setSubmitError(null);
      setIsSubmitting(true);
      try {
        const errs = await validate(values);
        setErrors(errs);
        // Mark every field touched
        const allTouched = {};
        Object.keys(values).forEach((k) => {
          allTouched[k] = true;
        });
        setTouched(allTouched);

        if (Object.keys(errs).length > 0) {
          return { ok: false, errors: errs };
        }
        const result = await onSubmit?.(values);
        return result;
      } catch (err) {
        const payload = err?.messages?.length
          ? err.messages
          : [err?.message || 'Submission failed'];
        setSubmitError({ messages: payload, code: err?.code ?? 'SUBMIT_ERROR' });
        return { ok: false, errors: {}, messages: payload };
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit],
  );

  const resetForm = useCallback(
    (next = initialValues) => {
      setValues(next);
      setErrors({});
      setTouched({});
      setSubmitError(null);
    },
    [initialValues],
  );

  const getFieldProps = useCallback(
    (name) => ({
      name,
      value: getIn(values, name) ?? '',
      onChange: (e) => {
        const v = e?.target ? e.target.value : e;
        return setFieldValue(name, v);
      },
      onBlur: () => setFieldTouched(name, true),
    }),
    [values, setFieldValue, setFieldTouched],
  );

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [values, initialValues],
  );

  const isValid = useMemo(
    () => Object.values(errors).every((e) => !e),
    [errors],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    submitError,
    setFieldValue,
    setFieldTouched,
    setValues: setValuesSafe,
    handleSubmit,
    resetForm,
    getFieldProps,
  };
}

function getPathSegments(path) {
  return String(path).replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
}

function getIn(object, path) {
  return getPathSegments(path).reduce(
    (value, segment) => (value == null ? undefined : value[segment]),
    object,
  );
}

function setIn(object, path, value) {
  const segments = getPathSegments(path);
  if (segments.length === 0) return object;

  const root = Array.isArray(object) ? [...object] : { ...object };
  let source = object;
  let target = root;

  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      target[segment] = value;
      return;
    }

    const nextSource = source?.[segment];
    const nextTarget = Array.isArray(nextSource)
      ? [...nextSource]
      : nextSource && typeof nextSource === 'object'
        ? { ...nextSource }
        : Number.isInteger(Number(segments[index + 1]))
          ? []
          : {};
    target[segment] = nextTarget;
    source = nextSource;
    target = nextTarget;
  });

  return root;
}