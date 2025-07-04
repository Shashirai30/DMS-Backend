import { apiDeleteFile, apiDeleteFolder } from '@/services/FileService'
import { useFileManagerStore } from '../store/useFolderManagerStore'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const FileManagerDeleteDialog = () => {
    const { deleteDialog, setDeleteDialog, deleteFile } = useFileManagerStore()

    const handleDeleteDialogClose = () => {
        setDeleteDialog({ id: '', open: false })
    }

    const handleDeleteConfirm = async () => {
        try {
            console.log('Deleting File Type:', deleteDialog.fileType);
    
            if (deleteDialog.fileType === 'directory') {
                console.log('Calling apiDeleteFolder for ID:', deleteDialog.id);
                await apiDeleteFolder<void>(deleteDialog.id);
            } else {
                console.log('Calling apiDeleteFile for ID:', deleteDialog.id);
                await apiDeleteFile<void>(deleteDialog.id);
            }
    
            deleteFile(deleteDialog.id);
            setDeleteDialog({ id: '', open: false });
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    

    return (
        <ConfirmDialog
            isOpen={deleteDialog.open}
            type="danger"
            title="Delete file"
            onClose={handleDeleteDialogClose}
            onRequestClose={handleDeleteDialogClose}
            onCancel={handleDeleteDialogClose}
            onConfirm={handleDeleteConfirm}
        >
            <p>
                Are you sure you want to delete file? This action can&apos;t be
                undo.{' '}
            </p>
        </ConfirmDialog>
    )
}

export default FileManagerDeleteDialog
