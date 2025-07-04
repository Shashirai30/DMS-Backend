
import cookiesStorage from '@/utils/cookiesStorage';
import appConfig from '@/configs/app.config';
import { TOKEN_NAME_IN_STORAGE } from '@/constants/api.constant';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/@types/auth';

type Session = {
    signedIn: boolean;
};

type AuthState = {
    session: Session;
    user: User;
};

type AuthAction = {
    setSessionSignedIn: (payload: boolean) => void;
    setUser: (payload: User) => void;
};

const getPersistStorage = () => {
    if (appConfig.accessTokenPersistStrategy === 'localStorage') {
        return localStorage;
    }

    if (appConfig.accessTokenPersistStrategy === 'sessionStorage') {
        return sessionStorage;
    }

    return cookiesStorage;
};

const initialState: AuthState = {
    session: {
        signedIn: false,
    },
    user: {
        empCode: '',
        firstName: '',
        lastName:'',
        email: '',
        phoneNumber: '',
        roles: [],
        status: '',
        message: '',
    },
};

export const useSessionUser = create<AuthState & AuthAction>()(
    persist(
        (set) => ({
            ...initialState,
            setSessionSignedIn: (payload) => {
                console.log('Setting session signedIn to:', payload);
                set((state) => ({
                    session: {
                        ...state.session,
                        signedIn: payload,
                    },
                }));
            },
            setUser: (payload) => {
                console.log('Setting user data:', payload);
                set((state) => ({
                    user: {
                        ...state.user,
                        ...payload,
                    },
                }));
            },
        }),
        {
            name: 'sessionUser',
            storage: createJSONStorage(() => {
                return localStorage;
            }),
        }
    )
);

export const useToken = () => {
    const storage = getPersistStorage();

    const setToken = (token: string) => {
        storage.setItem(TOKEN_NAME_IN_STORAGE, token);
    };

    const token = storage.getItem(TOKEN_NAME_IN_STORAGE);

    return {
        setToken,
        token,
    };
};