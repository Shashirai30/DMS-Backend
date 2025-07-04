
import { createContext } from 'react';
import type {
    SignInCredential,
    AuthResult,
    User,
} from '@/@types/auth';

/**
 * Represents the authentication context.
 */
type Auth = {
    authenticated: boolean; // Whether the user is authenticated
    user: User; // The authenticated user's details
    signIn: (values: SignInCredential) => Promise<AuthResult>; // Function to sign in
    signOut: () => void; // Function to sign out
};

/**
 * A placeholder function for async operations.
 */
const defaultFunctionPlaceholder = async (): Promise<AuthResult> => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // Simulate async operation
    return {
        status: '',
        message: '',
    };
};

/**
 * The authentication context with default values.
 */
const initialUser: User = {
    empCode: '',
    name: '',
    email: '',
    roles: [],
};

const AuthContext = createContext<Auth>({
    authenticated: false, // Default to unauthenticated
    user:initialUser,// Default to an empty user object
    signIn: defaultFunctionPlaceholder, // Default sign-in function
    signOut: () => {

    }, // Default sign-out function
});

export default AuthContext;
