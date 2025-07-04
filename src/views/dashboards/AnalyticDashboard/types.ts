export type Period = "thisMonth" | "thisWeek" | "thisYear"

export type PageViewData = {
  pageUrl: string
  views: number
}

export type DeviceSessionData = {
  labels: string[]
  series: number[]
  percentage: number[]
}

export type TopChannelData = {
  visitors: number
  channels: {
    id: string
    name: string
    img: string
    total: number
    percentage: number
  }[]
}

export type TopPageData = {
  pageUrl: string
  views: {
    amount: number
    growth: number
  }
  uniqueVisitor: {
    amount: number
    growth: number
  }
}

export type TrafficData = {
  source: string
  visits: number
  uniqueVisitors: number
  bounceRate: string
  avgSessionDuration: string
  progress: number
}

export type MetricsData = Record<
  "totalDocuments" | "activeUsers" | "approvedDocuments",
  {
    value: number
    growShrink: number
  }
>

export type WebAnalyticData = {
  documentActivity: {
    value: number
    growShrink: number
  }
  avgProcessingTime: {
    value: string
    growShrink: number
  }
  series: {
    name: string
    data: number[]
  }[]
  date: string[]
}

export type DocumentCountData = {
  count: number
  category: string
}[]

export type FileStorageData = {
  labels: string[]
  series: number[]
  percentage: number[]
  totalSize: string
}

export type RecentActivityData = {
  id: string
  action: string
  document: string
  user: string
  timestamp: string
  status: "success" | "pending" | "error"
}[]

export type TopFoldersData = {
  id: string
  name: string
  code: string
  documentCount: number
  size: string
  growth: number
}[]

export type GetAnalyticDashboardResponse = Record<
  Period,
  {
    metrics: MetricsData
    webAnalytic: WebAnalyticData
    documentsByCategory: DocumentCountData
    fileStorage: FileStorageData
    recentActivity: RecentActivityData
    topFolders: TopFoldersData
  }
>


// export type Period = 'thisMonth' | 'thisWeek' | 'thisYear'

// export type PageViewData = {
//     pageUrl: string
//     views: number
// }

// export type DeviceSessionData = {
//     labels: string[]
//     series: number[]
//     percentage: number[]
// }

// export type TopChannelData = {
//     visitors: number
//     channels: {
//         id: string
//         name: string
//         img: string
//         total: number
//         percentage: number
//     }[]
// }

// export type TopPageData = {
//     pageUrl: string
//     views: {
//         amount: number
//         growth: number
//     }
//     uniqueVisitor: {
//         amount: number
//         growth: number
//     }
// }

// export type TrafficData = {
//     source: string
//     visits: number
//     uniqueVisitors: number
//     bounceRate: string
//     avgSessionDuration: string
//     progress: number
// }

// export type MetricsData = Record<
//     'visitors' | 'conversionRate' | 'adCampaignClicks',
//     {
//         value: number
//         growShrink: number
//     }
// >

// export type WebAnalyticData = {
//     pageView: {
//         value: number
//         growShrink: number
//     }
//     avgTimeOnPage: {
//         value: string
//         growShrink: number
//     }
//     series: {
//         name: string
//         data: number[]
//     }[]
//     date: string[]
// }

// export type GetAnalyticDashboardResponse = Record<
//     Period,
//     {
//         metrics: MetricsData
//         webAnalytic: WebAnalyticData
//         traffic: TrafficData[]
//         topChannel: TopChannelData
//         deviceSession: DeviceSessionData
//         topPages: TopPageData[]
//     }
// >
