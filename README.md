# data-dashboard

Build an executive dashboard that connects business systems (CRM, finance, ecommerce, ads, spreadsheets) into one decision-making view.

## What this repo includes

- `backend/main.py` — FastAPI setup API for integrations and dashboard config.
- `frontend/setup.html` — simple setup page to link sources and customize widgets.
- `docs/MERGE_CONFLICTS.md` — step-by-step guide for resolving merge conflicts into `main`.

## Quick start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Then open `frontend/setup.html` in your browser.

## Integrations currently modeled

- Shopify
- Meta Ads
- Google Ads
- LinkedIn Ads
- Salesforce
- HubSpot
- QuickBooks
- NetSuite
- Google Sheets
- Excel Upload
