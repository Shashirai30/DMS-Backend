import type { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    id?: string
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    page?: number
    size?: number
    sortBy?:string | number
    sortDir?:string | number
    search?: string
    
    // sortBy?: {
    //     order: 'asc' | 'desc' | ''
    //     key: string | number
    // }
}

