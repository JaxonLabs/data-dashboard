# data-dashboard

## Integrating Shopify + social media data

This starter now includes source types and setup UX for:
- Shopify (`shopify`)
- Meta Ads (`meta_ads`)
- Google Ads (`google_ads`)
- LinkedIn Ads (`linkedin_ads`)

### Backend endpoints

- `POST /integrations` — register a connected source
- `GET /integrations` — list current connections
- `GET /integrations/{integration_id}/metrics` — return recommended KPI metrics for that source
- `POST /integrations/{integration_id}/sync` — queue a sync job (stubbed)
- `PUT /dashboard/{owner}` — save dashboard widget layout
- `GET /dashboard/{owner}` — load dashboard layout

### Run backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Setup page

Open `frontend/setup.html` in a browser and:
1. Connect Shopify and ad platforms.
2. Fetch recommended metrics per source.
3. Queue a backfill sync.
4. Save dashboard widget choices.

## Production guidance for Shopify + social

1. **OAuth + token refresh**
   - Shopify: private/public app auth with scoped permissions.
   - Social APIs: Meta/Google/LinkedIn OAuth flows and token rotation.
2. **Data model harmonization**
   - Normalize spend, clicks, impressions, conversions, revenue into common fact tables.
3. **Attribution strategy**
   - Define source-of-truth rules for blended ROAS and multi-touch attribution.
4. **Incremental syncs**
   - Pull daily/hourly deltas with idempotent upserts.
5. **Data quality checks**
   - Alert on missing dates, spend anomalies, and API quota failures.
