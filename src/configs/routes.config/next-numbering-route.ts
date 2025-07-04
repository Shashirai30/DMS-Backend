import { NextNumbering } from './../../@types/next-numbering';
import { lazy } from "react"
import { CONCEPTS_PREFIX_PATH } from "@/constants/route.constant"
import { ADMIN } from "@/constants/roles.constant"
import type { Routes } from "@/@types/routes"

const nextNumberingRoute: Routes = [
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

export default nextNumberingRoute
