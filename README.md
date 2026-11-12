# AIC Academy Shanzu

A responsive, browser-based school finance and administration workspace for a Kenyan school. The interface uses Kenyan shillings (KSh), the school crest, and a navy-blue design system (`#022269`).

**Live site:** <https://saintm254.github.io/HEROES-ACADEMY-FINANCES/>

> This is a demonstration workspace with fictional learners, staff and financial records. Data is stored in the current browser, not on a server. See [Data and privacy](#data-and-privacy) before using it with real school records.

## What is included

- **Overview and analytics:** fee collection, outstanding balances, account balances, expense summaries and comparison-driven charts. Chart bars are blue for the baseline/normal movement, green for an increase and red for a fall.
- **Students:** admissions, guardian contacts, class filters, fee status and learner records.
- **CBC and attendance:** school-based CBC observations using Exceeding / Meeting / Approaching / Below Expectation, printable learner reports and daily registers.
- **Fees, payroll and expenses:** invoices, partial/full payments, printable receipts, manually entered payroll deductions, payslips and expense records.
- **Accounts and bursaries:** separate Bank, M-Pesa and Cash ledgers; internal transfers; NG-CDF, county and school bursary tracking with distinct approval and disbursement steps.
- **Transport, inventory and communications:** route assignments, stock movements and low-stock alerts, plus printable parent notices.
- **Reports and settings:** CSV exports, printable reports, school profile settings, workspace backup/restore and a confirmed reset.

The top bar contains a universal search field (`Ctrl+K` / `Cmd+K`) instead of duplicate page navigation. The labelled sidebar can be collapsed, and the layout adapts to desktop, tablet and mobile screens.

## Important boundaries

- M-Pesa and bank entries are **manual ledger records**. There is no live payment feed or automatic reconciliation.
- Notices are prepared, copied or printed locally; the app does **not** send SMS, email or WhatsApp messages.
- PAYE, SHIF, NSSF and housing-levy amounts are entered manually. The app is not a statutory payroll calculator and does not file returns.
- CBC records are school-entered observations, not official KNEC results. Bursary records are administrative tracking, not submissions to a funder.
- The demo has no server-side authentication, roles or encryption. A public GitHub Pages site must not be treated as a secure multi-user student information system.

## Data and privacy

Workspace changes are saved to `localStorage` under `aic-shanzu.workspace.v1`. They remain specific to the browser and site address where they were entered; they are not shared with other users or devices.

Use **Settings → Export workspace backup** to keep a JSON copy, and **Settings → Import workspace backup** to restore a validated file. Importing replaces the current workspace after confirmation. Resetting requires typing `RESET`.

For production use with real learner or staff data, add authenticated server-side storage, role-based access, audit controls, encrypted backups and an appropriate Kenya Data Protection Act compliance process. Do not commit real records to this repository.

## Automatic deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. On changes to `main`, it installs dependencies, runs syntax and browser checks, builds the static site and deploys the `dist/` folder to GitHub Pages. Pull requests run the validation job without deploying.

The published app has no runtime package dependencies and makes no external font or API requests. All application files, styles, crest images and the Outfit font are served from the site itself.

## Maintainer commands

```sh
npm ci
npm run dev     # local preview at http://localhost:3000
npm run check   # JavaScript syntax checks
npm test        # Playwright workflow and responsive-layout tests
npm run build   # static output in dist/
```

The build is a plain HTML/CSS/JavaScript site and can be hosted from any static web server. The original dashboard and supplied SVG remain in the repository for reference; `index.html` is the redesigned application entry point.

The bundled Outfit font is distributed under the SIL Open Font License; see `assets/OFL.txt`.
