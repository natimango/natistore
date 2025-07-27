import LoyaltyPointsDashboard from '../../components/LoyaltyPointsDashboard'

export default function LoyaltyPointsPage() {
  // In a real app, this would come from authentication
  const customerId = 'demo-customer-123'

  return (
    <div className="min-h-screen bg-gray-50">
      <LoyaltyPointsDashboard customerId={customerId} />
    </div>
  )
} 