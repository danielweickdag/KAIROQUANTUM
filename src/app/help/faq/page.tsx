'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, HelpCircle, FileText, CreditCard, Shield } from 'lucide-react'

interface FAQSection {
  id: string
  title: string
  items: {
    id: string
    question: string
    answer: string
  }[]
}

const sections: FAQSection[] = [
  {
    id: 'fees',
    title: 'Platform and Regulated Services Fee Schedule',
    items: [
      {
        id: 'ach-return-fee',
        question: 'ACH Return Fee',
        answer:
          "DASTA Financial's clearing broker APEX Clearing Corporation (\"APEX\") charges an ACH return fee if a customer's initiated ACH Transfer (deposit or withdrawal) is returned and unsuccessful. Fee: $30."
      },
      {
        id: 'sec-regulatory-fee',
        question: 'SEC Regulatory Fee',
        answer:
          'The SEC fee is a transaction cost passed to the investor on the sale of exchange-listed and OTC securities to fund the SEC. $8.00 per $1,000,000 of principal (equity and option sells only), rounded up to the nearest penny.'
      },
      {
        id: 'trading-activity-fee',
        question: 'Trading Activity Fee (TAF)',
        answer:
          'Equity sells: $0.000166 per share; Option sells: $0.00279 per contract. Rounded up to the nearest penny. Equity fees are capped at $8.30 per trade.'
      }
    ]
  },
  {
    id: 'paper-docs',
    title: 'Paper Document Fees',
    items: [
      {
        id: 'paper-statement-monthly',
        question: 'Paper Statement Fee (Retail Paper Only) – per monthly statement',
        answer: '$5 per monthly statement.'
      },
      {
        id: 'paper-tax-statement',
        question: 'Paper Tax Statement Fee (Retail Paper Only) – per monthly statement',
        answer: '$5 per monthly tax statement.'
      },
      {
        id: 'paper-check-draft',
        question: 'Paper Check Draft / regular mail – domestic',
        answer: '$5 per check.'
      },
      {
        id: 'paper-trade-confirmation',
        question: 'Paper Statement Fee (Retail Paper Only) – per trade confirmation',
        answer: '$2 per trade confirmation.'
      }
    ]
  },
  {
    id: 'creator-program',
    title: 'Dub Advisors Creator Program Subscription Costs',
    items: [
      {
        id: 'creator-quarterly',
        question: 'Quarterly Plan',
        answer: 'Variable per Creator. Range $9.99–$199.99.'
      },
      {
        id: 'creator-annual',
        question: 'Annual Plan',
        answer: 'Variable per Creator. Range $99.99–$599.99.'
      }
    ]
  }
]

export default function FAQPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-center space-x-3">
              <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FAQ</h1>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-3">
              Common questions about fees, documents, and the Creator Program
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sections */}
        {sections.map(section => (
          <div key={section.id} className="mb-10">
            <div className="flex items-center space-x-2 mb-4">
              {section.id === 'fees' && <Shield className="h-5 w-5 text-gray-500" />}
              {section.id === 'paper-docs' && <FileText className="h-5 w-5 text-gray-500" />}
              {section.id === 'creator-program' && <CreditCard className="h-5 w-5 text-gray-500" />}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map(item => {
                const isOpen = !!expanded[item.id]
                return (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <span className="text-gray-900 dark:text-white font-medium text-left">{item.question}</span>
                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">{item.answer}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}