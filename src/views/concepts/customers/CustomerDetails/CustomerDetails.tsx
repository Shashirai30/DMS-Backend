

import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Loading from '@/components/shared/Loading'
import ProfileSection from './ProfileSection'
import ActivitySection from './ActivitySection'
import { apiGetCustomer } from '@/services/CustomersService'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import Dialog from '@/components/ui/Dialog' 
import { useEffect, type MouseEvent } from 'react'
import { User } from '@/@types/auth'

interface CustomerDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    customerId?: string
}

const { TabNav, TabList, TabContent } = Tabs

const CustomerDetails = ({ isOpen, onClose,customerId}: CustomerDetailsModalProps) => {
       const { id } = useParams()


    const { data, isLoading } = useSWR(
  customerId ? [{ id: customerId }] : null,
  async ([params]) => { 
    const response = await apiGetCustomer<User, { id: string }>(params);
    const data = await response.data;
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No customer data found');
    }
    return data[0]; 
  },
  {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  }
)

 useEffect(() => {
  if (customerId) {
    console.log("Customer ID::" + customerId)
  }
}, [customerId])

    const handleClose = (e: MouseEvent) => {
        e.preventDefault()
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            width={900} 
            height={600}
            onClose={onClose}
        >
            <Loading loading={isLoading}>
                <div className="flex justify-between items-center mb-4">
                    <h4>Customer Details</h4>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                        ×
                    </button>
                </div>
                
                {!isEmpty(data) && (
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div className="min-w-[330px] 2xl:min-w-[400px]">
                            <ProfileSection data={data} />
                        </div>
                        <Card className="w-full ">
                            <Tabs defaultValue="activity">
                                <TabList>
                                    <TabNav value="activity">Activity</TabNav>
                                </TabList>
                                <div className="p-4 flex-1 overflow-y-auto"> 
                                    <TabContent value="activity">
                                        <ActivitySection
                                            customerName={`${data.firstName} ${data.lastName}`}
                                            id={id as string}
                                        />
                                    </TabContent>
                                </div>
                            </Tabs>
                        </Card>
                    </div>
                )}
            </Loading>
        </Dialog>
    )
}

export default CustomerDetails