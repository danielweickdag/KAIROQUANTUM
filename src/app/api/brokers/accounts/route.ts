import { NextRequest, NextResponse } from 'next/server';

// Mock broker account data for development
const mockBrokerAccounts = [
  {
    id: 'acc_1',
    connectionId: 'conn_1',
    brokerType: 'ALPACA',
    brokerName: 'Alpaca Markets',
    accountName: 'Main Trading Account',
    accountNumber: 'ALPACA123456',
    accountType: 'MARGIN',
    status: 'ACTIVE',
    environment: 'sandbox',
    buyingPower: 25000.00,
    cashBalance: 10000.00,
    portfolioValue: 15000.00,
    dayTradingBuyingPower: 100000.00,
    maintenanceMargin: 2500.00,
    currency: 'USD',
    isActive: true,
    isConnected: true,
    lastSyncAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'acc_2',
    connectionId: 'conn_2',
    brokerType: 'INTERACTIVE_BROKERS',
    brokerName: 'Interactive Brokers',
    accountName: 'IB Pro Account',
    accountNumber: 'IB987654',
    accountType: 'CASH',
    status: 'ACTIVE',
    environment: 'production',
    buyingPower: 50000.00,
    cashBalance: 45000.00,
    portfolioValue: 52000.00,
    dayTradingBuyingPower: 0.00,
    maintenanceMargin: 0.00,
    currency: 'USD',
    isActive: true,
    isConnected: true,
    lastSyncAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'acc_3',
    connectionId: 'conn_3',
    brokerType: 'TD_AMERITRADE',
    brokerName: 'TD Ameritrade',
    accountName: 'TD Trading',
    accountNumber: 'TD555777',
    accountType: 'MARGIN',
    status: 'ACTIVE',
    environment: 'production',
    buyingPower: 75000.00,
    cashBalance: 30000.00,
    portfolioValue: 85000.00,
    dayTradingBuyingPower: 300000.00,
    maintenanceMargin: 5000.00,
    currency: 'USD',
    isActive: true,
    isConnected: true,
    lastSyncAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Verify the authentication token
    // 2. Get the user ID from the token
    // 3. Fetch the user's broker accounts from the database
    
    // For now, we'll return mock data
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Return empty accounts for unauthenticated users
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Simulate a small delay to mimic real API behavior
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: mockBrokerAccounts
    });
  } catch (error) {
    console.error('Error fetching broker accounts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch broker accounts'
      },
      { status: 500 }
    );
  }
}