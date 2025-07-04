// CreateFolder.tsx
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiCreateFolders } from '@/services/FileService'
import { useFileManagerStore } from '../store/useFolderManagerStore'

interface Category {
  name: string
}


const CreateFolder = () => {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [folderCode,  setFolderCode] = useState('')
    const [folderDescription, setFolderDescription] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const [inputValue, setInputValue] = useState('')
    const addFolder = useFileManagerStore((state) => state.addFolder) // 👈 pull action

    const handleUploadDialogClose = () => {
        setUploadDialogOpen(false)
        setFolderName('')
        setFolderDescription('')
        setSelectedCategories([])
        setFolderCode('')
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', 'Tab',' ', ','].includes(e.key)) {
            e.preventDefault()
            addCategory()
        }
    }

    const addCategory = () => {
        const trimmedValue = inputValue.trim()
        
        if (trimmedValue && !selectedCategories.some(cat => cat.name === trimmedValue)) {
            setSelectedCategories([
                ...selectedCategories,
                { name: trimmedValue }
            ])
            setInputValue('')
        }
    }

    const removeCategory = (index: number) => {
        setSelectedCategories(selectedCategories.filter((_, i) => i !== index))
    }
    const handleUpload = async () => {
        if (!folderName) {
            toast.push(
                <Notification title={'Folder name is required'} type="warning" />,
                { placement: 'top-center' },
            )
            return
        }

        setIsUploading(true)

        const payload = {
            name: folderName,
            description: folderDescription,
            code: folderCode,
            categories: selectedCategories,
        }
        try {
            const response = await apiCreateFolders(payload)
            console.log(response, "Response from folder creation")
            const data = response.data 

             if (data) {
                console.log(data),  "Data from folder creation response";
                
            addFolder({
                id: data.id,
                folderName: data.name,
                folderdescription: data.description,
                categories: data.cataategories,
                directoryCode: data.code,
            }) 
                handleUploadDialogClose()
                toast.push(
                    <Notification title={'Folder created successfully'} type="success" />,
                    { placement: 'top-center' },
                )
            }
        } catch (error) {
            console.error('Error creating folder:', error)
            toast.push(
                <Notification title={'Failed to create folder'} type="danger" />,
                { placement: 'top-center' },
            )
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <>
            <Button variant="solid" onClick={() => setUploadDialogOpen(true)}>
                Create Folder
            </Button>
            <Dialog
                isOpen={uploadDialogOpen}
                onClose={handleUploadDialogClose}
                onRequestClose={handleUploadDialogClose}
            >
                <h4>Create Folder</h4>
                <div className="mt-4">
                    <label htmlFor="folderName" className="block text-lg font-medium text-gray-700">
                        Folder Name
                    </label>
                    <input
                        type="text"
                        id="folderName"
                        name='name'
                        value={folderName}
                        className="mt-1 block w-full h-10 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter folder name"
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="folderName" className="block text-lg font-medium text-gray-700">
                        Folder Code
                    </label>
                    <input
                        type="text"
                        id="folderCode"
                        name='code'
                        value={folderCode}
                        className="mt-1 block w-full h-10 p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter folder code"
                        onChange={(e) => setFolderCode(e.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="folderDescription" className="block text-lg font-medium text-gray-700">
                        Folder Description
                    </label>
                    <input
                        type="text"
                        id="folderDescription"
                        name='description'
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
                        disabled={isUploading}
                        onClick={handleUploadDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        loading={isUploading}
                        disabled={!folderName}
                        onClick={handleUpload}
                    >
                        Create
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default CreateFolder