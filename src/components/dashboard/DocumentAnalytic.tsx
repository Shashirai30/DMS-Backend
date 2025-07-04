"use client"

import { useEffect, useRef, useMemo } from "react"
import Card from "@/components/ui/Card"
import Chart from "@/components/shared/Chart"
import { COLORS } from "@/constants/chart.constant"
import { useThemeStore } from "@/store/themeStore"
import { DocumentCountData } from "@/views/dashboards/AnalyticDashboard/types"
// import type { DocumentCountData } from "../types"

type DocumentAnalyticProps = {
  data: DocumentCountData
}

// Update DocumentAnalytic to handle empty data
const DocumentAnalytic = ({ data = [] }: DocumentAnalyticProps) => {
  const isFirstRender = useRef(true)

  const sideNavCollapse = useThemeStore((state) => state.layout.sideNavCollapse)

  useEffect(() => {
    if (!sideNavCollapse && isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!isFirstRender.current) {
      window.dispatchEvent(new Event("resize"))
    }
  }, [sideNavCollapse])

  const { series, labels } = useMemo(() => {
    const categories = Array.isArray(data) ? data : []
    return {
      series: [{ name: "Documents", data: categories.map((item) => item.count) }],
      labels: categories.map((item) => item.category),
    }
  }, [data])

  const totalDocuments = useMemo(() => {
    return Array.isArray(data) ? data.reduce((sum, item) => sum + (item?.count || 0), 0) : 0
  }, [data])

  return (
    <Card className="h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4>Documents by Category</h4>
          <p className="text-sm text-gray-600 mt-1">Distribution of documents across categories</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{totalDocuments}</div>
          <div className="text-sm text-gray-600">Total Documents</div>
        </div>
      </div>

      <div className="mt-6">
        {series[0].data.length > 0 ? (
          <Chart
            type="bar"
            series={series}
            xAxis={labels}
            height="330px"
            customOptions={{
              legend: { show: false },
              colors: COLORS,
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  horizontal: false,
                },
              },
              dataLabels: {
                enabled: true,
              },
              xaxis: {
                labels: {
                  rotate: -45,
                  maxHeight: 120,
                },
              },
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-[330px] bg-gray-50 rounded-lg">
            <div className="text-center">
              <i className="ri-file-list-3-line text-4xl text-gray-400"></i>
              <p className="mt-2 text-gray-500">No category data available</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default DocumentAnalytic


// "use client"

// import { useEffect, useRef, useMemo } from "react"
// import Card from "@/components/ui/Card"
// import Chart from "@/components/shared/Chart"
// import { COLORS } from "@/constants/chart.constant"
// import { useThemeStore } from "@/store/themeStore"
// import { DocumentCountData } from "@/views/dashboards/AnalyticDashboard/types"

// type DocumentAnalyticProps = {
//   data: DocumentCountData
// }

// const DocumentAnalytic = ({ data }: DocumentAnalyticProps) => {
//   const isFirstRender = useRef(true)

//   const sideNavCollapse = useThemeStore((state) => state.layout.sideNavCollapse)

//   useEffect(() => {
//     if (!sideNavCollapse && isFirstRender.current) {
//       isFirstRender.current = false
//       return
//     }

//     if (!isFirstRender.current) {
//       window.dispatchEvent(new Event("resize"))
//     }
//   }, [sideNavCollapse])

//   const { series, labels } = useMemo(() => {
//     const categories = data || []
//     return {
//       series: [{ name: "Documents", data: categories.map((item) => item.count) }],
//       labels: categories.map((item) => item.category),
//     }
//   }, [data])

//   const totalDocuments = useMemo(() => {
//     return data.reduce((sum, item) => sum + item.count, 0)
//   }, [data])

//   return (
//     <Card className="h-full">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h4>Documents by Category</h4>
//           <p className="text-sm text-gray-600 mt-1">Distribution of documents across categories</p>
//         </div>
//         <div className="text-right">
//           <div className="text-2xl font-bold">{totalDocuments}</div>
//           <div className="text-sm text-gray-600">Total Documents</div>
//         </div>
//       </div>

//       <div className="mt-6">
//         <Chart
//           type="bar"
//           series={series}
//           xAxis={labels}
//           height="330px"
//           customOptions={{
//             legend: { show: false },
//             colors: COLORS,
//             plotOptions: {
//               bar: {
//                 borderRadius: 4,
//                 horizontal: false,
//               },
//             },
//             dataLabels: {
//               enabled: true,
//             },
//             xaxis: {
//               labels: {
//                 rotate: -45,
//                 maxHeight: 120,
//               },
//             },
//           }}
//         />
//       </div>
//     </Card>
//   )
// }

// export default DocumentAnalytic
