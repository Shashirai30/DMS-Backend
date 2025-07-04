"use client"

import Card from "@/components/ui/Card"
import Chart from "@/components/shared/Chart"
import { COLORS } from "@/constants/chart.constant"
import { TbFile, TbFolder, TbFileText } from "react-icons/tb"
import { FileStorageData } from "@/views/dashboards/AnalyticDashboard/types"
// import type { FileStorageData } from "../types"

type FileStorageProps = {
  data: FileStorageData
}

// Update FileStorage to handle empty data
const FileStorage = ({ data = { labels: [], series: [], percentage: [], totalSize: "0 B" } }: FileStorageProps) => {
  const icons = [TbFile, TbFolder, TbFileText]
  const iconColors = [COLORS[0], COLORS[7], COLORS[8]]

  // Ensure we have valid data
  const labels = data?.labels || []
  const series = data?.series || []
  const percentage = data?.percentage || []
  const totalSize = data?.totalSize || "0 B"

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <h4>File Storage</h4>
          <p className="text-sm text-gray-600 mt-1">Storage distribution</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{totalSize}</div>
          <div className="text-xs text-gray-600">Total Size</div>
        </div>
      </div>

      <div className="mt-6">
        {series.length > 0 ? (
          <Chart
            height={200}
            series={series}
            customOptions={{
              colors: iconColors,
              labels: labels,
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        showAlways: true,
                        label: "Total",
                        formatter: (w: any) => w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0),
                      },
                    },
                  },
                  size: "75%",
                },
              },
              legend: {
                show: false,
              },
            }}
            type="donut"
          />
        ) : (
          <div className="flex items-center justify-center h-[200px] bg-gray-50 rounded-lg">
            <div className="text-center">
              <i className="ri-hard-drive-line text-4xl text-gray-400"></i>
              <p className="mt-2 text-gray-500">No storage data available</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-8">
        {labels.map((label, index) => {
          const Icon = icons[index]
          return (
            <div key={label} className="flex flex-col items-center justify-center gap-2">
              <div className="text-2xl" style={{ color: iconColors[index] }}>
                <Icon />
              </div>
              <div className="text-center">
                <span className="text-sm">{label}</span>
                <h6 className="font-bold">{percentage[index] || 0}%</h6>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default FileStorage
