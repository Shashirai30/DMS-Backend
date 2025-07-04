import { apiGetCustomersList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetUserListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

export default function useCustomerList() {
  const {
    tableData,
    setTableData,
    selectedCustomer,
    setSelectedCustomer,
    setSelectAllCustomer,
  } = useCustomerListStore((state) => state)

  const { data, error, isLoading, mutate } = useSWR<GetUserListResponse>(
    [{ ...tableData }],
    async ([params]) => {
      console.log('Users params:', JSON.stringify(params));
      const response = await apiGetCustomersList<GetUserListResponse, TableQueries>(params);
      console.log('List of Customer API Response:', response);

      // Transform the response
      return {
        ...response.data,
      };
    },
    {
      revalidateOnFocus: false,
    }
  );

  // Extract customer list and total count from the response
  const userList = data?.content || [];
  const userListTotal = data?.page.totalElements || 0;
  return {
    userList,
    userListTotal,
    error,
    isLoading,
    tableData,
    mutate,
    setTableData,
    selectedCustomer,
    setSelectedCustomer,
    setSelectAllCustomer,
  }
}
