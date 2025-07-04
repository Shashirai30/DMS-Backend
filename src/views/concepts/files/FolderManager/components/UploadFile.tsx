

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import UploadMedia from '@/assets/svg/UploadMedia'
import { apiUploadFile } from '@/services/FileService'
import { useFileManagerStore } from '../store/useFolderManagerStore'
import { Select } from '@/components/ui'
import { Category } from '../types'

const UploadFile = () => {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const fetchFiles = useFileManagerStore(state => state.fetchFileList);

    interface UploadResponse {
        fileId: string;
        fileName: string;
        fileUrl: string;
    }
    

    const { folderInfo } = useFileManagerStore();
   const categoryOptions = [
       ...(folderInfo?.categories?.map(cat => ({
         value: (cat as Category).id,
         label: (cat as Category).name
       })) || [])
     ];
    const handleUploadDialogClose = () => {
        setUploadDialogOpen(false)
    }

    const handleUpload = async () => {
        // Check if there are files to upload
        if (uploadedFiles.length === 0) {
            return;
        }
        // Get the first file from the uploaded files array
        const file = uploadedFiles[0];

        console.log("Uploading file:", file);
        setIsUploading(true); // Set uploading state to true
        // Example metadata (documentDTO)
        const folderNames = folderInfo?.name;
        console.log("directories :", folderNames)
        console.log("selectedCategories :", selectedCategories)

        const documentDTO = {
            folder: folderNames,
            fileCategory: selectedCategories.join(', '), // join categories if multiple selected
        };

        try {
            // Call the apiUploadFile function with the file and documentDTO
            const response = await apiUploadFile<UploadResponse, typeof documentDTO>(file, documentDTO);
            console.log("File Uploaded:", response);

            // Show success notification
            toast.push(
                <Notification title={'Successfully uploaded'} type="success" />,
                { placement: 'top-center' }
            );

            // Clear uploaded files after successful upload
            setUploadedFiles([]);
            console.log('Refetching files...');
             await fetchFiles();
            console.log('Files refetched');
            
        } catch (error) {
            console.error("Upload failed:", error);

            // Show error notification
            toast.push(
                <Notification title={'Upload failed'} type="danger" />,
                { placement: 'top-center' }
            );
        } finally {
            setIsUploading(false);
            handleUploadDialogClose();
        }
    };

    return (
        <>
            <Button variant="solid" onClick={() => setUploadDialogOpen(true)}>
                Upload
            </Button>
            <Dialog
                isOpen={uploadDialogOpen}
                onClose={handleUploadDialogClose}
                onRequestClose={handleUploadDialogClose}
            >
                <h4>Upload Files</h4>
                <Upload
                    draggable
                    className="mt-6 bg-gray-100"
                    onChange={setUploadedFiles}
                    onFileRemove={setUploadedFiles}
                >
                    <div className="my-4 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <UploadMedia height={150} width={200} />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Drop your files here, or{' '}
                            </span>
                            <span className="text-blue-500">browse</span>
                        </p>
                        <p className="mt-1 font-semibold opacity-60 dark:text-white">
                            through your machine
                        </p>
                    </div>
                </Upload>
                <div className="mt-4">
                    <label className="block mb-2 font-semibold text-gray-700 dark:text-white">
                        Category
                    </label>
                    <Select
                        isMulti
                        options={categoryOptions}
                        placeholder="Select Categories"
                        value={categoryOptions.filter(option =>
                            selectedCategories.includes(option.label)
                        )}
                        onChange={(selectedOptions) => {
                            const values = selectedOptions?.map(
                                (option) => option.label
                            ) || []
                            setSelectedCategories(values)
                        }}
                    />
                </div>
                <div className="mt-4">
                    <Button
                        block
                        loading={isUploading}
                        variant="solid"
                        disabled={uploadedFiles.length === 0}
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default UploadFile
