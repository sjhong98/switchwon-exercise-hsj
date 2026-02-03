'use client'

import Image from "next/image";
import Button from "../components/common/Button";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
            <Image src="/assets/logo.svg" alt="logo" width={100} height={100} />
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-light">존재하지 않는 페이지입니다.</h1>
                <Button onClick={() => router.push('/exchange')} color="main" size="md">
                    돌아가기
                </Button>
            </div>
        </div>
    )
}