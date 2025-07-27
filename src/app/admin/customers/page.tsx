import { Suspense } from 'react';

export default function CustomersPage() {
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Customer Intelligence
          </h2>
          <p className="text-sm text-gray-500">
            AI-powered customer insights and segmentation
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Data
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Segments</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SegmentCard
            title="High Value Customers"
            count="156"
            change="+12"
            changeType="positive"
            color="green"
            description="LTV > ₹10,000"
          />
          <SegmentCard
            title="Churn Risk"
            count="89"
            change="+5"
            changeType="negative"
            color="red"
            description="No activity > 30 days"
          />
          <SegmentCard
            title="New Customers"
            count="234"
            change="+18"
            changeType="positive"
            color="blue"
            description="First purchase < 7 days"
          />
          <SegmentCard
            title="VIP Customers"
            count="45"
            change="+3"
            changeType="positive"
            color="purple"
            description="LTV > ₹25,000"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Customer Database</h3>
                <p className="mt-2 text-sm text-gray-700">
                  AI-powered customer insights and behavioral analysis
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add customer
                </button>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                          Customer
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          LTV
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Segments
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Last Purchase
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Churn Risk
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          AI Actions
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <CustomerRow
                        name="Priya Sharma"
                        email="priya@example.com"
                        ltv="₹25,000"
                        segments={['high_value', 'vip', 'art_lover']}
                        lastPurchase="2 days ago"
                        churnRisk="Low"
                        aiActions={['VIP offer sent', 'Cross-sell recommended']}
                      />
                      <CustomerRow
                        name="Raj Kumar"
                        email="raj@example.com"
                        ltv="₹5,000"
                        segments={['churn_risk', 'new_customer']}
                        lastPurchase="45 days ago"
                        churnRisk="High"
                        aiActions={['Retention campaign', 'Comeback offer']}
                      />
                      <CustomerRow
                        name="Anjali Patel"
                        email="anjali@example.com"
                        ltv="₹18,000"
                        segments={['high_value', 'festival_shopper']}
                        lastPurchase="1 week ago"
                        churnRisk="Medium"
                        aiActions={['Diwali campaign', 'Personalized recommendations']}
                      />
                      <CustomerRow
                        name="Vikram Singh"
                        email="vikram@example.com"
                        ltv="₹8,500"
                        segments={['regular', 'jewelry_lover']}
                        lastPurchase="3 days ago"
                        churnRisk="Low"
                        aiActions={['New collection alert', 'Upsell opportunity']}
                      />
                      <CustomerRow
                        name="Meera Reddy"
                        email="meera@example.com"
                        ltv="₹32,000"
                        segments={['vip', 'luxury_seeker', 'high_value']}
                        lastPurchase="Yesterday"
                        churnRisk="Very Low"
                        aiActions={['Exclusive access', 'Premium recommendations']}
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Customer Insights</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">Behavioral Patterns</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Peak shopping hours</span>
                  <span className="text-sm font-medium text-gray-900">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Preferred channel</span>
                  <span className="text-sm font-medium text-gray-900">WhatsApp (65%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average order value</span>
                  <span className="text-sm font-medium text-gray-900">₹3,250</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Purchase frequency</span>
                  <span className="text-sm font-medium text-gray-900">Every 18 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">AI Recommendations</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Launch VIP loyalty program</p>
                    <p className="text-sm text-gray-500">Target 45 high-value customers with exclusive benefits</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Churn prevention campaign</p>
                    <p className="text-sm text-gray-500">Send personalized offers to 89 at-risk customers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m-3 0v3.75m3-3.75h3m-3 0H9m1.5-12H4.5A2.25 2.25 0 002.25 6v12A2.25 2.25 0 004.5 20.25h15A2.25 2.25 0 0021.75 18V9A2.25 2.25 0 0019.5 6.75h-3.75z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New customer onboarding</p>
                    <p className="text-sm text-gray-500">Welcome series for 234 new customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SegmentCard({ title, count, change, changeType, color, description }: {
  title: string;
  count: string;
  change: string;
  changeType: 'positive' | 'negative';
  color: string;
  description: string;
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="ml-4">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
              {count}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            <span className={`font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerRow({ name, email, ltv, segments, lastPurchase, churnRisk, aiActions }: {
  name: string;
  email: string;
  ltv: string;
  segments: string[];
  lastPurchase: string;
  churnRisk: string;
  aiActions: string[];
}) {
  const segmentColors = {
    high_value: 'bg-green-100 text-green-800',
    vip: 'bg-purple-100 text-purple-800',
    churn_risk: 'bg-red-100 text-red-800',
    new_customer: 'bg-blue-100 text-blue-800',
    art_lover: 'bg-yellow-100 text-yellow-800',
    festival_shopper: 'bg-pink-100 text-pink-800',
    jewelry_lover: 'bg-indigo-100 text-indigo-800',
    luxury_seeker: 'bg-gray-100 text-gray-800',
    regular: 'bg-gray-100 text-gray-800',
  };

  const churnRiskColors = {
    'Very Low': 'text-green-600',
    'Low': 'text-green-600',
    'Medium': 'text-yellow-600',
    'High': 'text-red-600',
  };

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-gray-500">{email}</div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">{ltv}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex flex-wrap gap-1">
          {segments.map((segment) => (
            <span
              key={segment}
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${segmentColors[segment as keyof typeof segmentColors]}`}
            >
              {segment.replace('_', ' ')}
            </span>
          ))}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lastPurchase}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <span className={`font-medium ${churnRiskColors[churnRisk as keyof typeof churnRiskColors]}`}>
          {churnRisk}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          {aiActions.map((action, index) => (
            <div key={index} className="text-xs text-gray-600">{action}</div>
          ))}
        </div>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <button className="text-indigo-600 hover:text-indigo-900">
          View<span className="sr-only">, {name}</span>
        </button>
      </td>
    </tr>
  );
} 