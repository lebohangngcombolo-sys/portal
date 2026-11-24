/**
 * Client-side password policy hints (spec §3.4).
 *
 * The server is the authoritative enforcer — this file only powers
 * live feedback for the password input. All rules here mirror the
 * server-side `PasswordPolicyEvaluator`.
 */

export const DEFAULT_POLICY = Object.freeze({
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSymbol: true,
  forbiddenSubstrings: ['password', 'tradebridge', '123456'],
});

/**
 * Evaluate a password against the policy.
 *
 * @param {string} password
 * @param {object} [policy]
 * @returns {{
 *   valid: boolean,
 *   rules: Array<{key: string, label: string, satisfied: boolean}>,
 *   failedRules: string[],
 * }}
 */
export function evaluatePassword(password, policy = DEFAULT_POLICY) {
  const pwd = password || '';
  const rules = [
    {
      key: 'minLength',
      label: `At least ${policy.minLength} characters`,
      satisfied: pwd.length >= policy.minLength,
    },
    {
      key: 'maxLength',
      label: `At most ${policy.maxLength} characters`,
      satisfied: pwd.length <= policy.maxLength && pwd.length > 0,
    },
    {
      key: 'uppercase',
      label: 'Contains an uppercase letter',
      satisfied: !policy.requireUppercase || /[A-Z]/.test(pwd),
    },
    {
      key: 'lowercase',
      label: 'Contains a lowercase letter',
      satisfied: !policy.requireLowercase || /[a-z]/.test(pwd),
    },
    {
      key: 'digit',
      label: 'Contains a digit',
      satisfied: !policy.requireDigit || /\d/.test(pwd),
    },
    {
      key: 'symbol',
      label: 'Contains a symbol',
      satisfied: !policy.requireSymbol || /[^A-Za-z0-9]/.test(pwd),
    },
    {
      key: 'forbidden',
      label: 'Does not contain forbidden sequences',
      satisfied: !policy.forbiddenSubstrings.some((s) =>
        pwd.toLowerCase().includes(s.toLowerCase()),
      ),
    },
  ];
  const failedRules = rules.filter((r) => !r.satisfied).map((r) => r.key);
  return { valid: failedRules.length === 0, rules, failedRules };
}

/**
 * Compute a rough strength score (0..4) for the strength meter.
 */
export function passwordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}