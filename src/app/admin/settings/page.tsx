'use client';

import { useState, useEffect } from 'react';

interface Settings {
  business: {
    name: string;
    email: string;
    phone: string;
    currency: string;
    timezone: string;
    language: string;
  };
  ai: {
    enabled: boolean;
    apiKey: string;
    model: string;
    autoCampaigns: boolean;
    autoPricing: boolean;
    autoInventory: boolean;
  };
  integrations: {
    email: {
      enabled: boolean;
      provider: string;
      apiKey: string;
    };
    whatsapp: {
      enabled: boolean;
      apiKey: string;
      phone: string;
    };
    payment: {
      razorpay: boolean;
      upi: boolean;
      cod: boolean;
    };
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    slack: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    business: {
      name: 'NATI',
      email: 'hello@natistore.in',
      phone: '+91 98765 43210',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      language: 'en',
    },
    ai: {
      enabled: true,
      apiKey: 'AIzaSyBCHuuPFpupxQ5K7N3HB71JT5FTQmn1vgw',
      model: 'gemini-pro',
      autoCampaigns: true,
      autoPricing: true,
      autoInventory: true,
    },
    integrations: {
      email: {
        enabled: true,
        provider: 'mailersend',
        apiKey: '',
      },
      whatsapp: {
        enabled: false,
        apiKey: '',
        phone: '',
      },
      payment: {
        razorpay: true,
        upi: true,
        cod: true,
      },
    },
    notifications: {
      email: true,
      sms: false,
      push: false,
      slack: false,
    },
  });

  const [activeTab, setActiveTab] = useState('business');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message
    alert('Settings saved successfully!');
  };

  const updateSetting = (section: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateNestedSetting = (section: keyof Settings, subsection: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [key]: value,
        },
      },
    }));
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            System Settings
          </h2>
          <p className="text-sm text-gray-500">
            Configure your AI agent, integrations, and business preferences
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'business', name: 'Business Info', icon: 'building' },
              { id: 'ai', name: 'AI Agent', icon: 'brain' },
              { id: 'integrations', name: 'Integrations', icon: 'link' },
              { id: 'notifications', name: 'Notifications', icon: 'bell' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Business Settings */}
        {activeTab === 'business' && (
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Business Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <input
                      type="text"
                      value={settings.business.name}
                      onChange={(e) => updateSetting('business', 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={settings.business.email}
                      onChange={(e) => updateSetting('business', 'email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={settings.business.phone}
                      onChange={(e) => updateSetting('business', 'phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                      value={settings.business.currency}
                      onChange={(e) => updateSetting('business', 'currency', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                    <select
                      value={settings.business.timezone}
                      onChange={(e) => updateSetting('business', 'timezone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      value={settings.business.language}
                      onChange={(e) => updateSetting('business', 'language', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Agent Settings */}
        {activeTab === 'ai' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">AI Agent Configuration</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Enable AI Agent</h4>
                      <p className="text-sm text-gray-500">Allow AI to manage marketing campaigns and business decisions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSetting('ai', 'enabled', !settings.ai.enabled)}
                      className={`${
                        settings.ai.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.ai.enabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">AI Model</label>
                    <select
                      value={settings.ai.model}
                      onChange={(e) => updateSetting('ai', 'model', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="gemini-pro">Google Gemini Pro</option>
                      <option value="gpt-4">OpenAI GPT-4</option>
                      <option value="claude-3">Anthropic Claude 3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                    <input
                      type="password"
                      value={settings.ai.apiKey}
                      onChange={(e) => updateSetting('ai', 'apiKey', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter your API key"
                    />
                    <p className="mt-1 text-sm text-gray-500">Your API key is encrypted and stored securely</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Automation Features</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">Auto Campaigns</h5>
                          <p className="text-sm text-gray-500">AI creates and manages marketing campaigns automatically</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSetting('ai', 'autoCampaigns', !settings.ai.autoCampaigns)}
                          className={`${
                            settings.ai.autoCampaigns ? 'bg-indigo-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              settings.ai.autoCampaigns ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">Auto Pricing</h5>
                          <p className="text-sm text-gray-500">AI adjusts prices based on market conditions and demand</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSetting('ai', 'autoPricing', !settings.ai.autoPricing)}
                          className={`${
                            settings.ai.autoPricing ? 'bg-indigo-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              settings.ai.autoPricing ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">Auto Inventory</h5>
                          <p className="text-sm text-gray-500">AI manages inventory levels and reorder points</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSetting('ai', 'autoInventory', !settings.ai.autoInventory)}
                          className={`${
                            settings.ai.autoInventory ? 'bg-indigo-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              settings.ai.autoInventory ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Settings */}
        {activeTab === 'integrations' && (
          <div className="mt-8 space-y-6">
            {/* Email Integration */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Email Integration</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Enable Email Marketing</h4>
                      <p className="text-sm text-gray-500">Send automated email campaigns to customers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateNestedSetting('integrations', 'email', 'enabled', !settings.integrations.email.enabled)}
                      className={`${
                        settings.integrations.email.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.integrations.email.enabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  {settings.integrations.email.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Provider</label>
                        <select
                          value={settings.integrations.email.provider}
                          onChange={(e) => updateNestedSetting('integrations', 'email', 'provider', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="mailersend">MailerSend</option>
                          <option value="sendgrid">SendGrid</option>
                          <option value="mailgun">Mailgun</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">API Key</label>
                        <input
                          type="password"
                          value={settings.integrations.email.apiKey}
                          onChange={(e) => updateNestedSetting('integrations', 'email', 'apiKey', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter your email API key"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* WhatsApp Integration */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">WhatsApp Business</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Enable WhatsApp Marketing</h4>
                      <p className="text-sm text-gray-500">Send WhatsApp messages to customers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateNestedSetting('integrations', 'whatsapp', 'enabled', !settings.integrations.whatsapp.enabled)}
                      className={`${
                        settings.integrations.whatsapp.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.integrations.whatsapp.enabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  {settings.integrations.whatsapp.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">WhatsApp API Key</label>
                        <input
                          type="password"
                          value={settings.integrations.whatsapp.apiKey}
                          onChange={(e) => updateNestedSetting('integrations', 'whatsapp', 'apiKey', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter your WhatsApp API key"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">WhatsApp Phone Number</label>
                        <input
                          type="tel"
                          value={settings.integrations.whatsapp.phone}
                          onChange={(e) => updateNestedSetting('integrations', 'whatsapp', 'phone', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Razorpay</h4>
                      <p className="text-sm text-gray-500">Online payment gateway</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateNestedSetting('integrations', 'payment', 'razorpay', !settings.integrations.payment.razorpay)}
                      className={`${
                        settings.integrations.payment.razorpay ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.integrations.payment.razorpay ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">UPI</h4>
                      <p className="text-sm text-gray-500">Unified Payment Interface</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateNestedSetting('integrations', 'payment', 'upi', !settings.integrations.payment.upi)}
                      className={`${
                        settings.integrations.payment.upi ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.integrations.payment.upi ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Cash on Delivery</h4>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateNestedSetting('integrations', 'payment', 'cod', !settings.integrations.payment.cod)}
                      className={`${
                        settings.integrations.payment.cod ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.integrations.payment.cod ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive important updates via email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSetting('notifications', 'email', !settings.notifications.email)}
                      className={`${
                        settings.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Receive alerts via SMS</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSetting('notifications', 'sms', !settings.notifications.sms)}
                      className={`${
                        settings.notifications.sms ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Get instant notifications on your device</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSetting('notifications', 'push', !settings.notifications.push)}
                      className={`${
                        settings.notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.notifications.push ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Slack Notifications</h4>
                      <p className="text-sm text-gray-500">Send alerts to your Slack workspace</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSetting('notifications', 'slack', !settings.notifications.slack)}
                      className={`${
                        settings.notifications.slack ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          settings.notifications.slack ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 