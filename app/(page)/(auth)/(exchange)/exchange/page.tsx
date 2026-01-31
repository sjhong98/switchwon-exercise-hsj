'use client'

import ExchangeTitle from "@/app/components/exchange/common/Title"
import ExchangeDashboard from "@/app/components/exchange/exchange/Dashboard"

export default function ExchangePageComponent() {
    return (
        <div className='flex flex-col w-full h-full gap-8'>
            <ExchangeTitle title="환율 정보" description="실시간 환율을 확인하고 간편하게 환전하세요." />
            <ExchangeDashboard />
        </div>
    )
}