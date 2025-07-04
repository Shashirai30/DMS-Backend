import { lazy } from "react"
import { CONCEPTS_PREFIX_PATH } from "@/constants/route.constant"
import { ADMIN, USER } from "@/constants/roles.constant"
import type { Routes } from "@/@types/routes"

const conceptsRoute: Routes = [
  {
    key: "concepts.customers.customerList",
    path: `${CONCEPTS_PREFIX_PATH}/customers/customer-list`,
    component: lazy(() => import("@/views/concepts/customers/CustomerList")),
    authority: [ADMIN, USER],
  },
  {
    key: "concepts.customers.customerEdit",
    path: `${CONCEPTS_PREFIX_PATH}/customers/customer-edit/:id`,
    component: lazy(() => import("@/views/concepts/customers/CustomerEdit")),
    authority: [ADMIN, USER],
    meta: {
      header: {
        title: "Edit customer",
        description: "Manage customer details, purchase history, and preferences.",
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: "concepts.customers.customerCreate",
    path: `${CONCEPTS_PREFIX_PATH}/customers/customer-create`,
    component: lazy(() => import("@/views/concepts/customers/CustomerCreate")),
    authority: [ADMIN],
    meta: {
      header: {
        title: "Create customer",
        description: "Manage customer details, track purchases, and update preferences easily.",
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: "concepts.customers.customerDetails",
    path: `${CONCEPTS_PREFIX_PATH}/customers/customer-details/:id`,
    component: lazy(() => import("@/views/concepts/customers/CustomerDetails")),
    authority: [ADMIN, USER],
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "concepts.account.settings",
    path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
    component: lazy(() => import("@/views/concepts/accounts/Settings")),
    authority: [ADMIN, USER],
    meta: {
      header: {
        title: "Settings",
      },
      pageContainerType: "contained",
    },
  },
  {
    key: "concepts.folderManager",
    path: `${CONCEPTS_PREFIX_PATH}/folder-manager`,
    component: lazy(() => import("@/views/concepts/files/FolderManager")),
    authority: [ADMIN, USER],
    meta: {
      pageContainerType: "contained",
      pageBackgroundType: "plain",
    },
  },
  {
    key: "concepts.shared-Documents",
    path: `${CONCEPTS_PREFIX_PATH}/shared-Documents`,
    component: lazy(() => import("@/views/concepts/Shared-Document/sharesFiles")),
    authority: [ADMIN, USER],
    meta: {
      pageContainerType: "contained",
      pageBackgroundType: "plain",
    },
  },
  {
    key: "concepts.nextNumbering.list",
    path: `${CONCEPTS_PREFIX_PATH}/next-numbering`,
    component: lazy(() => import("@/views/concepts/nextNumbering/NextNumberingList")),
    authority: [ADMIN],
    meta: {
      header: {
        title: "Next Numbering",
        description: "Manage document numbering sequences for files and folders.",
        contained: true,
      },
      pageContainerType: "contained",
       pageBackgroundType: "plain",
    },
  },
  {
    key: "concepts.nextNumbering.create",
    path: `${CONCEPTS_PREFIX_PATH}/next-numbering/create`,
    component: lazy(() => import("@/views/concepts/nextNumbering/NextNumberingCreate")),
    authority: [ADMIN],
    meta: {
      header: {
        title: "Create Number Sequence",
        description: "Create a new document numbering sequence.",
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: "concepts.nextNumbering.edit",
    path: `${CONCEPTS_PREFIX_PATH}/next-numbering/edit/:id`,
    component: lazy(() => import("@/views/concepts/nextNumbering/NextNumberingEdit")),
    authority: [ADMIN],
    meta: {
      header: {
        title: "Edit Number Sequence",
        description: "Edit document numbering sequence configuration.",
        contained: true,
      },
      footer: false,
    },
  },
]

export default conceptsRoute
