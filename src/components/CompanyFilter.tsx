import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface CompanyFilterProps {
  selectedCompany: string
  onCompanyChange: (company: string) => void
}

export default function CompanyFilter({ selectedCompany, onCompanyChange }: CompanyFilterProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const companies = [
    { value: 'all', label: t('allCompanies') },
    { value: 'Nike', label: t('nike') },
    { value: 'Adidas', label: t('adidas') }
  ]

  const selectedCompanyData = companies.find(c => c.value === selectedCompany) || companies[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      >
        <span>{selectedCompanyData.label}</span>
        <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {companies.map((company) => (
              <button
                key={company.value}
                onClick={() => {
                  onCompanyChange(company.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedCompany === company.value ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                }`}
              >
                {company.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay для закрытия dropdown при клике вне */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 