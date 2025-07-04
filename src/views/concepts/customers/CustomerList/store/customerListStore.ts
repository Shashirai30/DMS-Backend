import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { User, } from '../types'

export const initialTableData: TableQueries = {
    page: 0,
    size: 10,
    sortBy: '',
    search: '',
    sortDir:''
   
    //  sortBy: {
    //     order: '',
    //     key: '',
    // },
}



export type CustomersListState = {
    tableData: TableQueries
    selectedCustomer: Partial<User>[]
}

type CustomersListAction = {
    setTableData: (data: TableQueries) => void
    setSelectedCustomer: (checked: boolean, customer: User) => void
    setSelectAllCustomer: (users: User[]) => void
}

const initialState: CustomersListState = {
    tableData: initialTableData,
    selectedCustomer: [],
}
export const useCustomerListStore = create<
    CustomersListState & CustomersListAction
>((set) => ({
    ...initialState,
    setTableData: (data) => set(() => ({ tableData: data })),
    setSelectedCustomer: (checked, row) =>
        set((state) => {
            const prevData = state.selectedCustomer
            if (checked) {
                return { selectedCustomer: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevCustomer) => row.id === prevCustomer.id)
                ) {
                    return {
                        selectedCustomer: prevData.filter(
                            (prevCustomer) => prevCustomer.id !== row.id,
                        ),
                    }
                }
                return { selectedCustomer: prevData }
            }
        }),
    setSelectAllCustomer: (users) => set(() => ({ selectedCustomer: users })),
}))