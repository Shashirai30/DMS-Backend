import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    firstName: string
    lastName: string
    empCode: string
    email: string
    phoneNumber: string
    status: 'ACTIVE' | 'INACTIVE'
    password: string
    message?: string; 
    emailVerified?: boolean
    projectFileIds?: number[];
}

export type ProfileImageFields = {
    image?: string
}

export type RolesFields = {
    roles: string[]
}

export type AccountField = {
    banAccount?: boolean
    accountVerified?: boolean
}

export type DirectoryField = {
  projectFileIds?: number[];
}

export type CustomerFormSchema = OverviewFields &
    ProfileImageFields &
    RolesFields &
    AccountField &
    DirectoryField
   


export type FormSectionBaseProps = {
    newCustomer : boolean
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
}


export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  empCode: string;
  email: string;
  phoneNumber: string;
  status: string;
  image?: string;  // Optional
  roles: string[];
  password: string;
  emailVerified: boolean;
  projectFileIds: number[];
}
