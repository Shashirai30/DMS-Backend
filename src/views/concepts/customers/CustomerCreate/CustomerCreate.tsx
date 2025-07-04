import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { CustomerFormSchema } from '../CustomerForm'
import { apiCreateUser } from '@/services/CustomersService'
import Loading from '@/components/shared/Loading'

const CustomerCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)

        try {
            // Create API payload with emailVerified and projectFileIds
            const payload = {
                ...values,
                emailVerified: true,
                // Ensure projectFileIds is always present as number array
                projectFileIds: values.projectFileIds || []
            };

            const response = await apiCreateUser<typeof payload>(payload)
            console.log('API Response Create User :', response)

            toast.push(
                <Notification type="success">
                    {`${response?.message ?? 'Customer created successfully!'}`}
                </Notification>,
                { placement: 'top-center' }
            )

            navigate('/concepts/customers/customer-list')
        } catch (error: any) {
            let errorMessage = 'Failed to create customer. Please try again.'
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error?.message) {
                errorMessage = error.message
            }

            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' }
            )
            console.error('Error:', error)
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Customer discarded!</Notification>,
            { placement: 'top-center' }
        )
        navigate('/concepts/customers/customer-list')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <Loading loading={isSubmiting}>
                <CustomerForm
                    newCustomer
                    defaultValues={{
                        firstName: '',
                        lastName: '',
                        empCode: '',
                        email: '',
                        phoneNumber: '',
                        status: 'ACTIVE',
                        image: '',
                        roles: [],
                        password: '',
                        // Initialize projectFileIds as empty array
                        projectFileIds: []
                    }}
                    onFormSubmit={handleFormSubmit}
                >
                    <Container>
                        <div className="flex items-center justify-between px-8">
                            <span></span>
                            <div className="flex items-center">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                    }
                                    icon={<TbTrash />}
                                    onClick={handleDiscard}
                                >
                                    Discard
                                </Button>
                                <Button variant="solid" type="submit" loading={isSubmiting}>
                                    Create
                                </Button>
                            </div>
                        </div>
                    </Container>
                </CustomerForm>
            </Loading>

            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>Are you sure you want to discard this? This action can&apos;t be undone.</p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerCreate
