"use client"

import Card from "@/components/ui/Card"
import GrowShrinkValue from "@/components/shared/GrowShrinkValue"
import classNames from "@/utils/classNames"
import { NumericFormat } from "react-number-format"
import { TbFiles, TbUsers, TbCheck } from "react-icons/tb"
// import type { MetricsData, Period } from "../types"
import type { ReactNode } from "react"
import { MetricsData, Period } from "@/views/dashboards/AnalyticDashboard/types"

type WidgetProps = {
  title: string
  value: string | number | ReactNode
  growShrink: number
  compareFrom: string
  icon: ReactNode
  iconClass: string
}

type MetricsNewProps = {
  data?: MetricsData | null
  selectedPeriod: Period
}

const vsPeriod: Record<Period, string> = {
  thisMonth: "vs last month",
  thisWeek: "vs last week",
  thisYear: "vs last year",
}

const Widget = ({ title, growShrink = 0, value = 0, compareFrom, icon, iconClass }: WidgetProps) => {
  return (
    <Card className="flex-1">
      <div className="flex justify-between gap-2 relative">
        <div>
          <div className="mb-4 text-sm text-gray-600">{title}</div>
          <h3 className="mb-2">{value}</h3>
          <div className="inline-flex items-center flex-wrap gap-1">
            <GrowShrinkValue
              className="font-bold text-xs"
              value={growShrink}
              suffix="%"
              positiveIcon="+"
              negativeIcon=""
            />
            <span className="text-xs text-gray-500">{compareFrom}</span>
          </div>
        </div>
        <div
          className={classNames(
            "flex items-center justify-center min-h-10 min-w-10 max-h-10 max-w-10 text-gray-900 rounded-full text-xl",
            iconClass,
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}

const Metrics = ({ data, selectedPeriod }: MetricsNewProps) => {
  console.log("🆕 MetricsNew component received:", { data, selectedPeriod })

  // Simple, safe extraction
  const totalDocsValue = data?.totalDocuments?.value || 0
  const totalDocsGrowth = data?.totalDocuments?.growShrink || 0

  const activeUsersValue = data?.activeUsers?.value || 0
  const activeUsersGrowth = data?.activeUsers?.growShrink || 0

  const approvedDocsValue = data?.approvedDocuments?.value || 0
  const approvedDocsGrowth = data?.approvedDocuments?.growShrink || 0

  console.log("🆕 Extracted values:", {
    totalDocsValue,
    totalDocsGrowth,
    activeUsersValue,
    activeUsersGrowth,
    approvedDocsValue,
    approvedDocsGrowth,
  })

  return (
    <div className="flex flex-col gap-4 h-full">
      <Widget
        title="Total Documents"
        value={<NumericFormat displayType="text" value={totalDocsValue} thousandSeparator={true} />}
        growShrink={totalDocsGrowth}
        compareFrom={vsPeriod[selectedPeriod] || "vs previous period"}
        icon={<TbFiles />}
        iconClass="bg-blue-100"
      />
      <Widget
        title="Active Users"
        value={<NumericFormat displayType="text" value={activeUsersValue} thousandSeparator={true} />}
        growShrink={activeUsersGrowth}
        compareFrom={vsPeriod[selectedPeriod] || "vs previous period"}
        icon={<TbUsers />}
        iconClass="bg-emerald-100"
      />
      <Widget
        title="Approved Documents"
        value={<NumericFormat displayType="text" value={approvedDocsValue} thousandSeparator={true} />}
        growShrink={approvedDocsGrowth}
        compareFrom={vsPeriod[selectedPeriod] || "vs previous period"}
        icon={<TbCheck />}
        iconClass="bg-purple-100"
      />
    </div>
  )
}

export default Metrics


// "use client"

// import Card from "@/components/ui/Card"
// import GrowShrinkValue from "@/components/shared/GrowShrinkValue"
// import classNames from "@/utils/classNames"
// import { NumericFormat } from "react-number-format"
// import { TbFiles, TbUsers, TbCheck } from "react-icons/tb"
// // import type { MetricsData, Period } from "../types"
// import type { ReactNode } from "react"
// import { MetricsData, Period } from "@/views/dashboards/AnalyticDashboard/types"

// type WidgetProps = {
//   title: string
//   value: string | number | ReactNode
//   growShrink: number
//   compareFrom: string
//   icon: ReactNode
//   iconClass: string
// }

// type MetricsProps = {
//   data?: MetricsData | null
//   selectedPeriod: Period
// }

// const vsPeriod: Record<Period, string> = {
//   thisMonth: "vs last month",
//   thisWeek: "vs last week",
//   thisYear: "vs last year",
// }

// const Widget = ({ title, growShrink = 0, value = 0, compareFrom, icon, iconClass }: WidgetProps) => {
//   return (
//     <Card className="flex-1">
//       <div className="flex justify-between gap-2 relative">
//         <div>
//           <div className="mb-4 text-sm text-gray-600">{title}</div>
//           <h3 className="mb-2">{value}</h3>
//           <div className="inline-flex items-center flex-wrap gap-1">
//             <GrowShrinkValue
//               className="font-bold text-xs"
//               value={growShrink}
//               suffix="%"
//               positiveIcon="+"
//               negativeIcon=""
//             />
//             <span className="text-xs text-gray-500">{compareFrom}</span>
//           </div>
//         </div>
//         <div
//           className={classNames(
//             "flex items-center justify-center min-h-10 min-w-10 max-h-10 max-w-10 text-gray-900 rounded-full text-xl",
//             iconClass,
//           )}
//         >
//           {icon}
//         </div>
//       </div>
//     </Card>
//   )
// }

// const Metrics = ({ data, selectedPeriod }: MetricsProps) => {
//   console.log("📊 Metrics component received:", { data, selectedPeriod })

//   // Ultra-safe data extraction with multiple fallback layers
//   const getTotalDocuments = () => {
//     try {
//       return {
//         value: data?.totalDocuments?.value ?? 0,
//         growShrink: data?.totalDocuments?.growShrink ?? 0,
//       }
//     } catch (error) {
//       console.error("Error accessing totalDocuments:", error)
//       return { value: 0, growShrink: 0 }
//     }
//   }

//   const getActiveUsers = () => {
//     try {
//       return {
//         value: data?.activeUsers?.value ?? 0,
//         growShrink: data?.activeUsers?.growShrink ?? 0,
//       }
//     } catch (error) {
//       console.error("Error accessing activeUsers:", error)
//       return { value: 0, growShrink: 0 }
//     }
//   }

//   const getApprovedDocuments = () => {
//     try {
//       return {
//         value: data?.approvedDocuments?.value ?? 0,
//         growShrink: data?.approvedDocuments?.growShrink ?? 0,
//       }
//     } catch (error) {
//       console.error("Error accessing approvedDocuments:", error)
//       return { value: 0, growShrink: 0 }
//     }
//   }

//   const totalDocuments = getTotalDocuments()
//   const activeUsers = getActiveUsers()
//   const approvedDocuments = getApprovedDocuments()

//   console.log("📊 Extracted values:", {
//     totalDocuments,
//     activeUsers,
//     approvedDocuments,
//   })

//   return (
//     <div className="flex flex-col gap-4 h-full">
//       <Widget
//         title="Total Documents"
//         value={<NumericFormat displayType="text" value={totalDocuments.value} thousandSeparator={true} />}
//         growShrink={totalDocuments.growShrink}
//         compareFrom={vsPeriod[selectedPeriod] || "vs previous period"}
//         icon={<TbFiles />}
//         iconClass="bg-blue-100"
//       />
//       <Widget
//         title="Active Users"
//         value={<NumericFormat displayType="text" value={activeUsers.value} thousandSeparator={true} />}
//         growShrink={activeUsers.growShrink}
//         compareFrom={vsPeriod[selectedPeriod] || "vs previous period"}
//         icon={<TbUsers />}
//         iconClass="bg-emerald-100"
//       />
//       <Widget
//         title="Approved Documents"
//         value={<NumericFormat displayType="text" value={approvedDocuments.value} thousandSeparator={true} />}
//         growShrink={approvedDocuments.growShrink}
//         compareFrom={vsPeriod[selectedPeriod] || "vs previous period"}
//         icon={<TbCheck />}
//         iconClass="bg-purple-100"
//       />
//     </div>
//   )
// }

// export default Metrics
