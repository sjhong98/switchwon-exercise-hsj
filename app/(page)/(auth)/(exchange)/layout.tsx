'use client'

import ExchangeHeader from "@/app/components/exchange/common/Header";
import useAuth from "@/app/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ExchangeLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname();
    const { checkSession } = useAuth();

    useEffect(() => {
        checkSession().catch(() => router.push('/login'))
    }, [pathname])

    return (
        <div className='flex flex-col min-h-screen'>
            <ExchangeHeader />
            <div className='flex flex-col w-full h-full px-20 py-12'>
                {children}
            </div>
        </div>
    )
}