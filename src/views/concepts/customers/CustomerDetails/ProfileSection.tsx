


// export default ProfileSection
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar/Avatar'
import Notification from '@/components/ui/Notification'
// import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import dayjs from 'dayjs'
import {  HiOutlineTrash } from 'react-icons/hi'
import {
    FaXTwitter,
    FaFacebookF,
    FaLinkedinIn,
    FaPinterestP,
} from 'react-icons/fa6'
import { useNavigate, } from 'react-router-dom'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

type ProfileSectionProps = {
    data: Partial<{
        id: string
        image: string
        firstName: string
        lastName: string
        email: string
        lastOnline: number
        phoneNumber: string
        roles: string[]
        personalInfo: {
            location?: string
            title?: string
            birthday?: string
            facebook?: string
            twitter?: string
            pinterest?: string
            linkedIn?: string
        }
    }>
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div className="mb-1">
            <span className="text-xs font-semibold">{title}</span>
            <p className="text-xs heading-text font-bold line-clamp-1">{value}</p>
        </div>
    )
}

const ProfileSection = ({ data = {} }: ProfileSectionProps) => {
    const navigate = useNavigate()
    // const { id } = useParams();

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleSocialNavigate = (link: string = '') => {
        if (link) window.open(`https://${link}`, '_blank', 'rel=noopener noreferrer')
    }

    const handleDialogClose = () => setDialogOpen(false)
    const handleDialogOpen = () => setDialogOpen(true)
         const handleSendMessage = () => {
            alert('Send Message  Soory not implemented yet')
        //  navigate('/concepts/chat')
     }
    const handleDelete = () => {
        setDialogOpen(false)
        navigate('/concepts/customers/customer-list')
        toast.push(
            <Notification title={'Successfully Deleted'} type="success">
                Customer successfuly deleted
            </Notification>
        )
    }

    return (
        <Card className="w-full p-3">
            {/* <div className="flex justify-end mb-1">
                <Tooltip title="Edit customer">
                    <button
                        className="text-sm p-1"
                        onClick={() => navigate(`/concepts/customers/customer-edit/${id}`)}
                    >
                        <HiPencil />
                    </button>
                </Tooltip>
            </div> */}

            <div className="flex flex-col min-h-[420px]">
                <div className="flex flex-col items-center mb-2">
                    <Avatar size={50} shape="circle" src={data.image} />
                    <h4 className="text-sm font-bold mt-1">{`${data.firstName} ${data.lastName}`}</h4>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2">
                    <CustomerInfoField title="Email" value={data.email} />
                    <CustomerInfoField title="Phone" value={data.phoneNumber} />
                    <CustomerInfoField title="Roles" value={data.roles?.join(', ')} />
                    <CustomerInfoField
                        title="Last Online"
                        value={dayjs
                            .unix(data.lastOnline as number)
                            .format('DD MMM YYYY hh:mm A')}
                    />
                </div>

                <div className="mb-7">
                    <span>Social</span>
                    <div className="flex mt-4 gap-2">
                        <Button
                            size="sm"
                            icon={
                                <FaFacebookF className="text-[#2259f2]" />
                            }
                            onClick={() =>
                                handleSocialNavigate(
                                    data.personalInfo?.facebook,
                                )
                            }
                        />
                        <Button
                            size="sm"
                            icon={
                                <FaXTwitter className="text-black dark:text-white" />
                            }
                            onClick={() =>
                                handleSocialNavigate(
                                    data.personalInfo?.twitter,
                                )
                            }
                        />
                        <Button
                            size="sm"
                            icon={
                                <FaLinkedinIn className="text-[#155fb8]" />
                            }
                            onClick={() =>
                                handleSocialNavigate(
                                    data.personalInfo?.linkedIn,
                                )
                            }
                        />
                        <Button
                            size="sm"
                            icon={
                                <FaPinterestP className="text-[#df0018]" />
                            }
                            onClick={() =>
                                handleSocialNavigate(
                                    data.personalInfo?.pinterest,
                                )
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-auto">
                <Button block variant="solid" onClick={handleSendMessage}>
                         Send Messsage
                   </Button>
                    <Button
                        block
                        size="xs"
                        variant="plain"
                        className="text-error hover:text-error-dark"
                        icon={<HiOutlineTrash className="text-xs" />}
                        onClick={handleDialogOpen}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete customer"
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                onCancel={handleDialogClose}
                onConfirm={handleDelete}
            >
                <p className="text-sm">
                    Are you sure you want to delete this customer? All
                    record related to this customer will be deleted as well.
                    This action cannot be undone.
                </p>
            </ConfirmDialog>
        </Card>
    )
}

export default ProfileSection