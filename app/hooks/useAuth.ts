'use client'

import { useCookies } from "react-cookie";
import { errorToast } from "../lib/toast";
import useApi from "./useApi";

interface LoginResponse {
    data: {
        data: {
            memberId: string;
            token: string;
        }
    }
}

export default function useAuth() {
    const { api } = useApi();
    
    const [, setCookie, removeCookie] = useCookies(['accessToken']);

    const signIn = async (email: string) => {
        try {
            const res: LoginResponse = await api({
                url: `/auth/login?${new URLSearchParams({ email }).toString()}`,
                method: 'POST',
                body: {}
            })
            setCookie('accessToken', res.data.data.token)
            return res;
        } catch (error) {
            errorToast(error as string)
            throw error;
        }
    }

    const checkSession = async () => {
        try {
            const res = await api({
                url: '/wallets',
                method: 'GET',
            })

            return Boolean(res.status === 200)
        } catch (error) {
            errorToast(error as string)
            throw error;
        }
    }
    
    const signOut = async () => {
        removeCookie('accessToken')
    }

    return {
        signIn,
        checkSession,
        signOut
    }
}
