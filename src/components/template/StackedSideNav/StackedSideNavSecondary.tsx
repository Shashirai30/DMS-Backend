import ScrollBar from '@/components/ui/ScrollBar'
import classNames from '@/utils/classNames'
import { HEADER_HEIGHT, } from '@/constants/theme.constant'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import type { NavigationTree } from '@/@types/navigation'

type StackedSideNavSecondaryProps = {
    className?: string
    title: string
    menu?: NavigationTree[]
    routeKey: string
    onCollapse: () => void
    userAuthority: string[]
}

const StackedSideNavSecondary = (props: StackedSideNavSecondaryProps) => {
    const {
        className,
        title,
        menu,
        routeKey,
        onCollapse,
        userAuthority,
        ...rest
    } = props

    const handleCollpase = () => {
        onCollapse()
    }

    return (
        <div className={classNames('h-full', className)} {...rest}>
            <div
                className={`flex items-center justify-between gap-4 pl-6 pr-4`}
                style={{ height: HEADER_HEIGHT }}
            >
                <h5 className="font-bold">{title}</h5>
                <button
                    type="button"
                    className="close-button"
                    onClick={handleCollpase}
                >
                  
                </button>
            </div>
            <ScrollBar autoHide >
                <VerticalMenuContent
                    routeKey={routeKey}
                    navigationTree={menu}
                    userAuthority={userAuthority}
                />
            </ScrollBar>
        </div>
    )
}

export default StackedSideNavSecondary
