'use client'
import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import useSWRMutation from 'swr/mutation'
import SharedFilesHeader from './shareHeader'
import { useShareFileManagerStore } from './useShareFilesStore'
import ShareList from './ShareList'
import { apiSharedDocPreview, apiSharedDocument, } from '@/services/Shared_DocService'
import { GetShareFilesListResponse } from './types'
import DocumentPreview from './PreviewFile'
import { useSessionUser } from '@/store/authStore'

const { THead, Th, Tr } = Table

// API Call Function
async function getSharedFile(_: string, { arg }: { arg: { userEmail: string, page: number, size: number } }) {
  const data = await apiSharedDocument<GetShareFilesListResponse, { userEmail: string, page: number, size: number }>({
    userEmail: arg.userEmail,
    page: arg.page,
    size: arg.size,
  });
  return data;
}

const SharedFiles = () => {
  const {
    layout,
    fileList,
    setFileList,
    setSelectedFile,
  } = useShareFileManagerStore()

  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0); // 0-based index
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { email, } = useSessionUser((state) => state.user)
  const userEmail = email 
  const { trigger, isMutating } = useSWRMutation(
    `/api/share/document`,
    getSharedFile,
    {
      onSuccess: (resp) => {
        setFileList(resp.data.content);
        setTotalItems(resp.data.page.totalElements);
        setTotalPages(resp.data.page.totalPages);
      },
    },
  );

  const fetchData = () => {
    trigger({ userEmail, page: currentPage, size: pageSize });
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const handleFileClick = (fileId: string, shareToken?: string | undefined) => {
    console.log('Share Token:', shareToken);
    setSelectedFile(fileId);
    handlePreview(fileId, shareToken);
  }

  const handlePreview = async (fileId: string, shareToken?: string | undefined) => {
    try {
      const file = fileList.find((f) => f.id === fileId);
      if (!file) {
        console.error('File not found');
        return;
      }
      const response = await apiSharedDocPreview<Blob>(shareToken!);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      console.log("URL:", url);
      const updatedFile = { ...file, srcUrl: url };
      setPreviewFile(updatedFile.srcUrl);
    } catch (error) {
      console.error('Error fetching file preview:', error);
    }
  };
  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(0); 
  };

  return (
    <div>
      <SharedFilesHeader
        onSearch={(query) => {
          console.log('Search query:', query)
          // Optional: add search logic later if needed
        }}
      />
      <div className="mt-6">
        {isMutating ? (
          layout === 'grid' ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="bg-gray-100 h-40 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            <Table>
              <THead>
                <Tr>
                  <Th>File</Th>
                  <Th>Department</Th>
                  <Th>Size</Th>
                  <Th>Type</Th>
                  <Th></Th>
                </Tr>
              </THead>
              <TableRowSkeleton
                avatarInColumns={[0]}
                columns={4}
                rows={5}
                avatarProps={{
                  width: 30,
                  height: 30,
                }}
              />
            </Table>
          )
        ) : (
          <ShareList
            fileList={fileList}
            layout={layout}
            pageSize={pageSize}
            currentPage={currentPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPreview={handlePreview}
            onPaginationChange={handlePaginationChange}
            onClick={handleFileClick}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
      {previewFile && (
        <DocumentPreview
          previewFile={previewFile}
          onClose={handleClosePreview}
        />
      )}    </div>

  )
}

export default SharedFiles
