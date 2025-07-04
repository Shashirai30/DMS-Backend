import HorizontalMenuContent from './HorizontalMenuContent'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useSessionUser } from '@/store/authStore'
import useNavigationStore from '@/store/navigationStore'
import { useLayoutEffect } from 'react'
import { fetchMenuItems } from '@/utils/hooks/useNavigatonMenu'

const HorizontalNav = ({
    translationSetup = true,
}: {
    translationSetup?: boolean
}) => {
    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)
    const userAuthority = useSessionUser((state) => state.user.roles)
    const navigationConfig = useNavigationStore((state) => state.menuItems);

    useLayoutEffect(() => {
        if (navigationConfig.length === 0) {
            fetchMenuItems(); 
        }
    }, [navigationConfig.length]);


    return (
        <HorizontalMenuContent
            navigationTree={navigationConfig}
            routeKey={currentRouteKey}
            userAuthority={userAuthority || []}
            translationSetup={translationSetup}
        />
    )
}

export default HorizontalNav
