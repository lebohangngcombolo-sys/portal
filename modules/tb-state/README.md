# tb-state

Shared HTTP + storage library for the TradeBridge Africa frontend.

Zero runtime dependencies. Uses browser APIs (XMLHttpRequest, Cache API,
sessionStorage, localStorage) with an in-memory fallback for environments
where those aren't available.

## Install

Within the workspace:

```bash
yarn workspace tb-state build