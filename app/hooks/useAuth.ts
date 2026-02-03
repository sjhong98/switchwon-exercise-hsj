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
    },
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
            setCookie('accessToken', res.data.data.token, {
                path: '/',
                secure: true,
                sameSite: 'strict',
            })
            return res;
        } catch (error) {
            console.error(error)
            errorToast('로그인에 실패했습니다. 다시 시도해주세요.')
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
            console.error(error)
            errorToast('세션 확인에 실패했습니다. 다시 시도해주세요.')
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
