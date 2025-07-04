import { useContext } from 'react'
import classNames from 'classnames'
import { GroupContextProvider } from './context/groupContext'
import MenuContext from './context/menuContext'
import useUniqueId from '../hooks/useUniqueId'
import type { CommonProps } from '../@types/common'
import type { ReactNode } from 'react'

export interface MenuGroupProps extends CommonProps {
    label: string | ReactNode
    children?: ReactNode
    userAuthority?: string[]
    requiredRoles?: string[] 
}

const MenuGroup = (props: MenuGroupProps) => {
    const { label, children, className, userAuthority, requiredRoles } = props
    const { sideCollapsed } = useContext(MenuContext)

    const menuGroupDefaultClass = 'menu-group'
    const menuGroupClass = classNames(menuGroupDefaultClass, className)

    const entityHeaderId = useUniqueId('entity-header-')
 // Function to check if user has required roles
 const hasAccess = requiredRoles
 ? requiredRoles.some((role) => userAuthority?.includes(role.toUpperCase()))
 : true // Default to true if no requiredRoles are provided

// Prevent rendering if user does not have access
if (!hasAccess) return null 
   return (
        <div className={menuGroupClass}>
            {label && !sideCollapsed && (
                <div className={classNames('menu-title')} id={entityHeaderId}>
                    {label}
                </div>
            )}
            <GroupContextProvider value={null}>
                <ul>{children}</ul>
            </GroupContextProvider>
        </div>
    )
}

MenuGroup.displayName = 'MenuGroup'

export default MenuGroup
