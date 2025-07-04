import { useState, useEffect, Fragment } from "react";
import Menu from "@/components/ui/Menu";
import VerticalSingleMenuItem from "./VerticalSingleMenuItem";
import VerticalCollapsedMenuItem from "./VerticalCollapsedMenuItem";
import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import useMenuActive from "@/utils/hooks/useMenuActive";
import type { NavigationTree } from "@/@types/navigation";

export interface VerticalMenuContentProps {
  collapsed?: boolean;
  routeKey: string;
  navigationTree?: NavigationTree[];
  onMenuItemClick?: () => void;
  userAuthority: string[];
}

const { MenuGroup } = Menu;

const VerticalMenuContent = (props: VerticalMenuContentProps) => {
  const {
    collapsed,
    routeKey,
    navigationTree = [],
    onMenuItemClick,
    userAuthority,
  } = props;

  const [defaulExpandKey, setDefaulExpandKey] = useState<string[]>([]);

  const { activedRoute } = useMenuActive(navigationTree, routeKey);

  useEffect(() => {
    if (defaulExpandKey.length === 0 && activedRoute?.parentKey) {
      setDefaulExpandKey([activedRoute?.parentKey]);
    }
  }, [activedRoute?.parentKey]);

  const handleLinkClick = () => {
    onMenuItemClick?.();
  };

  const renderNavigation = (
    navTree: NavigationTree[],
    cascade: number = 0,
    indent?: boolean
  ) => {
    const nextCascade = cascade + 1;

    return (
      <>
        {navTree.map((nav) => (
          <Fragment key={nav.key}>
            {nav.type === NAV_ITEM_TYPE_ITEM && (
              <VerticalSingleMenuItem
                key={nav.key}
                nav={nav}
                sideCollapsed={collapsed}
                indent={indent}
                renderAsIcon={cascade <= 0}
                showIcon={cascade <= 0}
                userAuthority={userAuthority}
                showTitle={collapsed ? cascade >= 1 : cascade <= 1}
                onLinkClick={handleLinkClick}
              />
            )}
            {nav.type === NAV_ITEM_TYPE_COLLAPSE && (
              <VerticalCollapsedMenuItem
                key={nav.key}
                nav={nav}
                sideCollapsed={collapsed}
                indent={nextCascade >= 2}
                dotIndent={nextCascade >= 2}
                renderAsIcon={nextCascade <= 1}
                userAuthority={userAuthority}
                onLinkClick={onMenuItemClick}
              >
                {nav.subMenu &&
                  nav.subMenu.length > 0 &&
                  renderNavigation(nav.subMenu, nextCascade, true)}
              </VerticalCollapsedMenuItem>
            )}
            {nav.type === NAV_ITEM_TYPE_TITLE && (
              <MenuGroup
                key={nav.key}
                label={nav.title}
                userAuthority={userAuthority}
                requiredRoles={nav.authority}
              >
                {nav.subMenu &&
                  nav.subMenu.length > 0 &&
                  renderNavigation(nav.subMenu, cascade, false)}
              </MenuGroup>
            )}
          </Fragment>
        ))}
      </>
    );
  };

  return (
    <Menu
      className="px-4 pb-4"
      sideCollapsed={collapsed}
      defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
      defaultExpandedKeys={defaulExpandKey}
      defaultCollapseActiveKeys={
        activedRoute?.parentKey ? [activedRoute.parentKey] : []
      }
    >
      {renderNavigation(navigationTree, 0)}
    </Menu>
  );
};

export default VerticalMenuContent;
