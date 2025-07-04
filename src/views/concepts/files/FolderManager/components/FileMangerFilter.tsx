
// components/FolderManagerFilters.tsx
import React from 'react';
import { Input, Select } from '@/components/ui';
import { useFileManagerStore } from '../store/useFolderManagerStore';
import { Category } from '../types';

interface FolderManagerFiltersProps {
  FileTypeFilter: string;
  fileName: string;
  fileCategoryFilter: string;
  fileYearFilter: string; // New prop for year filter
  isViewingFiles: boolean;
  onCategoryChange: (label: string) => void;
  onFileTypeChange: (value: string) => void;
  onFileNameChange: (value: string) => void;
  onYearChange: (value: string) => void; // New handler for year change
}

const FolderManagerFilters: React.FC<FolderManagerFiltersProps> = ({
  FileTypeFilter,
  fileName,
  fileCategoryFilter,
  fileYearFilter, // New prop
  isViewingFiles,
  onFileTypeChange,
  onFileNameChange,
  onCategoryChange,
  onYearChange, // New handler
}) => {
  const { folderInfo } = useFileManagerStore();
  const categoryOptions = [
    ...(folderInfo?.categories?.map(cat => ({
      value: (cat as Category).id,
      label: (cat as Category).name
    })) || [])
  ];
  // Calculate grid columns based on view mode
  const gridColumns = isViewingFiles ? 'md:grid-cols-4' : 'md:grid-cols-1'; // Updated to 4 columns
  // Adjust card width based on view mode
  const cardWidth = isViewingFiles ? 'w-full' : 'w-full md:w-full';

  // Generate year options for the last 20 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 mt-4 ${cardWidth} mx-auto`}>
      <div className={`grid grid-cols-1 ${gridColumns} gap-4`}>
        <div>
          <label className="block mb-2 text-sm font-medium text-black">
            {isViewingFiles ? 'File Name' : 'Folder Name'}
          </label>
          <Input
            type="text"
            placeholder= {isViewingFiles?"Enter file name":"Enter folder name"}	
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
          />
        </div>
        {isViewingFiles && (
          <div>
            <label className="block mb-2 text-sm font-medium text-black">File Type</label>
            <Input
              type="text"
              placeholder="Enter file type"
              value={FileTypeFilter}
              onChange={(e) => {
                onFileTypeChange(e.target.value);
              }}
            />
          </div>
        )}
        {isViewingFiles && (
          <div>
            <label className="block mb-2 text-sm font-medium text-black">Category</label>
            <Select
              options={categoryOptions}
              placeholder="Select category"
              value={categoryOptions.find(option => option.label === fileCategoryFilter)||null}
              isClearable={true}
              onChange={(option) => {
                onCategoryChange(option?.label || '');
              }}
            />
          </div>
        )}
        {isViewingFiles && (
          <div>
            <label className="block mb-2 text-sm font-medium text-black">Year</label>
            <Select
              options={yearOptions}
              placeholder="Select year"
              value={yearOptions.find(option => option.value === fileYearFilter) || null}
              isClearable={true}
              onChange={(option) => {
                onYearChange(option?.value || '');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderManagerFilters;
