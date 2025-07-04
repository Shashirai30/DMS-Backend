import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { apiGetCustomer, apiUpdateUser } from '@/services/CustomersService';
import CustomerForm from '../CustomerForm';
import NoUserFound from '@/assets/svg/NoUserFound';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import type { CustomerFormSchema } from '../CustomerForm';
import { User } from '@/@types/auth';

const CustomerEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { data, isLoading, error } = useSWR(
        [{ id: id as string }],
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
        },
    );

    if (error) {
        toast.push(
            <Notification type="danger">Failed to fetch customer data: {error.data?.message}</Notification>,
            { placement: 'top-center' },
        );
    }

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmiting, setIsSubmiting] = useState(false);

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        setIsSubmiting(true);
        try {
            // Create payload with emailVerified and projectFileIds
            const payload = {
                ...values,
                emailVerified: true,
                projectFileIds: values.projectFileIds || []
            };
            
            await apiUpdateUser<typeof payload>({
                id: id as string,
                values: payload,
            });
            
            toast.push(
                <Notification type="success"> 
                    {data?.message ?? 'Update successful.'}
                </Notification>, 
                { placement: 'top-center' }
            );
            navigate('/concepts/customers/customer-list');
        } catch (error: any) {
            console.error('Error updating customer:', error);
            toast.push(
                <Notification type='warning'> 
                    {error?.response?.data?.message ?? error?.message ?? 'Failed to save changes!'}
                </Notification>, 
                { placement: 'top-center' }
            );
        } finally {
            setIsSubmiting(false);
        }
    };


    const getDefaultValues = (): CustomerFormSchema => {
    if (data) {
        const { 
           
            firstName, 
            lastName, 
            empCode, 
            email, 
            status, 
            image, 
            phoneNumber, 
            roles, 
            password,
            emailVerified,
            projectFileIds = [] 
        } = data;

        return {
            
            email,
            empCode,
            firstName,
            image,
            lastName,
            phoneNumber,
            roles,
            status,
            password,
            emailVerified: emailVerified ?? true,
            projectFileIds: Array.isArray(projectFileIds) ? projectFileIds : [],
        };
    }

    // Fallback: fill all required fields with empty/default values
    return {
        firstName: '',
        lastName: '',
        empCode: '',
        email: '',
        phoneNumber: '',
        status: 'ACTIVE',
        password: '',

        roles: [],
        image: '',
        emailVerified: false,
        projectFileIds: [],
    };
};


    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(true)
        toast.push(
            <Notification type="success">Customer deleted!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/customers/customer-list')
    }
    
    const handleDelete = () => {
        setDeleteConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleBack = () => {
        navigate('/concepts/customers/customer-list');
    };

    return (
        <>
            <div>
                {!isLoading && !data && (
                    <div className="h-full flex flex-col items-center justify-center">
                        <NoUserFound height={280} width={280} />
                        <h3 className="mt-8">No user found!</h3>
                    </div>
                )}
                {!isLoading && data && (
                    <div>
                        <CustomerForm
                            defaultValues={getDefaultValues() as CustomerFormSchema}
                            newCustomer={false}
                            onFormSubmit={handleFormSubmit}
                        >
                            <Container>
                                <div className="flex items-center justify-between px-8">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        variant="plain"
                                        icon={<TbArrowNarrowLeft />}
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                    <div className="flex items-center">
                                        <Button
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            customColorClass={() =>
                                                'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                            }
                                            icon={<TbTrash />}
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="solid"
                                            type="submit"
                                            loading={isSubmiting}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </Container>
                        </CustomerForm>
                        <ConfirmDialog
                            isOpen={deleteConfirmationOpen}
                            type="danger"
                            title="Remove customers"
                            onClose={handleCancel}
                            onRequestClose={handleCancel}
                            onCancel={handleCancel}
                            onConfirm={handleConfirmDelete}
                        >
                            <p>
                                Are you sure you want to remove this customer? This
                                action can&apos;t be undone.
                            </p>
                        </ConfirmDialog>
                    </div>
                )}
            </div>
        </>
    );
};

export default CustomerEdit;

