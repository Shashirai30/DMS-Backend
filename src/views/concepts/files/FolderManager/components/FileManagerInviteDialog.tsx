import { useState, useRef } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useFileManagerStore } from '../store/useFolderManagerStore'
import classNames from '@/utils/classNames'
import { TbLink } from 'react-icons/tb'
import { apiShareDoc } from '@/services/Shared_DocService'

const FileManagerInviteDialog = () => {
    const { inviteDialog, setInviteDialog } = useFileManagerStore()

    const inputRef = useRef<HTMLInputElement>(null)

    const [inviting, setInviting] = useState(false)

    const handleDialogClose = () => {
        setInviteDialog({ id: '', open: false })
    }

    const handleInvite = async () => {
        const userName = inputRef.current?.value?.trim()
    
        if (!userName) {
            alert('Please enter an email!')
            return
        }
    
        setInviting(true)
        try {
            await apiShareDoc({
                id: inviteDialog.id,
                userName,
            })
            toast.push(
                <Notification
                    type="success"
                    title="Invitation sent!"
                ></Notification>,
                { placement: 'top-end' },
            )
        } catch (error) {
            console.error(error)
            toast.push(
                <Notification
                    type="danger"
                    title="Failed to send invitation!"
                ></Notification>,
                { placement: 'top-end' },
            )
            alert('Failed to send invitation.')
        } finally {
            setInviting(false)
        }
    }
    

    const handleCopy = async () => {
        toast.push(
            <Notification type="success" title="Copied!"></Notification>,
            { placement: 'top-end' },
        )
        navigator.clipboard.writeText(window.location.href)
    }

    return (
        <Dialog
            isOpen={inviteDialog.open}
            contentClassName="mt-[50%]"
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h4>Share this file</h4>
            <div className="mt-6">
                <Input
                    ref={inputRef}
                    placeholder="Email"
                    type="email"
                    suffix={
                        <Button
                            type="button"
                            variant="solid"
                            size="sm"
                            customColorClass={({ unclickable }) =>
                                classNames(
                                    'bg-gray-900 dark:bg-gray-100 dark:hover:bg-gray-200',
                                    !unclickable
                                        ? 'hover:bg-gray-800'
                                        : 'hover:bg-gray-900',
                                )
                            }
                            loading={inviting}
                            onClick={handleInvite}
                        >
                            Invite
                        </Button>
                    }
                />
            </div>
            <div className="mt-6 flex justify-between items-center">
                <Button
                    variant="plain"
                    size="sm"
                    icon={<TbLink />}
                    onClick={handleCopy}
                >
                    Copy link
                </Button>
                <Button variant="solid" size="sm" onClick={handleDialogClose}>
                    Done
                </Button>
            </div>
        </Dialog>
    )
}

export default FileManagerInviteDialog
