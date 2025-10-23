import { NextResponse } from 'next/server';

const supportedBrokers = [
  {
    id: 'ALPACA',
    name: 'Alpaca Markets',
    description: 'Commission-free trading with powerful APIs',
    logo: '/images/brokers/alpaca.png',
    features: ['Commission-free stocks', 'Crypto trading', 'Paper trading', 'Real-time data'],
    supported: true,
    environment: ['sandbox', 'production']
  },
  {
    id: 'INTERACTIVE_BROKERS',
    name: 'Interactive Brokers',
    description: 'Professional trading platform with global market access',
    logo: '/images/brokers/ib.png',
    features: ['Global markets', 'Low commissions', 'Advanced tools', 'Multiple asset classes'],
    supported: true,
    environment: ['production']
  },
  {
    id: 'TD_AMERITRADE',
    name: 'TD Ameritrade',
    description: 'Full-service broker with comprehensive research',
    logo: '/images/brokers/td.png',
    features: ['Research tools', 'Education', 'Mobile app', 'Options trading'],
    supported: true,
    environment: ['production']
  },
  {
    id: 'CHARLES_SCHWAB',
    name: 'Charles Schwab',
    description: 'Full-service investment firm',
    logo: '/images/brokers/schwab.png',
    features: ['No commission stocks', 'Research', 'Advisory services', 'Banking'],
    supported: false,
    environment: []
  },
  {
    id: 'FIDELITY',
    name: 'Fidelity',
    description: 'Investment management and financial services',
    logo: '/images/brokers/fidelity.png',
    features: ['Zero commission trades', 'Research', 'Retirement planning', 'Mutual funds'],
    supported: false,
    environment: []
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: supportedBrokers
    });
  } catch (error) {
    console.error('Error fetching supported brokers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch supported brokers'
      },
      { status: 500 }
    );
  }
}