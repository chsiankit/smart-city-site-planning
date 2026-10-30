# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

---

## API Keys & Secrets Management

1. **Server-Side Isolation:**
   - Private API keys (including `GEMINI_API_KEY`) must **never** be injected into client bundles, browser `window` objects, or client-side environment variables (`VITE_*`).
   - All AI interactions run exclusively through the Express backend proxy endpoints (`/api/gemma/*`).

2. **Commit Hygiene:**
   - Never commit `.env` files containing live secrets to version control.
   - Use `.env.example` as a template with placeholder values only.
   - Pre-commit hooks and CI scans block potential credential leaks.

---

## Reporting a Vulnerability

If you discover a potential security vulnerability within this repository:

1. **Do not create a public GitHub issue.**
2. Send an email to the project maintainers with details, reproduction steps, and potential impact.
3. We will acknowledge receipt of your vulnerability report within 48 hours and provide a status update on remediation.
4. Once patched, we will publicly credit your contribution in our release notes (unless you request anonymity).
