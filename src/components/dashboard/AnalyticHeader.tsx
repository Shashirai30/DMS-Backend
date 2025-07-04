"use client"

import Select from "@/components/ui/Select"
import { Period } from "@/views/dashboards/AnalyticDashboard/types"
// import type { Period } from "../types"

type AnalyticHeaderProps = {
  selectedPeriod: Period
  onSelectedPeriodChange: (value: Period) => void
}

export const options: { value: Period; label: string }[] = [
  { value: "thisMonth", label: "Monthly" },
  { value: "thisWeek", label: "Weekly" },
  { value: "thisYear", label: "Annually" },
]

const AnalyticHeader = ({ selectedPeriod, onSelectedPeriodChange }: AnalyticHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
      <div>
        <h4 className="mb-1">Document Management Dashboard</h4>
        <p>Monitor document activity, user engagement, and system performance.</p>
      </div>
      <div className="flex items-center gap-2">
        <span>Filter by:</span>
        <Select
          className="w-[150px]"
          size="sm"
          placeholder="Select period"
          value={options.filter((option) => option.value === selectedPeriod)}
          options={options}
          isSearchable={false}
          onChange={(option) => {
            if (option?.value) {
              onSelectedPeriodChange(option?.value)
            }
          }}
        />
      </div>
    </div>
  )
}

export default AnalyticHeader
