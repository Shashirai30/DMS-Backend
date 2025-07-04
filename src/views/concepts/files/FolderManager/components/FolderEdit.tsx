// Project: File Manager Component
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useFileManagerStore } from '../store/useFolderManagerStore'
import { apiUpdateFolder } from '@/services/FileService'

interface Category {
    id?: string;
    name?: string;
}

const FolderEdit = () => {
    const { folderEditDialog, setFolderEditDialog, renameFolder } = useFileManagerStore()
    const [isUploading, setIsUploading] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [folderDescription, setFolderDescription] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        if (folderEditDialog.open) {
            setFolderName(folderEditDialog.foldername || '')
            setFolderDescription(folderEditDialog.description || '')
            
            // Handle categories initialization
            if (folderEditDialog.categories && folderEditDialog.categories.length > 0) {
                // Check if categories are strings or objects
                const initialCategories = Array.isArray(folderEditDialog.categories)
                    ? folderEditDialog.categories.map(cat => 
                        typeof cat === 'string' ? { name: cat } : cat
                      )
                    : []
                setSelectedCategories(initialCategories)
            } else {
                setSelectedCategories([])
            }
        }
    }, [folderEditDialog])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', 'Tab', ','].includes(e.key)) {
            e.preventDefault()
            addCategory()
        }
    }

    const addCategory = () => {
        const trimmedValue = inputValue.trim()
        if (trimmedValue && !selectedCategories.some(cat => cat.name === trimmedValue)) {
            setSelectedCategories([...selectedCategories, { name: trimmedValue }])
            setInputValue('')
        }
    }

    const removeCategory = (index: number) => {
        setSelectedCategories(selectedCategories.filter((_, i) => i !== index))
    }

    const handleEdit = async () => {
        if (!folderName) {
            toast.push(
                <Notification title={'Folder name is required'} type="warning" />,
                { placement: 'top-center' },
            )
            return
        }

        setIsUploading(true)

        try {
            const updateData = {
                name: folderName,
                description: folderDescription,
                categories: selectedCategories.map(cat => ({
                    id: cat.id,      // Include the category ID
                    name: cat.name   // Include the category name
                }))            }
            
                const response = await apiUpdateFolder(folderEditDialog.id, updateData) as { message: string };
                // Update local state
            renameFolder({
                id: folderEditDialog.id,
                folderName,
                folderdescription: folderDescription
            })

            toast.push(
                <Notification title={response.message || 'Folder updated successfully'} type="success" />,
                { placement: 'top-center' },
            )
            
            setFolderEditDialog({ ...folderEditDialog, open: false })
        } catch (error) {
            console.error('Error updating folder:', error)
            toast.push(
                <Notification title={'Failed to update folder'} type="danger" />,
                { placement: 'top-center' },
            )
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog
            isOpen={folderEditDialog.open}
            onClose={() => setFolderEditDialog({ ...folderEditDialog, open: false })}
            onRequestClose={() => setFolderEditDialog({ ...folderEditDialog, open: false })}
        >
            <h4>Edit Folder</h4>
            <div className="mt-4">
                <label className="block text-lg font-medium text-gray-700">
                    Folder Name
                </label>
                <input
                    type="text"
                    value={folderName}
                    className="mt-1 block w-full h-10 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter folder name"
                    onChange={(e) => setFolderName(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label htmlFor="folderDescription" className="block text-lg font-medium text-gray-700">
                    Folder Description
                </label>
                <input
                    type="text"
                    id="folderDescription"
                    name="description"
                    value={folderDescription}
                    className="mt-1 block w-full h-10 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter folder description"
                    onChange={(e) => setFolderDescription(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label htmlFor="categories" className="block text-lg font-medium text-gray-700">
                    Add Categories
                </label>
                <div className="mt-1 flex flex-wrap gap-2 rounded-md border border-gray-300 shadow-sm px-3 py-2 min-h-10">
                    {selectedCategories.map((category, index) => (
                        <div key={index} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                            {category.name}
                            <button
                                type="button"
                                className="ml-2 text-blue-500 hover:text-blue-700"
                                onClick={() => removeCategory(index)}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        className="flex-1 border-none outline-none min-w-[100px]"
                        placeholder="Type and press enter to add categories"
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <Button
                    variant="plain"
                    onClick={() => setFolderEditDialog({ ...folderEditDialog, open: false })}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    loading={isUploading}
                    disabled={!folderName}
                    onClick={handleEdit}
                >
                    Save Changes
                </Button>
            </div>
        </Dialog>
    )
}

export default FolderEdit