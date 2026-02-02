'use client'

import Button from "@/app/components/common/Button";
import useAuth from "@/app/hooks/useAuth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import P from "@/app/components/common/P";

export default function ExchangeHeader() {
    const router = useRouter()
    const pathname = usePathname();
    const { signOut } = useAuth();

    const isExchangePage = pathname === '/exchange';
    const isHistoryPage = pathname === '/transactions';

    const handleSignOut = useCallback(() => {
        signOut()
        router.push('/login')
    }, [router, signOut])

    return (
        <div id='exchange-header' className='flex w-full h-[60px] items-center justify-between border-b-1 border-gray-200 px-12'>
            {/* Logo */}
            <div className='flex items-center gap-2'>
                <Image src="/assets/logo.svg" alt="logo" width={30} height={30} />
                <P element="h1" className='text-2xl font-bold'>Exchange App</P>
            </div>

            <div className='flex items-center gap-16'>
                <div className='flex items-center gap-12 overflow-hidden'>
                    <a href="/exchange" className={`${isExchangePage ? 'text-sm font-bold' : 'text-sm text-gray-500'} min-w-0 overflow-hidden text-ellipsis whitespace-nowrap`}>환전 하기</a>
                    <a href="/transactions" className={`${isHistoryPage ? `text-sm font-bold` : `text-sm text-gray-500`} min-w-0 overflow-hidden text-ellipsis whitespace-nowrap`}>환전 내역</a>
                </div>
                <Button onClick={handleSignOut} size="sm" color="main" textClassName='text-[12px]'>
                    Log Out
                </Button>
            </div>
        </div>
    )
}