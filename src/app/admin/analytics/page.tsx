'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    trend: 'up' | 'down';
    monthly: { month: string; value: number }[];
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    churnRate: number;
  };
  products: {
    total: number;
    topSelling: Array<{
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
  aiInsights: Array<{
    type: 'opportunity' | 'warning' | 'success';
    title: string;
    description: string;
    impact: string;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setData({
        revenue: {
          total: 2450000,
          change: 12.5,
          trend: 'up',
          monthly: [
            { month: 'Jan', value: 1800000 },
            { month: 'Feb', value: 1950000 },
            { month: 'Mar', value: 2100000 },
            { month: 'Apr', value: 2250000 },
            { month: 'May', value: 2350000 },
            { month: 'Jun', value: 2450000 },
          ]
        },
        customers: {
          total: 1234,
          new: 234,
          returning: 1000,
          churnRate: 8.5
        },
        products: {
          total: 156,
          topSelling: [
            { name: 'Handcrafted Silver Jewelry Set', sales: 89, revenue: 445000 },
            { name: 'Traditional Cotton Saree', sales: 67, revenue: 335000 },
            { name: 'Artisan Pottery Collection', sales: 45, revenue: 225000 },
            { name: 'Embroidered Home Decor', sales: 34, revenue: 170000 },
            { name: 'Natural Dye Scarves', sales: 28, revenue: 140000 },
          ]
        },
        aiInsights: [
          {
            type: 'opportunity',
            title: 'Diwali Season Opportunity',
            description: 'Historical data shows 40% revenue increase during Diwali. AI suggests launching pre-festival campaign.',
            impact: 'Potential ₹8,00,000 additional revenue'
          },
          {
            type: 'warning',
            title: 'Cart Abandonment Spike',
            description: 'Cart abandonment rate increased by 15% in last 7 days. AI recommends immediate recovery campaign.',
            impact: 'Risk of ₹1,20,000 lost revenue'
          },
          {
            type: 'success',
            title: 'VIP Customer Engagement',
            description: 'VIP customer segment showing 67% higher engagement with personalized campaigns.',
            impact: '₹2,45,000 revenue generated'
          },
          {
            type: 'opportunity',
            title: 'New Market Segment',
            description: 'AI identified 500+ potential customers in luxury segment based on browsing patterns.',
            impact: 'Potential ₹15,00,000 new revenue'
          }
        ]
      });
      setLoading(false);
    }, 1500);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return (
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-blue-50 border-blue-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Business Intelligence
          </h2>
          <p className="text-sm text-gray-500">
            AI-powered analytics and insights for data-driven decisions
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{(data.revenue.total / 100000).toFixed(1)}L</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className={`font-medium ${data.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {data.revenue.trend === 'up' ? '+' : ''}{data.revenue.change}%
              </span>
              <span className="text-gray-500"> from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.customers.total.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600">+{data.customers.new}</span>
              <span className="text-gray-500"> new this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Products Sold</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.products.total}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-gray-900">{data.products.topSelling.length}</span>
              <span className="text-gray-500"> top performers</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Churn Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.customers.churnRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600">-2.1%</span>
              <span className="text-gray-500"> from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {data.revenue.monthly.map((item, index) => {
                const height = (item.value / Math.max(...data.revenue.monthly.map(m => m.value))) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-indigo-600 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{item.month}</div>
                    <div className="text-xs font-medium text-gray-900">₹{(item.value / 100000).toFixed(1)}L</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products and AI Insights */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top Selling Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {data.products.topSelling.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sales} units sold</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">₹{(product.revenue / 1000).toFixed(0)}K</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Insights</h3>
            <div className="space-y-4">
              {data.aiInsights.map((insight, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <p className="text-sm font-medium text-gray-900 mt-2">{insight.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Analytics</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{data.customers.new}</div>
                <div className="text-sm text-gray-500">New Customers</div>
                <div className="text-xs text-green-600 mt-1">+18% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{data.customers.returning}</div>
                <div className="text-sm text-gray-500">Returning Customers</div>
                <div className="text-xs text-blue-600 mt-1">81% of total base</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{data.customers.churnRate}%</div>
                <div className="text-sm text-gray-500">Churn Rate</div>
                <div className="text-xs text-green-600 mt-1">-2.1% improvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 