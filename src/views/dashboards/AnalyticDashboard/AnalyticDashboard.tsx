"use client"

import { useEffect, useState } from "react"
import Loading from "@/components/shared/Loading"
import AnalyticHeader from "./components/AnalyticHeader"
import { apiGetFolders } from "@/services/FileService"
import { apiGetCustomersList } from "@/services/CustomersService"
import { apiGetAllNextNumbering } from "@/services/NextNumberingService"
import type {
  Period,
  DocumentCountData,
  FileStorageData,
  MetricsData,
  RecentActivityData,
  TopFoldersData,
} from "./types"
import { useSessionUser } from "@/store/authStore"

import TopFolders from "@/components/dashboard/TopFolders"
import RecentActivity from "@/components/dashboard/RecentActivity"
import FileStorage from "@/components/dashboard/FileStorage"
import DocumentAnalytic from "@/components/dashboard/DocumentAnalytic"
import Metrics from "@/components/dashboard/Metrics"

const AnalyticDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("thisMonth")
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    metrics: null as MetricsData | null,
    documentsByCategory: [] as DocumentCountData,
    fileStorage: { labels: [], series: [], percentage: [], totalSize: "0 B" } as FileStorageData,
    recentActivity: [] as RecentActivityData,
    topFolders: [] as TopFoldersData,
  })

  const user = useSessionUser((state) => state.user)

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod, user.projectFileIds])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log("🔄 Fetching dashboard data...")

      // Fetch all required data in parallel
      const [foldersResponse, usersResponse, numberingResponse] = await Promise.all([
        fetchFoldersData(),
        fetchUsersData(),
        fetchNumberingData(),
      ])

      // Process and combine data
      const processedData = await processDashboardData(foldersResponse, usersResponse, numberingResponse)

      console.log("🔄 Setting dashboard data:", processedData)
      setDashboardData(processedData)

      console.log("✅ Dashboard data loaded successfully")
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFoldersData = async () => {
    try {
      const response = await apiGetFolders<any, any>({
        ids: user.projectFileIds || [],
        sortBy: "code",
        sortDir: "asc",
        page: 0,
        size: 100,
      })
      return response?.data?.content || []
    } catch (error) {
      console.error("Error fetching folders:", error)
      return []
    }
  }

  const fetchUsersData = async () => {
    try {
      const response = await apiGetCustomersList({})
      console.log("📊 Users API response:", response)

      // Handle the specific response structure: {data: {…}, message: 'Get all user', status: 200}
      if (response?.data) {
        // If data is an array directly
        if (Array.isArray(response.data)) {
          console.log("✅ Users data is array:", response.data.length)
          return response.data
        }

        // If data is an object with content property
        if (response.data.content && Array.isArray(response.data.content)) {
          console.log("✅ Users data in content:", response.data.content.length)
          return response.data.content
        }

        // If data is an object with users property
        if (response.data.users && Array.isArray(response.data.users)) {
          console.log("✅ Users data in users property:", response.data.users.length)
          return response.data.users
        }

        // If data is an object, try to extract array values
        const dataValues = Object.values(response.data)
        const arrayValue = dataValues.find((value) => Array.isArray(value))
        if (arrayValue) {
          console.log("✅ Found array in data object:", arrayValue.length)
          return arrayValue
        }

        // If data is a single object, wrap it in an array
        if (typeof response.data === "object" && !Array.isArray(response.data)) {
          console.log("✅ Converting single user object to array")
          return [response.data]
        }
      }

      console.log("⚠️ No valid user data found, using empty array")
      return []
    } catch (error) {
      console.error("Error fetching users:", error)
      return []
    }
  }

  const fetchNumberingData = async () => {
    try {
      const response = await apiGetAllNextNumbering()
      return response?.data || []
    } catch (error) {
      console.error("Error fetching numbering data:", error)
      return []
    }
  }

  const processDashboardData = async (folders: any[], users: any[], numbering: any[]) => {
    console.log("📊 Processing dashboard data with:", {
      folders: folders?.length || 0,
      users: users?.length || 0,
      numbering: numbering?.length || 0,
    })

    // Ensure we have arrays to work with
    const safeUsers = Array.isArray(users) ? users : []
    const safeFolders = Array.isArray(folders) ? folders : []
    const safeNumbering = Array.isArray(numbering) ? numbering : []

    // Calculate metrics
    const totalFolders = safeFolders.filter((f) => f?.fileType === "directory").length
    const totalFiles = safeFolders.filter((f) => f?.fileType !== "directory").length
    const totalDocuments = totalFolders + totalFiles
    const activeUsers = safeUsers.filter((u) => u?.status === "ACTIVE").length
    const approvedDocuments = Math.floor(totalDocuments * 0.85) // Simulate approved percentage

    const getGrowth = (period: Period) => {
      switch (period) {
        case "thisWeek":
          return Math.floor(Math.random() * 20) - 10
        case "thisMonth":
          return Math.floor(Math.random() * 30) - 15
        case "thisYear":
          return Math.floor(Math.random() * 50) - 25
        default:
          return 0
      }
    }

    const metrics: MetricsData = {
      totalDocuments: {
        value: totalDocuments,
        growShrink: getGrowth(selectedPeriod),
      },
      activeUsers: {
        value: activeUsers,
        growShrink: getGrowth(selectedPeriod),
      },
      approvedDocuments: {
        value: approvedDocuments,
        growShrink: getGrowth(selectedPeriod),
      },
    }

    console.log("📊 Calculated metrics:", metrics)

    // Process documents by category
    const categoryMap = new Map<string, number>()
    safeFolders.forEach((folder) => {
      if (folder?.categories && Array.isArray(folder.categories)) {
        folder.categories.forEach((cat: any) => {
          const categoryName = cat?.name || "Uncategorized"
          categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1)
        })
      }
    })

    const documentsByCategory: DocumentCountData = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 categories

    // Calculate file storage data
    const totalSize = safeFolders.reduce((acc, folder) => acc + (folder?.size || 0), 0)
    const folderCount = safeFolders.filter((f) => f?.fileType === "directory").length
    const fileCount = safeFolders.filter((f) => f?.fileType !== "directory").length
    const documentCount = safeNumbering.length

    const fileStorage: FileStorageData = {
      labels: ["Files", "Folders", "Documents"],
      series: [fileCount, folderCount, documentCount],
      percentage: [
        Math.round((fileCount / Math.max(fileCount + folderCount + documentCount, 1)) * 100),
        Math.round((folderCount / Math.max(fileCount + folderCount + documentCount, 1)) * 100),
        Math.round((documentCount / Math.max(fileCount + folderCount + documentCount, 1)) * 100),
      ],
      totalSize: formatFileSize(totalSize),
    }

    // Generate recent activity (simulated)
    const recentActivity: RecentActivityData = generateRecentActivity(safeFolders, safeUsers)

    // Calculate top folders
    const topFolders: TopFoldersData = safeFolders
      .filter((f) => f?.fileType === "directory")
      .map((folder) => ({
        id: folder.id,
        name: folder.name || "Unnamed Folder",
        code: folder.code || "N/A",
        documentCount: Math.floor(Math.random() * 50) + 1, // Simulate document count
        size: formatFileSize(folder?.size || 0),
        growth: Math.floor(Math.random() * 40) - 20, // Simulate growth
      }))
      .sort((a, b) => b.documentCount - a.documentCount)
      .slice(0, 5)

    return {
      metrics,
      documentsByCategory,
      fileStorage,
      recentActivity,
      topFolders,
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const generateRecentActivity = (folders: any[], users: any[]): RecentActivityData => {
    const activities = []
    const actions = ["Created", "Updated", "Deleted", "Shared", "Downloaded"]
    const statuses: ("success" | "pending" | "error")[] = ["success", "pending", "error"]

    for (let i = 0; i < 10; i++) {
      const randomFolder = folders[Math.floor(Math.random() * Math.max(folders.length, 1))]
      const randomUser = users[Math.floor(Math.random() * Math.max(users.length, 1))]
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      activities.push({
        id: `activity-${i}`,
        action: randomAction,
        document: randomFolder?.name || "Unknown Document",
        user: `${randomUser?.firstName || "Unknown"} ${randomUser?.lastName || "User"}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: randomStatus,
      })
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  console.log("🔄 Current dashboard data state:", dashboardData)

  return (
    <Loading loading={loading}>
      <div className="flex flex-col gap-4">
        <AnalyticHeader selectedPeriod={selectedPeriod} onSelectedPeriodChange={setSelectedPeriod} />

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
          <strong>Debug:</strong> Loading: {loading.toString()}, Metrics: {dashboardData.metrics ? "✅" : "❌"}
          {dashboardData.metrics && (
            <span>
              {" "}
              | Total Docs: {dashboardData.metrics.totalDocuments?.value} | Active Users:{" "}
              {dashboardData.metrics.activeUsers?.value}
            </span>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Document Analytics - Takes 2/3 width */}
          <div className="xl:col-span-2">
            <DocumentAnalytic data={dashboardData.documentsByCategory} />
          </div>

          {/* Metrics - Takes 1/3 width */}
          <div className="xl:col-span-1">
            {!loading && dashboardData.metrics ? (
              <Metrics data={dashboardData.metrics} selectedPeriod={selectedPeriod} />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading metrics...</p>
                </div>
              </div>
            )}
          </div>

          {/* File Storage - Takes 1/3 width */}
          <div className="xl:col-span-1">
            <FileStorage data={dashboardData.fileStorage} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <div>
            <RecentActivity data={dashboardData.recentActivity} />
          </div>

          {/* Top Folders */}
          <div>
            <TopFolders data={dashboardData.topFolders} />
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default AnalyticDashboard



// "use client"

// import { useEffect, useState } from "react"
// import Loading from "@/components/shared/Loading"
// import AnalyticHeader from "./components/AnalyticHeader"
// import Metrics from "./components/Metrics"
// import { apiGetFolders } from "@/services/FileService"
// import { apiGetCustomersList } from "@/services/CustomersService"
// import { apiGetAllNextNumbering } from "@/services/NextNumberingService"
// import type {
//   Period,
//   DocumentCountData,
//   FileStorageData,
//   MetricsData,
//   RecentActivityData,
//   TopFoldersData,
// } from "./types"
// import { useSessionUser } from "@/store/authStore"

// import TopFolders from "@/components/dashboard/TopFolders"
// import RecentActivity from "@/components/dashboard/RecentActivity"
// import FileStorage from "@/components/dashboard/FileStorage"
// import DocumentAnalytic from "@/components/dashboard/DocumentAnalytic"

// const AnalyticDashboard = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState<Period>("thisMonth")
//   const [loading, setLoading] = useState(true)
//   const [dashboardData, setDashboardData] = useState({
//     metrics: {
//       totalDocuments: { value: 0, growShrink: 0 },
//       activeUsers: { value: 0, growShrink: 0 },
//       approvedDocuments: { value: 0, growShrink: 0 },
//     } as MetricsData,
//     documentsByCategory: [] as DocumentCountData,
//     fileStorage: { labels: [], series: [], percentage: [], totalSize: "0 B" } as FileStorageData,
//     recentActivity: [] as RecentActivityData,
//     topFolders: [] as TopFoldersData,
//   })

//   const user = useSessionUser((state) => state.user)

//   useEffect(() => {
//     fetchDashboardData()
//   }, [selectedPeriod, user.projectFileIds])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       console.log("🔄 Fetching dashboard data...")

//       // Fetch all required data in parallel
//       const [foldersResponse, usersResponse, numberingResponse] = await Promise.all([
//         fetchFoldersData(),
//         fetchUsersData(),
//         fetchNumberingData(),
//       ])

//       // Process and combine data
//       const processedData = await processDashboardData(foldersResponse, usersResponse, numberingResponse)
//       setDashboardData(processedData)

//       console.log("✅ Dashboard data loaded successfully")
//     } catch (error) {
//       console.error("❌ Error fetching dashboard data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchFoldersData = async () => {
//     try {
//       const response = await apiGetFolders<any, any>({
//         ids: user.projectFileIds || [],
//         sortBy: "code",
//         sortDir: "asc",
//         page: 0,
//         size: 100,
//       })
//       return response?.data?.content || []
//     } catch (error) {
//       console.error("Error fetching folders:", error)
//       return []
//     }
//   }

//   const fetchUsersData = async () => {
//     try {
//       const response = await apiGetCustomersList({})
//       console.log("📊 Users API response:", response)

//       // Handle the specific response structure: {data: {…}, message: 'Get all user', status: 200}
//       if (response?.data) {
//         // If data is an array directly
//         if (Array.isArray(response.data)) {
//           console.log("✅ Users data is array:", response.data.length)
//           return response.data
//         }

//         // If data is an object with content property
//         if (response.data.content && Array.isArray(response.data.content)) {
//           console.log("✅ Users data in content:", response.data.content.length)
//           return response.data.content
//         }

//         // If data is an object with users property
//         if (response.data.users && Array.isArray(response.data.users)) {
//           console.log("✅ Users data in users property:", response.data.users.length)
//           return response.data.users
//         }

//         // If data is an object, try to extract array values
//         const dataValues = Object.values(response.data)
//         const arrayValue = dataValues.find((value) => Array.isArray(value))
//         if (arrayValue) {
//           console.log("✅ Found array in data object:", arrayValue.length)
//           return arrayValue
//         }

//         // If data is a single object, wrap it in an array
//         if (typeof response.data === "object" && !Array.isArray(response.data)) {
//           console.log("✅ Converting single user object to array")
//           return [response.data]
//         }
//       }

//       console.log("⚠️ No valid user data found, using empty array")
//       return []
//     } catch (error) {
//       console.error("Error fetching users:", error)
//       return []
//     }
//   }

//   const fetchNumberingData = async () => {
//     try {
//       const response = await apiGetAllNextNumbering()
//       return response?.data || []
//     } catch (error) {
//       console.error("Error fetching numbering data:", error)
//       return []
//     }
//   }

//   const processDashboardData = async (folders: any[], users: any[], numbering: any[]) => {
//     console.log("📊 Processing dashboard data with:", {
//       folders: folders?.length || 0,
//       users: users?.length || 0,
//       numbering: numbering?.length || 0,
//     })

//     // Ensure we have arrays to work with
//     const safeUsers = Array.isArray(users) ? users : []
//     const safeFolders = Array.isArray(folders) ? folders : []
//     const safeNumbering = Array.isArray(numbering) ? numbering : []

//     // Calculate metrics
//     const totalFolders = safeFolders.filter((f) => f?.fileType === "directory").length
//     const totalFiles = safeFolders.filter((f) => f?.fileType !== "directory").length
//     const totalDocuments = totalFolders + totalFiles
//     const activeUsers = safeUsers.filter((u) => u?.status === "ACTIVE").length
//     const approvedDocuments = Math.floor(totalDocuments * 0.85) // Simulate approved percentage

//     const getGrowth = (period: Period) => {
//       switch (period) {
//         case "thisWeek":
//           return Math.floor(Math.random() * 20) - 10
//         case "thisMonth":
//           return Math.floor(Math.random() * 30) - 15
//         case "thisYear":
//           return Math.floor(Math.random() * 50) - 25
//         default:
//           return 0
//       }
//     }

//     const metrics: MetricsData = {
//       totalDocuments: {
//         value: totalDocuments,
//         growShrink: getGrowth(selectedPeriod),
//       },
//       activeUsers: {
//         value: activeUsers,
//         growShrink: getGrowth(selectedPeriod),
//       },
//       approvedDocuments: {
//         value: approvedDocuments,
//         growShrink: getGrowth(selectedPeriod),
//       },
//     }

//     console.log("📊 Calculated metrics:", metrics)

//     // Process documents by category
//     const categoryMap = new Map<string, number>()
//     safeFolders.forEach((folder) => {
//       if (folder?.categories && Array.isArray(folder.categories)) {
//         folder.categories.forEach((cat: any) => {
//           const categoryName = cat?.name || "Uncategorized"
//           categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1)
//         })
//       }
//     })

//     const documentsByCategory: DocumentCountData = Array.from(categoryMap.entries())
//       .map(([category, count]) => ({ category, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 10) // Top 10 categories

//     // Calculate file storage data
//     const totalSize = safeFolders.reduce((acc, folder) => acc + (folder?.size || 0), 0)
//     const folderCount = safeFolders.filter((f) => f?.fileType === "directory").length
//     const fileCount = safeFolders.filter((f) => f?.fileType !== "directory").length
//     const documentCount = safeNumbering.length

//     const fileStorage: FileStorageData = {
//       labels: ["Files", "Folders", "Documents"],
//       series: [fileCount, folderCount, documentCount],
//       percentage: [
//         Math.round((fileCount / Math.max(fileCount + folderCount + documentCount, 1)) * 100),
//         Math.round((folderCount / Math.max(fileCount + folderCount + documentCount, 1)) * 100),
//         Math.round((documentCount / Math.max(fileCount + folderCount + documentCount, 1)) * 100),
//       ],
//       totalSize: formatFileSize(totalSize),
//     }

//     // Generate recent activity (simulated)
//     const recentActivity: RecentActivityData = generateRecentActivity(safeFolders, safeUsers)

//     // Calculate top folders
//     const topFolders: TopFoldersData = safeFolders
//       .filter((f) => f?.fileType === "directory")
//       .map((folder) => ({
//         id: folder.id,
//         name: folder.name || "Unnamed Folder",
//         code: folder.code || "N/A",
//         documentCount: Math.floor(Math.random() * 50) + 1, // Simulate document count
//         size: formatFileSize(folder?.size || 0),
//         growth: Math.floor(Math.random() * 40) - 20, // Simulate growth
//       }))
//       .sort((a, b) => b.documentCount - a.documentCount)
//       .slice(0, 5)

//     return {
//       metrics,
//       documentsByCategory,
//       fileStorage,
//       recentActivity,
//       topFolders,
//     }
//   }

//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return "0 B"
//     const k = 1024
//     const sizes = ["B", "KB", "MB", "GB", "TB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

//   const generateRecentActivity = (folders: any[], users: any[]): RecentActivityData => {
//     const activities = []
//     const actions = ["Created", "Updated", "Deleted", "Shared", "Downloaded"]
//     const statuses: ("success" | "pending" | "error")[] = ["success", "pending", "error"]

//     for (let i = 0; i < 10; i++) {
//       const randomFolder = folders[Math.floor(Math.random() * Math.max(folders.length, 1))]
//       const randomUser = users[Math.floor(Math.random() * Math.max(users.length, 1))]
//       const randomAction = actions[Math.floor(Math.random() * actions.length)]
//       const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

//       activities.push({
//         id: `activity-${i}`,
//         action: randomAction,
//         document: randomFolder?.name || "Unknown Document",
//         user: `${randomUser?.firstName || "Unknown"} ${randomUser?.lastName || "User"}`,
//         timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
//         status: randomStatus,
//       })
//     }

//     return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
//   }

//   return (
//     <Loading loading={loading}>
//       <div className="flex flex-col gap-4">
//         <AnalyticHeader selectedPeriod={selectedPeriod} onSelectedPeriodChange={setSelectedPeriod} />

//         {/* Main Grid Layout */}
//         <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
//           {/* Document Analytics - Takes 2/3 width */}
//           <div className="xl:col-span-2">
//             <DocumentAnalytic data={dashboardData.documentsByCategory} />
//           </div>

//           {/* Metrics - Takes 1/3 width */}
//           <div className="xl:col-span-1">
//             {dashboardData.metrics ? (
//               <Metrics data={dashboardData.metrics} selectedPeriod={selectedPeriod} />
//             ) : (
//               <div className="flex items-center justify-center h-full">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-2 text-sm text-gray-600">Loading metrics...</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* File Storage - Takes 1/3 width */}
//           <div className="xl:col-span-1">
//             <FileStorage data={dashboardData.fileStorage} />
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
//           {/* Recent Activity */}
//           <div>
//             <RecentActivity data={dashboardData.recentActivity} />
//           </div>

//           {/* Top Folders */}
//           <div>
//             <TopFolders data={dashboardData.topFolders} />
//           </div>
//         </div>
//       </div>
//     </Loading>
//   )
// }

// export default AnalyticDashboard


// // "use client"

// // import { useEffect, useState } from "react"
// // import Loading from "@/components/shared/Loading"
// // import AnalyticHeader from "./components/AnalyticHeader"
// // import Metrics from "./components/Metrics"
// // import { apiGetFolders } from "@/services/FileService"
// // import { apiGetAllNextNumbering } from "@/services/NextNumberingService"
// // import type {
// //   Period,
// //   DocumentCountData,
// //   FileStorageData,
// //   MetricsData,
// //   RecentActivityData,
// //   TopFoldersData,
// // } from "./types"
// // import { useSessionUser } from "@/store/authStore"
// // import DocumentAnalytic from "@/components/dashboard/DocumentAnalytic"
// // import FileStorage from "@/components/dashboard/FileStorage"
// // import RecentActivity from "@/components/dashboard/RecentActivity"
// // import TopFolders from "@/components/dashboard/TopFolders"
// // import { apiGetCustomersList } from "@/services/CustomersService"

// // const AnalyticDashboard = () => {
// //   const [selectedPeriod, setSelectedPeriod] = useState<Period>("thisMonth")
// //   const [loading, setLoading] = useState(true)
// //   const [dashboardData, setDashboardData] = useState({
// //     metrics: {} as MetricsData,
// //     documentsByCategory: [] as DocumentCountData,
// //     fileStorage: {} as FileStorageData,
// //     recentActivity: [] as RecentActivityData,
// //     topFolders: [] as TopFoldersData,
// //   })

// //   const user = useSessionUser((state) => state.user)

// //   useEffect(() => {
// //     fetchDashboardData()
// //   }, [selectedPeriod, user.projectFileIds])

// //   const fetchDashboardData = async () => {
// //     try {
// //       setLoading(true)
// //       console.log("🔄 Fetching dashboard data...")

// //       // Fetch all required data in parallel
// //       const [foldersResponse, usersResponse, numberingResponse] = await Promise.all([
// //         fetchFoldersData(),
// //         fetchUsersData(),
// //         fetchNumberingData(),
// //       ])

// //       // Process and combine data
// //       const processedData = await processDashboardData(foldersResponse, usersResponse, numberingResponse)
// //       setDashboardData(processedData)

// //       console.log("✅ Dashboard data loaded successfully")
// //     } catch (error) {
// //       console.error("❌ Error fetching dashboard data:", error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const fetchFoldersData = async () => {
// //     try {
// //       const response = await apiGetFolders<any, any>({
// //         ids: user.projectFileIds || [],
// //         sortBy: "code",
// //         sortDir: "asc",
// //         page: 0,
// //         size: 100,
// //       })
// //       return response?.data?.content || []
// //     } catch (error) {
// //       console.error("Error fetching folders:", error)
// //       return []
// //     }
// //   }

// //   const fetchUsersData = async () => {
// //     try {
// //       const response = await apiGetCustomersList({})
// //       return response?.data || []
// //     } catch (error) {
// //       console.error("Error fetching users:", error)
// //       return []
// //     }
// //   }

// //   const fetchNumberingData = async () => {
// //     try {
// //       const response = await apiGetAllNextNumbering()
// //       return response?.data || []
// //     } catch (error) {
// //       console.error("Error fetching numbering data:", error)
// //       return []
// //     }
// //   }

// //   const processDashboardData = async (folders: any[], users: any[], numbering: any[]) => {
// //     // Calculate metrics
// //     const totalFolders = folders.filter((f) => f.fileType === "directory").length
// //     const totalFiles = folders.filter((f) => f.fileType !== "directory").length
// //     const totalDocuments = totalFolders + totalFiles
// //     const activeUsers = users.filter((u) => u.status === "ACTIVE").length
// //     const approvedDocuments = Math.floor(totalDocuments * 0.85) // Simulate approved percentage

// //     // Calculate growth (simulate based on period)
// //     const getGrowth = (period: Period) => {
// //       switch (period) {
// //         case "thisWeek":
// //           return Math.floor(Math.random() * 20) - 10
// //         case "thisMonth":
// //           return Math.floor(Math.random() * 30) - 15
// //         case "thisYear":
// //           return Math.floor(Math.random() * 50) - 25
// //         default:
// //           return 0
// //       }
// //     }

// //     const metrics: MetricsData = {
// //       totalDocuments: {
// //         value: totalDocuments,
// //         growShrink: getGrowth(selectedPeriod),
// //       },
// //       activeUsers: {
// //         value: activeUsers,
// //         growShrink: getGrowth(selectedPeriod),
// //       },
// //       approvedDocuments: {
// //         value: approvedDocuments,
// //         growShrink: getGrowth(selectedPeriod),
// //       },
// //     }

// //     // Process documents by category
// //     const categoryMap = new Map<string, number>()
// //     folders.forEach((folder) => {
// //       if (folder.categories && Array.isArray(folder.categories)) {
// //         folder.categories.forEach((cat: any) => {
// //           const categoryName = cat.name || "Uncategorized"
// //           categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1)
// //         })
// //       }
// //     })

// //     const documentsByCategory: DocumentCountData = Array.from(categoryMap.entries())
// //       .map(([category, count]) => ({ category, count }))
// //       .sort((a, b) => b.count - a.count)
// //       .slice(0, 10) // Top 10 categories

// //     // Calculate file storage data
// //     const totalSize = folders.reduce((acc, folder) => acc + (folder.size || 0), 0)
// //     const folderCount = folders.filter((f) => f.fileType === "directory").length
// //     const fileCount = folders.filter((f) => f.fileType !== "directory").length
// //     const documentCount = numbering.length

// //     const fileStorage: FileStorageData = {
// //       labels: ["Files", "Folders", "Documents"],
// //       series: [fileCount, folderCount, documentCount],
// //       percentage: [
// //         Math.round((fileCount / (fileCount + folderCount + documentCount)) * 100),
// //         Math.round((folderCount / (fileCount + folderCount + documentCount)) * 100),
// //         Math.round((documentCount / (fileCount + folderCount + documentCount)) * 100),
// //       ],
// //       totalSize: formatFileSize(totalSize),
// //     }

// //     // Generate recent activity (simulated)
// //     const recentActivity: RecentActivityData = generateRecentActivity(folders, users)

// //     // Calculate top folders
// //     const topFolders: TopFoldersData = folders
// //       .filter((f) => f.fileType === "directory")
// //       .map((folder) => ({
// //         id: folder.id,
// //         name: folder.name,
// //         code: folder.code || "N/A",
// //         documentCount: Math.floor(Math.random() * 50) + 1, // Simulate document count
// //         size: formatFileSize(folder.size || 0),
// //         growth: Math.floor(Math.random() * 40) - 20, // Simulate growth
// //       }))
// //       .sort((a, b) => b.documentCount - a.documentCount)
// //       .slice(0, 5)

// //     return {
// //       metrics,
// //       documentsByCategory,
// //       fileStorage,
// //       recentActivity,
// //       topFolders,
// //     }
// //   }

// //   const formatFileSize = (bytes: number): string => {
// //     if (bytes === 0) return "0 B"
// //     const k = 1024
// //     const sizes = ["B", "KB", "MB", "GB", "TB"]
// //     const i = Math.floor(Math.log(bytes) / Math.log(k))
// //     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
// //   }

// //   const generateRecentActivity = (folders: any[], users: any[]): RecentActivityData => {
// //     const activities = []
// //     const actions = ["Created", "Updated", "Deleted", "Shared", "Downloaded"]
// //     const statuses: ("success" | "pending" | "error")[] = ["success", "pending", "error"]

// //     for (let i = 0; i < 10; i++) {
// //       const randomFolder = folders[Math.floor(Math.random() * folders.length)]
// //       const randomUser = users[Math.floor(Math.random() * users.length)]
// //       const randomAction = actions[Math.floor(Math.random() * actions.length)]
// //       const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

// //       activities.push({
// //         id: `activity-${i}`,
// //         action: randomAction,
// //         document: randomFolder?.name || "Unknown Document",
// //         user: `${randomUser?.firstName || "Unknown"} ${randomUser?.lastName || "User"}`,
// //         timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
// //         status: randomStatus,
// //       })
// //     }

// //     return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
// //   }

// //   return (
// //     <Loading loading={loading}>
// //       <div className="flex flex-col gap-4">
// //         <AnalyticHeader selectedPeriod={selectedPeriod} onSelectedPeriodChange={setSelectedPeriod} />

// //         {/* Main Grid Layout */}
// //         <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
// //           {/* Document Analytics - Takes 2/3 width */}
// //           <div className="xl:col-span-2">
// //             <DocumentAnalytic data={dashboardData.documentsByCategory} />
// //           </div>

// //           {/* Metrics - Takes 1/3 width */}
// //           <div className="xl:col-span-1">
// //             <Metrics data={dashboardData.metrics} selectedPeriod={selectedPeriod} />
// //           </div>

// //           {/* File Storage - Takes 1/3 width */}
// //           <div className="xl:col-span-1">
// //             <FileStorage data={dashboardData.fileStorage} />
// //           </div>
// //         </div>

// //         {/* Bottom Section */}
// //         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
// //           {/* Recent Activity */}
// //           <div>
// //             <RecentActivity data={dashboardData.recentActivity} />
// //           </div>

// //           {/* Top Folders */}
// //           <div>
// //             <TopFolders data={dashboardData.topFolders} />
// //           </div>
// //         </div>
// //       </div>
// //     </Loading>
// //   )
// // }

// // export default AnalyticDashboard



// // // import { useEffect, useState } from "react";
// // // import Loading from "@/components/shared/Loading";
// // // import AnalyticHeader from "./components/AnalyticHeader";
// // // import Metrics from "./components/Metrics";
// // // import WebAnalytic from "./components/AnalyticChart";
// // // // import TopChannel from './components/TopChannel'
// // // // import TopPerformingPages from './components/TopPerformingPages'
// // // import DeviceSession from "./components/DeviceSession";
// // // import {
// // //   apiGetAnalyticDashboard,
// // //   apiGetWebAnalyticData,
// // // } from "@/services/DashboardService";
// // // import useSWR from "swr";
// // // import type { GetAnalyticDashboardResponse, Period } from "./types";
// // // import { useSessionUser } from "@/store/authStore";

// // // const AnalyticDashboard = () => {
// // //   const [selectedPeriod, setSelectedPeriod] = useState<Period>("thisMonth");
// // //   const [webAnalyticData, setWebAnalyticData] = useState("");
  
// // //   const user = useSessionUser((state) => state.user);

// // //   //  console.log("User data in dashb : ", user.projectFileIds);
   

// // //   const { data, isLoading } = useSWR(
// // //     ["/api/dashboard/analytic"],
// // //     () => apiGetAnalyticDashboard<GetAnalyticDashboardResponse>(),
// // //     {
// // //       revalidateOnFocus: false,
// // //       revalidateIfStale: false,
// // //       revalidateOnReconnect: false,
// // //     }
// // //   );

  
// // //   useEffect(() => {
// // //     const fetchWebAnalytic = async () => {
// // //       try {
// // //         const fileIds = user.projectFileIds; 
// // //         const response = await apiGetWebAnalyticData(fileIds);
// // //         setWebAnalyticData(response);
// // //       } catch (err) {
// // //         console.error("Failed to fetch web analytic data", err);
// // //       }
// // //     };

// // //     fetchWebAnalytic();
// // //   }, []);
// // //   console.log("Web analytic data:", webAnalyticData);

// // //   return (
// // //     <Loading loading={isLoading}>
// // //       {data && (
// // //         <div className="flex flex-col gap-4">
// // //           <AnalyticHeader
// // //             selectedPeriod={selectedPeriod}
// // //             onSelectedPeriodChange={setSelectedPeriod}
// // //           />

// // //           {/* Metrics + File Storage Side by Side */}
// // //           <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
// // //             {/* Metrics - full width on small screen, 2/3 on large */}

// // //             <div className="col-span-4 2xl:col-span-3">
// // //               <WebAnalytic data={webAnalyticData} />
// // //             </div>
// // //             <div className="xl:col-span-2 flex flex-col gap-4">
// // //               <Metrics
// // //                 data={data[selectedPeriod].metrics}
// // //                 selectedPeriod={selectedPeriod}
// // //               />
// // //             </div>

// // //             {/* File Storage or DeviceSession - right side */}
// // //             <div className="xl:col-span-1 ">
// // //               <DeviceSession data={data[selectedPeriod].deviceSession} />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </Loading>
// // //   );
// // // };

// // // export default AnalyticDashboard;
