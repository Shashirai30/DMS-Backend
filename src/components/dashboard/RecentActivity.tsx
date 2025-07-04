"use client"

import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import Avatar from "@/components/ui/Avatar"
import { RecentActivityData } from "@/views/dashboards/AnalyticDashboard/types"

import { formatDistanceToNow } from "date-fns"

type RecentActivityProps = {
  data: RecentActivityData
}

const RecentActivity = ({ data }: RecentActivityProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-100 text-emerald-700">Success</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-700">Error</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Created":
        return "ri-add-circle-line"
      case "Updated":
        return "ri-edit-line"
      case "Deleted":
        return "ri-delete-bin-line"
      case "Shared":
        return "ri-share-line"
      case "Downloaded":
        return "ri-download-line"
      default:
        return "ri-file-line"
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4>Recent Activity</h4>
          <p className="text-sm text-gray-600 mt-1">Latest document activities</p>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <i className={`${getActionIcon(activity.action)} text-blue-600 text-sm`} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.action} "{activity.document}"
                </p>
                {getStatusBadge(activity.status)}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Avatar size={16} className="bg-gray-200" />
                <span className="text-xs text-gray-600">{activity.user}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <i className="ri-history-line text-4xl text-gray-400" />
          <p className="text-gray-600 mt-2">No recent activity</p>
        </div>
      )}
    </Card>
  )
}

export default RecentActivity
