export type View =
    | 'profile'
    | 'security'
   
export type CreditCard = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

export type CreditCardInfo = { cardId: string } & CreditCard

export type Integration = {
    id: string
    name: string
    desc: string
    img: string
    type: string
    active: boolean
    installed?: boolean
}

export type GetSettingsProfileResponse = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    location: string
    address: string
    postcode: string
    city: string
    country: string
    dialCode: string
    birthday: string
    phoneNumber: string
}

