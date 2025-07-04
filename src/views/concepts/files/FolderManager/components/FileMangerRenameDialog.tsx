import { useLayoutEffect, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { useFileManagerStore } from '../store/useFolderManagerStore'
import { apiRenameFile } from '@/services/FileService'
import { Input, Notification, toast, Select } from '@/components/ui'

interface Category {
    id: string;
    name: string;
}

const FileManagerRenameDialog = () => {
    const { renameDialog, setRenameDialog, renameFile, folderInfo } = useFileManagerStore()
    const [newName, setNewName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    
    const categories = folderInfo?.categories?.map((cat: string | Category) => {
        if (typeof cat === 'string') {
            return { id: cat.toLowerCase(), name: cat }
        }
        return cat
    }) || []

    useLayoutEffect(() => {   
        setNewName(renameDialog?.filename || '')
        
        // Initialize category if it exists
        if (renameDialog.fileCategory) {
            const initialCategory = typeof renameDialog.fileCategory === 'string' 
                ? categories.find(cat => cat.name === renameDialog.fileCategory) || null
                : renameDialog.fileCategory
            setSelectedCategory(initialCategory)
        } else {
            setSelectedCategory(null)
        }
    }, [renameDialog])

    const handleDialogClose = () => {
        setRenameDialog({ id: '', open: false })
    }

    const handleCategoryChange = (category: Category | null) => {
        setSelectedCategory(category)
    }

    const handleSubmit = async() => {
        try {
            await apiRenameFile({ 
                id: renameDialog.id, 
                newName: newName,
                fileCategory: selectedCategory ? selectedCategory.name : ''
            }); 
            
            renameFile({ 
                id: renameDialog.id, 
                fileName: newName,
                fileCategory: selectedCategory ? selectedCategory.name : ''
            })
            
            toast.push(
                <Notification title={'File Renamed successfully'} type="success" />,
                { placement: 'top-center' },
            )
            
            setRenameDialog({ id: '', open: false });
        } catch (error) {
            console.error("Error renaming file:", error);
            toast.push(
                <Notification title={'Failed to rename file'} type="danger" />,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <Dialog
            isOpen={renameDialog.open}
            contentClassName="mt-[50%]"
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h4>Rename File</h4>
            
            {/* Rename Field */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    New File Name
                </label>
                <Input
                    placeholder="Enter new file name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </div>
            
            {/* Category Dropdown */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Category
                </label>
                <Select
                    options={categories}
                    placeholder="Select a category"
                    value={selectedCategory}
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    onChange={handleCategoryChange}
                />
            </div>
            
            <div className="mt-6 flex justify-end items-center gap-2">
                <Button size="sm" onClick={handleDialogClose}>
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    size="sm"
                    disabled={newName.length === 0}
                    onClick={handleSubmit}
                >
                    Save Changes
                </Button>
            </div>
        </Dialog>
    )
}

export default FileManagerRenameDialog
