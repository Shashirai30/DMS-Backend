// Note: Shared Files Header Component
import { useState } from 'react';
import Segment from '@/components/ui/Segment';
import { TbLayoutGrid, TbList } from 'react-icons/tb';
import { useShareFileManagerStore } from './useShareFilesStore';
import { ShareLayout } from './types';
// import type { Layout } from '../types';

type SharedFilesHeaderProps = {
  onSearch: (query: string) => void;
};

const SharedFilesHeader = ({ onSearch }: SharedFilesHeaderProps) => {
    const { layout, setLayout } = useShareFileManagerStore();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left side: Title */}
      <div>
        <h3 className="text-base sm:text-2xl font-bold">
          Shared Files
        </h3>
      </div>

      {/* Right side: Search + Layout + Button */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search files"
            value={searchTerm}
            className="w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5a7.5 7.5 0 010 11.65z" />
            </svg>
          </div>
        </div>

        {/* Layout Toggle */}
        <Segment
          value={layout}
          onChange={(val) => setLayout(val as ShareLayout)}
        >
          <Segment.Item value="grid" className="text-xl px-3">
            <TbLayoutGrid />
          </Segment.Item>
          <Segment.Item value="list" className="text-xl px-3">
            <TbList />
          </Segment.Item>
        </Segment>

        {/* Share File Button
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          onClick={onCreateFileClick}
        >
          Share File
        </Button> */}
      </div>
    </div>
  );
};

export default SharedFilesHeader;
