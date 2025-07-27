import { Suspense } from 'react';

export default function AIAgentPage() {
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            AI Marketing Agent Control
          </h2>
          <p className="text-sm text-gray-500">
            Monitor and control your intelligent marketing automation system
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
            </svg>
            Start Agent
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
            </svg>
            Stop Agent
          </button>
        </div>
      </div>

      {/* Agent Status */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">Agent Status</h3>
                <p className="mt-1 text-sm text-green-600 font-medium">Active & Running</p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">Uptime</h3>
                <p className="mt-1 text-sm text-blue-600 font-medium">24h 32m 15s</p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m-3 0v3.75m3-3.75h3m-3 0H9m1.5-12H4.5A2.25 2.25 0 002.25 6v12A2.25 2.25 0 004.5 20.25h15A2.25 2.25 0 0021.75 18V9A2.25 2.25 0 0019.5 6.75h-3.75z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">Campaigns Active</h3>
                <p className="mt-1 text-sm text-purple-600 font-medium">47</p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">Messages Sent</h3>
                <p className="mt-1 text-sm text-orange-600 font-medium">1,234</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modules Status */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Intelligence Modules</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AIModuleCard
            title="Customer Intelligence"
            description="Analyzes customer behavior and segments"
            status="active"
            accuracy="89%"
            lastUpdate="2 min ago"
          />
          <AIModuleCard
            title="Pricing Intelligence"
            description="Dynamic pricing and competitive analysis"
            status="active"
            accuracy="85%"
            lastUpdate="5 min ago"
          />
          <AIModuleCard
            title="Product Intelligence"
            description="Product recommendations and trend analysis"
            status="active"
            accuracy="92%"
            lastUpdate="1 min ago"
          />
          <AIModuleCard
            title="Journey Intelligence"
            description="Customer journey mapping and optimization"
            status="active"
            accuracy="87%"
            lastUpdate="3 min ago"
          />
          <AIModuleCard
            title="Communication Intelligence"
            description="Multi-channel messaging and personalization"
            status="active"
            accuracy="91%"
            lastUpdate="30 sec ago"
          />
          <AIModuleCard
            title="Market Intelligence"
            description="Competitor monitoring and market trends"
            status="active"
            accuracy="88%"
            lastUpdate="4 min ago"
          />
        </div>
      </div>

      {/* Real-time Activity Log */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Real-time Activity Log</h3>
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">Cart abandonment recovery sent to <span className="font-medium text-gray-900">Priya Sharma</span> via WhatsApp</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime="2024-01-15T10:30:00">2 min ago</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">Dynamic pricing updated for <span className="font-medium text-gray-900">Handcrafted Jewelry</span> (₹2,500 → ₹2,700)</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime="2024-01-15T10:25:00">7 min ago</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m-3 0v3.75m3-3.75h3m-3 0H9m1.5-12H4.5A2.25 2.25 0 002.25 6v12A2.25 2.25 0 004.5 20.25h15A2.25 2.25 0 0021.75 18V9A2.25 2.25 0 0019.5 6.75h-3.75z" />
                          </svg>
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">Diwali campaign launched with <span className="font-medium text-gray-900">1,250</span> targeted customers</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime="2024-01-15T10:20:00">12 min ago</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">Competitor <span className="font-medium text-gray-900">Craftsvilla</span> reduced prices - AI agent adjusting strategy</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime="2024-01-15T10:15:00">17 min ago</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">New customer <span className="font-medium text-gray-900">Raj Kumar</span> identified as high-value prospect</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime="2024-01-15T10:10:00">22 min ago</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIModuleCard({ title, description, status, accuracy, lastUpdate }: {
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  accuracy: string;
  lastUpdate: string;
}) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    active: (
      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    inactive: (
      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {statusIcons[status]}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="ml-4">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">Accuracy: <span className="font-medium text-gray-900">{accuracy}</span></span>
          <span className="text-gray-400">{lastUpdate}</span>
        </div>
      </div>
    </div>
  );
} 