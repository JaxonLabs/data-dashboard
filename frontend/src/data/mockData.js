import { connectorRegistry } from './connectors.js';

export const metricsLibrary = [
  'Revenue','Orders','AOV','Sessions','Users','Leads','Conversions','Purchases','New Customers','Repeat Customers','Ad Spend','Impressions','Reach','Frequency','Clicks','CTR','CPC','CPM','CPA','CAC','ROAS','Conversion Rate','Email Revenue','Email Open Rate','Email Click Rate','Gross Margin','Net Profit'
];

export const clients = [
  {id:'c1',name:'7 Summits Snacks',industry:'Ecommerce',primaryGoal:'Scale profitable revenue',status:'active',dataSources:['shopify','meta_ads','google_ads','klaviyo'],reports:['r1'],alerts:['a1','a2'],lastUpdated:'2026-04-29',primaryKpi:{name:'ROAS',value:'2.7',trend:'+0.3'}},
  {id:'c2',name:'Fort Tractor Supply',industry:'Retail & Lead Gen',primaryGoal:'Increase qualified leads',status:'active',dataSources:['google_ads','google_analytics','csv_upload'],reports:['r2'],alerts:['a3'],lastUpdated:'2026-04-28',primaryKpi:{name:'Leads',value:'412',trend:'+8%'}},
  {id:'c3',name:"Bubbles Don’t Count",industry:'Beverage DTC',primaryGoal:'Improve blended CAC',status:'active',dataSources:['shopify','meta_ads','google_sheets'],reports:['r3'],alerts:['a4'],lastUpdated:'2026-04-30',primaryKpi:{name:'CAC',value:'$38',trend:'-6%'}}
];

export const reports = [
  {id:'r1',clientId:'c1',name:'April Ecommerce Performance',template:'Ecommerce Performance',dateRange:'Last 30 days',selectedMetrics:['Revenue','Orders','AOV','Ad Spend','ROAS'],selectedCharts:['Revenue over time','Ad spend vs revenue'],includedSources:['shopify','meta_ads','google_ads','klaviyo'],notes:'Scale top 2 campaigns and test new creatives.'}
];

export const mappings = [
  {id:'m1',clientId:'c1',sourceId:'google_ads',rawField:'cost',standardMetricId:'Ad Spend',dataType:'currency',sampleValue:'2340.44'},
  {id:'m2',clientId:'c1',sourceId:'meta_ads',rawField:'actions.purchase',standardMetricId:'Purchases',dataType:'number',sampleValue:'312'},
  {id:'m3',clientId:'c1',sourceId:'shopify',rawField:'total_sales',standardMetricId:'Revenue',dataType:'currency',sampleValue:'32890.12'}
];

export const alerts = [
  {id:'a1',clientId:'c1',severity:'Warning',metricId:'ROAS',message:'ROAS dropped below 2.0 in last 3 days.',currentValue:'1.8',triggeredAt:'2026-04-29',suggestedAction:'Pause low CTR ad sets and refresh creatives.'},
  {id:'a2',clientId:'c1',severity:'Critical',metricId:'Data Freshness',message:'Shopify source has not synced in 7 days.',currentValue:'7 days stale',triggeredAt:'2026-04-30',suggestedAction:'Reconnect store and run backfill sync.'}
];

export const trendSeries = [
  {date:'Week 1',revenue:19000,spend:6200,roas:3.06,orders:510},
  {date:'Week 2',revenue:20500,spend:7200,roas:2.85,orders:540},
  {date:'Week 3',revenue:18500,spend:7600,roas:2.43,orders:500},
  {date:'Week 4',revenue:22400,spend:8100,roas:2.76,orders:590}
];

export function getConnector(id){return connectorRegistry.find(c=>c.id===id);} 
