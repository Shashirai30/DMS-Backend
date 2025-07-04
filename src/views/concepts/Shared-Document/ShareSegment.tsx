// import FileItemDropdown from './FileItemDropdown'
import fileSizeUnit from '@/utils/fileSizeUnit'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import FileIcon from '@/components/view/FileIcon'
import type {  ShareBaseFileItemProps, } from './types'

type FileSegmentProps =  ShareBaseFileItemProps & {
 
}

const ShareSegment = (props: FileSegmentProps) => {
    const { fileType, size, name,onClick, loading ,department} = props;

   

    return (
        <div
            className="bg-white rounded-2xl dark:bg-gray-800 border border-gray-200 dark:border-transparent py-4 px-3.5 flex items-center justify-between gap-2 transition-all hover:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)] cursor-pointer"
            role="button"
            onClick={onClick}
        >
            {loading ? (
                <MediaSkeleton
                    avatarProps={{
                        width: 33,
                        height: 33,
                    }}
                />
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <div className="text-3xl">
                            <FileIcon type={fileType || ''} />
                        </div>
                        <div>
                            <div className="font-bold heading-text">{name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                           {department || 'N/A'}
                        </div>
                            <span className="text-xs">
                                {fileSizeUnit(size || 0)}
                            </span>
                            
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};

export default ShareSegment;
