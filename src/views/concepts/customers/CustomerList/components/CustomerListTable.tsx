import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { User } from '../types'
import type { TableQueries } from '@/@types/common'
import CustomerDetails from '../../CustomerDetails'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    blocked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: User }) => {

    return (
        <div className="flex items-center">
            <Avatar size={40} shape="circle" src={row.image} />
            {/* <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                // to={`/concepts/customers/customer-details/${row.id}`}
            > */}
            <span className='ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`'>{row.firstName} {row.lastName}</span>

        </div>
    )
}

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const CustomerListTable = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)


    const {
        userList,
        userListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllCustomer,
        setSelectedCustomer,
        selectedCustomer,
    } = useCustomerList()

    const handleEdit = (customer: User) => {
        console.log('Editing customer with ID:', customer.id);
        console.log('Customer :', customer);
        navigate(`/concepts/customers/customer-edit/${customer.id}`)
    }

    const handleViewDetails = (customer: User) => {
        console.log('Customer :', customer);
        setSelectedCustomerId(customer.id)  // Set the customer ID
        setIsModalOpen(true)         // Open the modal
    // navigate(`/concepts/customers/customer-details/${customer.id}`)
}

const columns: ColumnDef<User>[] = useMemo(
    () => [
        {
            header: 'Name',
            accessorKey: 'firstName',
            cell: (props) => {
                const row = props.row.original
                return <NameColumn row={row} />
            },
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Employee Code',
            accessorKey: 'empCode',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.empCode}</span>
            },
        },
        {
            header: 'Phone Number',
            accessorKey: 'phoneNumber',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.phoneNumber}</span>
            },
        },
        {
            header: 'Roles',
            accessorKey: 'roles',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.roles.join(', ')}</span>
            },
        },

        {
            header: 'Status',
            accessorKey: 'status',
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className="flex items-center">
                        <Tag className={statusColor[row.status]}>
                            <span className="capitalize">{row.status}</span>
                        </Tag>
                    </div>
                )
            },
        },

        {
            header: '',
            id: 'action',
            cell: (props) => (
                <ActionColumn
                    onEdit={() => handleEdit(props.row.original)}
                    onViewDetail={() =>
                        handleViewDetails(props.row.original)
                    }
                />
            ),
        },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
)

const handleSetTableData = (data: TableQueries) => {
    setTableData(data)
    if (selectedCustomer.length > 0) {
        setSelectAllCustomer([])
    }
}

const handlePaginationChange = (page: number) => {
    const newTableData = cloneDeep(tableData);
    newTableData.page = page;
    handleSetTableData(newTableData);
}

const handleSelectChange = (value: number) => {
    console.log("Selected Page Size:", value);
    const newTableData = cloneDeep(tableData)
    newTableData.size = Number(value)
    newTableData.page = 0
    console.log("After change  Page Size", newTableData);
    handleSetTableData(newTableData)
}

const handleSort = (sort: OnSortParam) => {
    console.log("Sorting by:", sort);
    const newTableData = cloneDeep(tableData)
    newTableData.sortBy = sort.key
    newTableData.sortDir = sort.order
    handleSetTableData(newTableData)
}

const handleRowSelect = (checked: boolean, row: User) => {
    setSelectedCustomer(checked, row)
}

const handleAllRowSelect = (checked: boolean, rows: Row<User>[]) => {
    if (checked) {
        const originalRows = rows.map((row) => row.original)
        setSelectAllCustomer(originalRows)
    } else {
        setSelectAllCustomer([])
    }
}

return (
    <>
    <DataTable
        selectable
        columns={columns}
        data={userList}
        noData={!isLoading && userList.length === 0}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={isLoading}
        pagingData={{
            total: userListTotal,
            pageIndex: tableData.page as number,
            pageSize: tableData.size as number,
        }}
        checkboxChecked={(row) =>
            selectedCustomer.some((selected) => selected.id === row.id)
        }
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
        onSort={handleSort}
        onCheckBoxChange={handleRowSelect}
        onIndeterminateCheckBoxChange={handleAllRowSelect}
    /> 
    {/* Add the modal at the bottom of your component */}
    <CustomerDetails
        customerId={selectedCustomerId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}


        />
</>
)
}

export default CustomerListTable
