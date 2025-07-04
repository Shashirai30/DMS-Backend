

export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    token: string  // Changed from token to accessToken
    refreshToken?: string
    user: {
        empCode: string
        name: string
        roles: string[]
        avatar?: string
        email: string

    };

}

export type ForgotPassword = {
    email: string
}

export interface ResetPassword {
    message?: string
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}


export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = {
    status: AuthRequestStatus;
    message: string;
    data?: SignInResponse;
};

export type User =  AuthResult &{
    id?: string
    empCode: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    roles: string[]
    image?: string
    lastLogin?: Date
}

export type Token = {
    accessToken: string
    refreshToken?: string
    expiresIn?: number
}



// Optional: Add JSDoc comments for better documentation
export type AuthConfig = {
    tokenStorage?: 'localStorage' | 'sessionStorage' | 'cookie'
    refreshTokenStrategy?: 'rotate' | 'reuse'
}