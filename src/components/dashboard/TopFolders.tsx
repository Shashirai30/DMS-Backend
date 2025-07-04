"use client"

import Card from "@/components/ui/Card"
import Table from "@/components/ui/Table"
import GrowShrinkValue from "@/components/shared/GrowShrinkValue"
import { TbFolder } from "react-icons/tb"
import { TopFoldersData } from "@/views/dashboards/AnalyticDashboard/types"

type TopFoldersProps = {
  data: TopFoldersData
}

const { TBody, THead, Tr, Th, Td } = Table

const TopFolders = ({ data }: TopFoldersProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4>Top Performing Folders</h4>
          <p className="text-sm text-gray-600 mt-1">Folders with most activity</p>
        </div>
      </div>

      <Table hoverable={false}>
        <THead>
          <Tr>
            <Th>Folder</Th>
            <Th className="text-right">Documents</Th>
            <Th className="text-right">Size</Th>
            <Th className="text-right">Growth</Th>
          </Tr>
        </THead>
        <TBody>
          {data.map((folder) => (
            <Tr key={folder.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TbFolder className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{folder.name}</div>
                    <div className="text-xs text-gray-500">Code: {folder.code}</div>
                  </div>
                </div>
              </Td>
              <Td className="text-right">
                <span className="font-medium">{folder.documentCount}</span>
              </Td>
              <Td className="text-right">
                <span className="text-sm text-gray-600">{folder.size}</span>
              </Td>
              <Td className="text-right">
                <GrowShrinkValue
                  className="font-bold"
                  value={folder.growth}
                  suffix="%"
                  positiveIcon="+"
                  negativeIcon=""
                />
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>

      {data.length === 0 && (
        <div className="text-center py-8">
          <TbFolder className="text-4xl text-gray-400 mx-auto" />
          <p className="text-gray-600 mt-2">No folder data available</p>
        </div>
      )}
    </Card>
  )
}

export default TopFolders
