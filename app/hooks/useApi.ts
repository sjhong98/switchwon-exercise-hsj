import { useCookies } from "react-cookie";
import { errorToast } from "../lib/toast";

interface UseApiProps {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
}

export default function useApi() {
    const [cookies] = useCookies(['accessToken']);

    const api = async <T>(args: UseApiProps): Promise<ApiResponse<T>> => {
        const { url, method, body } = args;

        try {
            console.log('access token', cookies?.accessToken)
            
            const res = await fetch(`/api/proxy?url=${url}`, {
                method,
                body: body ? JSON.stringify(body) : undefined,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.accessToken ?? ''}`,
                },
            });

            const result = await res.json();

            if(res.status !== 200) {
                errorToast(result.message)
            }

            return {
                data: result as T,
                status: res.status,
            }
        } catch (error) {
            errorToast(error as string)
            console.error('API Error: ', error);
            throw error;
        }   
    }

    return {
        api
    }
}