from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Executive Dashboard Setup API")

IntegrationType = Literal[
    "salesforce",
    "hubspot",
    "quickbooks",
    "netsuite",
    "google_sheets",
    "excel_upload",
    "shopify",
    "meta_ads",
    "google_ads",
    "linkedin_ads",
]


class IntegrationRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    integration_type: IntegrationType
    account_identifier: str = Field(min_length=2, max_length=120)


class WidgetConfig(BaseModel):
    key: str
    title: str
    source: str
    chart: Literal["line", "bar", "kpi", "table"]


class DashboardConfig(BaseModel):
    dashboard_name: str = Field(min_length=2, max_length=120)
    refresh_minutes: int = Field(default=60, ge=5, le=1440)
    widgets: list[WidgetConfig] = Field(default_factory=list)


class SyncRequest(BaseModel):
    lookback_days: int = Field(default=30, ge=1, le=365)


integrations: list[dict] = []
dashboard_configs: dict[str, DashboardConfig] = {}

# Recommended starter metrics by source to help dashboard setup.
SOURCE_METRIC_MAP: dict[str, list[str]] = {
    "shopify": ["orders", "gross_sales", "net_sales", "aov", "refund_rate"],
    "meta_ads": ["spend", "impressions", "clicks", "ctr", "cpa", "roas"],
    "google_ads": ["spend", "impressions", "clicks", "ctr", "conversions", "roas"],
    "linkedin_ads": ["spend", "impressions", "clicks", "leads", "cpl"],
}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/integrations")
def list_integrations() -> list[dict]:
    return integrations


@app.post("/integrations")
def add_integration(payload: IntegrationRequest) -> dict:
    integration_id = f"int_{len(integrations) + 1}"
    item = {
        "id": integration_id,
        "name": payload.name,
        "integration_type": payload.integration_type,
        "account_identifier": payload.account_identifier,
        "status": "connected",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    integrations.append(item)
    return item


@app.get("/integrations/{integration_id}/metrics")
def integration_metrics(integration_id: str) -> dict:
    integration = next((row for row in integrations if row["id"] == integration_id), None)
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    integration_type = integration["integration_type"]
    return {
        "integration_id": integration_id,
        "integration_type": integration_type,
        "recommended_metrics": SOURCE_METRIC_MAP.get(integration_type, []),
    }


@app.post("/integrations/{integration_id}/sync")
def sync_integration(integration_id: str, payload: SyncRequest) -> dict:
    integration = next((row for row in integrations if row["id"] == integration_id), None)
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    # Stubbed response that mirrors what a real ingestion job kickoff might return.
    return {
        "job_id": f"sync_{integration_id}_{int(datetime.now(timezone.utc).timestamp())}",
        "integration_id": integration_id,
        "integration_type": integration["integration_type"],
        "lookback_days": payload.lookback_days,
        "status": "queued",
    }


@app.put("/dashboard/{owner}")
def save_dashboard(owner: str, payload: DashboardConfig) -> dict:
    dashboard_configs[owner] = payload
    return {"owner": owner, "saved": True, "widget_count": len(payload.widgets)}


@app.get("/dashboard/{owner}")
def get_dashboard(owner: str) -> DashboardConfig:
    if owner not in dashboard_configs:
        raise HTTPException(status_code=404, detail="Dashboard config not found")
    return dashboard_configs[owner]
