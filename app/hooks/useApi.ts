'use client'

import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

import { errorToast } from "../lib/toast";

interface UseApiProps {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: object;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
}

export interface ApiError extends Error {
    data?: unknown;
    status?: number;
}

export default function useApi() {
    const router = useRouter()
    const [cookies] = useCookies(['accessToken']);

    const api = async <T>(args: UseApiProps): Promise<ApiResponse<T>> => {
        const { url, method, body } = args;

        try {
            const res = await fetch(`/api/proxy?url=${url}`, {
                method,
                body: body ? JSON.stringify(body) : undefined,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.accessToken ?? ''}`,
                },
            });

            let result = await res.json();

            if(!res.ok) {
                if (res.status === 401) router.push('/login')
                const errorMessage = Object.values(result?.data ?? {})?.[0] ?? result?.message ?? '요청 중 오류가 발생했습니다.'
                
                const err = new Error(errorMessage) as ApiError;
                err.status = res.status;
                err.data = result.data;
                throw err;
            }

            return {
                data: result as T,
                status: res.status,
            }
        } catch (error) {
            const err = error as ApiError;
            console.error(err)
            errorToast(err.message ?? '요청 중 오류가 발생했습니다.');
            throw err;
        }   
    }

    return {
        api
    }
}