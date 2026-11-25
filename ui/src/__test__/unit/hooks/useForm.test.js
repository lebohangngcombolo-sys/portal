import { act, renderHook } from '@testing-library/react';

import { useForm } from '../../../hooks/useForm.js';

describe('useForm nested fields', () => {
  it('updates controlled values inside array fields', async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: {
          representatives: [{ repAuthorizedSignatory: false }],
        },
        validateOnChange: false,
      }),
    );

    await act(async () => {
      await result.current.setFieldValue('representatives[0].repAuthorizedSignatory', true);
    });

    expect(result.current.values.representatives[0].repAuthorizedSignatory).toBe(true);
    expect(result.current.getFieldProps('representatives[0].repAuthorizedSignatory').value).toBe(
      true,
    );
  });
});
