
//Ek horizontal navigation menu jo dropdowns aur direct links support karta hai.

import HorizontalMenuDropdownTrigger from './HorizontalMenuDropdownTrigger'
import HorizontalMenuDropdown from './HorizontalMenuDropdown'
import HorizontalMenuDropdownContent from './HorizontalMenuDropdownContent'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import useMenuActive from '@/utils/hooks/useMenuActive'
import { TbChevronDown } from 'react-icons/tb'
import type { NavigationTree } from '@/@types/navigation'

type HorizontalMenuContentProps = {
    routeKey: string
    navigationTree?: NavigationTree[]
    translationSetup?: boolean
    userAuthority: string[]
}

const HorizontalMenuContent = (props: HorizontalMenuContentProps) => {
    const {
        routeKey,
        navigationTree = [],
        userAuthority,
    } = props

    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    return (
        <div className="flex gap-1">
            {navigationTree.map((nav) => (
                <AuthorityCheck
                    key={nav.key}
                    userAuthority={userAuthority}
                    authority={nav.authority}
                >
                    {nav.subMenu.length > 0 ? (
                        <HorizontalMenuDropdown
                            dropdownLean={
                                nav.meta?.horizontalMenu?.layout === 'default'
                            }
                            triggerContent={({ ref, props }) => (
                                <HorizontalMenuDropdownTrigger
                                    ref={ref}
                                    {...props}
                                    asElement="button"
                                >
                                    <div className="flex items-center gap-1">
                                        <span>
                                            { nav.title}
                                        </span>
                                        <TbChevronDown />
                                    </div>
                                </HorizontalMenuDropdownTrigger>
                            )}
                            menuContent={({ styles, handleDropdownClose }) => (
                                <HorizontalMenuDropdownContent
                                    style={styles}
                                    navigationTree={nav.subMenu}
                                    layoutMeta={nav?.meta?.horizontalMenu}
                                    routeKey={routeKey}
                                    routeParentKey={activedRoute?.parentKey}
                                    userAuthority={userAuthority}
                                    onDropdownClose={handleDropdownClose}
                                />
                            )}
                        ></HorizontalMenuDropdown>
                    ) : (
                        <HorizontalMenuDropdownTrigger
                            {...props}
                            path={nav.path}
                            isExternalLink={nav.isExternalLink}
                            active={activedRoute?.key === nav.key}
                            asElement="a"
                        >
                            <div className="flex items-center gap-1">
                                <span>{ nav.title}</span>
                            </div>
                        </HorizontalMenuDropdownTrigger>
                    )}
                </AuthorityCheck>
            ))}
        </div>
    )
}

export default HorizontalMenuContent
