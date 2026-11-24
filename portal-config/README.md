# TradeBridge Africa — Portal Config

Static assets deployed independently of the UI image. This workspace holds:

- **`translations/`** — i18n bundles loaded by the UI at runtime (English, Portuguese).
- **`legal/`** — Terms of Service and Privacy Policy, one file per country.
- **`assets/`** — Country flags, brand logos, and other media referenced from the UI.

## Why separate from the UI?

- Legal text changes without a UI release.
- Country additions do not require a full redeploy.
- CDN caching is tuned per asset type (long for flags, short for legal, hashed for translations).
- Translation updates land within minutes, not after a CI/CD cycle.

## Deployment

The CI workflow at `.github/workflows/publish-static.yml` uploads to S3 + invalidates the CDN on every push to `main`. Production rollout is automatic on merge.

## Structure
