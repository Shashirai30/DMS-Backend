import classNames from 'classnames'
import Segment from '@/components/ui/Segment'
import { useThemeStore } from '@/store/themeStore'
import {
    LAYOUT_COLLAPSIBLE_SIDE,
    LAYOUT_FRAMELESS_SIDE,
    LAYOUT_BLANK,
} from '@/constants/theme.constant'
import CollapsibleSideSvg from '@/assets/svg/CollapsibleSideSvg'
import FrameLessSideSvg from '@/assets/svg/FrameLessSideSvg'
import BlankSvg from '@/assets/svg/BlankSvg'
import type { LayoutType } from '@/@types/theme'

const layouts = [
    {
        value: LAYOUT_COLLAPSIBLE_SIDE,
        label: 'Collapsible',
        src: '/img/thumbs/layouts/classic.jpg',
        srcDark: '/img/thumbs/layouts/classic-dark.jpg',
        svg: <CollapsibleSideSvg height={'100%'} width={'100%'} />,
    },
   
    {
        value: LAYOUT_FRAMELESS_SIDE,
        label: 'Frameless',
        src: '/img/thumbs/layouts/simple.jpg',
        srcDark: '/img/thumbs/layouts/simple-dark.jpg',
        svg: <FrameLessSideSvg height={'100%'} width={'100%'} />,
    },
   
    {
        value: LAYOUT_BLANK,
        label: 'Blank',
        src: '/img/thumbs/layouts/blank.jpg',
        srcDark: '/img/thumbs/layouts/blank-dark.jpg',
        svg: <BlankSvg height={'100%'} width={'100%'} />,
    },
]

const LayoutSwitcher = () => {
    const themeLayout = useThemeStore((state) => state.layout)
    const setLayout = useThemeStore((state) => state.setLayout)

    return (
        <div>
            <Segment
                className="w-full bg-transparent dark:bg-transparent p-0"
                value={[]}
                onChange={(val) => setLayout(val as LayoutType)}
            >
                <div className="grid grid-cols-3 gap-4 w-full">
                    {layouts.map((layout) => (
                        <Segment.Item key={layout.value} value={layout.value}>
                            {({ onSegmentItemClick }) => {
                                const active = themeLayout.type === layout.value
                                return (
                                    <div className="text-center">
                                        <button
                                            className={classNames(
                                                'border-2 rounded-xl overflow-hidden',
                                                active
                                                    ? 'border-primary dark:border-primary'
                                                    : 'border-gray-200 dark:border-gray-700',
                                            )}
                                            onClick={onSegmentItemClick}
                                        >
                                            {layout.svg}
                                        </button>
                                        <div className="mt-2 font-semibold">
                                            {layout.label}
                                        </div>
                                    </div>
                                )
                            }}
                        </Segment.Item>
                    ))}
                </div>
            </Segment>
        </div>
    )
}

export default LayoutSwitcher
