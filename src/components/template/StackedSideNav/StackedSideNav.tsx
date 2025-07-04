import { useLayoutEffect, useState } from 'react'
import {
    SPLITTED_SIDE_NAV_MINI_WIDTH,
    STACKED_SIDE_NAV_SECONDARY_WIDTH,

} from '@/constants/theme.constant'
import StackedSideNavMini, { SelectedMenuItem } from './StackedSideNavMini'
import StackedSideNavSecondary from './StackedSideNavSecondary'
import useResponsive from '@/utils/hooks/useResponsive'
import { useThemeStore } from '@/store/themeStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useSessionUser } from '@/store/authStore'
import isEmpty from 'lodash/isEmpty'
import useNavigationStore from '@/store/navigationStore'
import { fetchMenuItems } from '@/utils/hooks/useNavigatonMenu'

const stackedSideNavDefaultStyle = {
    width: SPLITTED_SIDE_NAV_MINI_WIDTH,
}

const StackedSideNav = () => {

    const [selectedMenu, setSelectedMenu] = useState<SelectedMenuItem>({})
    const [activeKeys, setActiveKeys] = useState<string[]>([])

    const mode = useThemeStore((state) => state.mode)

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.roles)
    const navigationConfig = useNavigationStore((state) => state.menuItems);

    useLayoutEffect(() => {
        if (navigationConfig.length === 0) {
            fetchMenuItems(); // Fetch menu items if not exists
        }
    }, [navigationConfig.length]);


    const { larger } = useResponsive()

    const navColor = (navType: string, mode: string) => {
        return `${navType}-${mode}`
    }

    const handleChange = (selected: SelectedMenuItem) => {
        setSelectedMenu(selected)
    }

    const handleCollpase = () => {
        setSelectedMenu({})
        setActiveKeys([])
    }

    const handleSetActiveKey = (key: string[]) => {
        setActiveKeys(key)
    }

   

    return (
        <>
            {larger.md && (
                <div className={`stacked-side-nav`}>
                    <StackedSideNavMini
                        className={`stacked-side-nav-mini ${navColor(
                            'stacked-side-nav-mini',
                            mode,
                        )}`}
                        style={stackedSideNavDefaultStyle}
                        routeKey={currentRouteKey}
                        activeKeys={activeKeys}
                        mode={mode}
                        navigationTree={navigationConfig}
                        userAuthority={userAuthority || []}
                        selectedMenu={selectedMenu}
                        onChange={handleChange}
                        onSetActiveKey={handleSetActiveKey}
                    />
                    <div
                        className={`stacked-side-nav-secondary ${navColor(
                            'stacked-side-nav-secondary',
                            mode,
                        )}`}
                        style={{
                            width: isEmpty(selectedMenu) ? 0 : STACKED_SIDE_NAV_SECONDARY_WIDTH,
                        }}
                    >
                         {!isEmpty(selectedMenu) && (
                            <StackedSideNavSecondary
                                title={selectedMenu.title as string}
                                menu={selectedMenu.menu}
                                routeKey={currentRouteKey}
                                userAuthority={userAuthority || []}
                                onCollapse={handleCollpase}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default StackedSideNav
