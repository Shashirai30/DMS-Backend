type PersonalInfo = {
    location: string
    title: string
    birthday: string
    phoneNumber: string
    dialCode: string
    address: string
    postcode: string
    city: string
    country: string
    facebook: string
    twitter: string
    pinterest: string
    linkedIn: string
}

type OrderHistory = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

interface PageInfo {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
    
  }
  

export type GetCustomersListResponse = {
    list: User[]
   total: number
   
}
export type GetUserListResponse = {
    data: GetUserListResponse | PromiseLike<GetUserListResponse>
    content: User[];
    page: PageInfo;
    message: string;
    status: number;
}

// export type Filter = {
//     purchasedProducts: string
//     purchaseChannel: Array<string>
// }

export type Customer = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    role: string
    lastOnline: number
    status: string
    personalInfo: PersonalInfo
    orderHistory: OrderHistory[]
    totalSpending: number
}
export type User = {
    id: string
    email: string
    empCode: string
    firstName: string
    image: string
    lastName: string
    phoneNumber: string
    roles: string[]
    status: string
}
