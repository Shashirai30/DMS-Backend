
import React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjs from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfFile: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfFile }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) =>
      defaultTabs.filter((tab) => tab.title !== 'Bookmark' && tab.title !== 'Attachment'),

    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(props) => {
          // Customize here which toolbar items you want
          const {
            CurrentPageInput,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            Zoom,
            ZoomIn,
            ZoomOut,
            ShowSearchPopover,
            Print,
            EnterFullScreen,
            SwitchTheme,
            ShowProperties,
            RotateBackwardMenuItem,
            RotateForwardMenuItem,


          } = props;

          return (
            <div className="flex items-center justify-between px-9  border-b gap-4 border-gray-200">
              <ShowSearchPopover />
              <GoToPreviousPage />
              <CurrentPageInput />
              <NumberOfPages />
              <GoToNextPage />
              <ZoomOut />
              <Zoom />
              <ZoomIn />
              <RotateBackwardMenuItem onClick={function (): void {
                throw new Error('Function not implemented.');
              } } />
              <RotateForwardMenuItem onClick={function (): void {
                throw new Error('Function not implemented.');
              } } />
              <Print />
              <EnterFullScreen />
              <SwitchTheme />
              <ShowProperties />
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  return (
    <div className="w-full h-[76vh] rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      {pdfFile && <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />}
    </div>
  );
};

export default React.memo(PdfViewer);
