'use client'

import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Container from "@/app/components/common/container";
import useAuth from "@/app/hooks/useAuth";
import { errorToast } from "@/app/lib/toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function LoginPageComponent() {
    const { signIn } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');

    const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await signIn(email)
            router.push('/exchange')
        } catch (error) {
            errorToast('로그인에 실패했습니다. 다시 시도해주세요.')
            console.error(error)
        }
    }, [email])

    return (
        <div className='flex flex-col justify-center items-center h-screen gap-10'>
            <div className='flex flex-col justify-center items-center gap-4'>
                <Image src="/assets/logo.svg" alt="로고" width={80} height={80} />
                <h1 className='text-4xl font-bold text-center text-gray-600'>반갑습니다.</h1>
                <h2 className='text-2xl font-light text-center text-gray-500'>로그인 정보를 입력해 주세요.</h2>
            </div>
            <Container className="justify-center items-center min-w-[500px]">
                <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
                    <Input label="이메일 주소를 입력해 주세요." id="email" autoComplete="off" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button type="submit" className="w-full">로그인</Button>
                </form>
            </Container>
        </div>
    )
}