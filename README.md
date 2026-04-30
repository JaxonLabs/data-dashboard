# Client Performance Hub (V1 Prototype)

A front-end-first SaaS-style prototype for consultants/agencies to manage client performance across connectors, KPI mapping, reports, and alerts.

## Run locally

No build step required for V1 prototype.

```bash
cd frontend
python -m http.server 4173
```

Then open: `http://localhost:4173/app.html`

## V1 scope included

- Multi-client workspace list
- Client overview command centre
- Data Sources page with scalable connector registry
- Mock connector flows (no real OAuth/API)
- CSV mock upload + column preview
- Metric Mapping page with standard KPI library
- Report Builder + saved reports (localStorage)
- Report Dashboard with KPI cards/charts/alerts/insights
- Alerts page with rule builder UI
- Settings page showing connector framework architecture

## Connector architecture

The shared registry lives in `frontend/src/data/connectors.js`.
All connector-driven screens read from this single source so adding new connectors is low-effort.

Included connector types:
- csv_upload
- google_sheets
- google_analytics
- google_ads
- meta_ads
- shopify
- klaviyo

## Notes

- Everything is mock data in V1.
- No login, OAuth, billing, API secrets, or external API calls.
- Persisted UI state uses localStorage only.
