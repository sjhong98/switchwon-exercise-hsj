'use client'

import { useCallback, useMemo } from "react";
import Container from "../../common/container";
import useExchange from "@/app/hooks/useExchange";
import { ExchangeHistory } from "@/app/types/Exchange";
import { CurrencySymbol } from "@/app/enums/currencyEnum";
import formatNumber from "@/app/lib/formatNumber";
import P from "@/app/components/common/P";

// todo:
// infinite scroll

export default function ExchangeHistoryPanel() {
    const { exchangeHistoryData, exchangeHistoryLoading, exchangeHistoryError } = useExchange();

    const tableRow = useCallback((args: ExchangeHistory, isHeader: boolean = false) => {
        return (
            <div key={args.orderId} className={`flex w-full px-8 py-4 hover:bg-gray-50 duration-100`}>
                <P className="w-full">{args.orderId}</P>
                <P className="w-full">{(args.orderedAt).replace('T', ' ')}</P>
                <P className="w-full text-right">{`${formatNumber(args.toAmount)} ${args.toCurrency}`}</P>
                <P className="w-full text-right">{`${formatNumber(args.appliedRate)} KRW`}</P>
                <P className="w-full text-right">{`${formatNumber(args.fromAmount)} ${args.fromCurrency}`}</P>
            </div>
        )

    }, [])

    return exchangeHistoryData && (
        <Container className="!px-0 text-sm text-gray-600" backgroundColor="transparent">
            <div className="flex w-full h-full gap-4 border-b border-t border-gray-200">
                <div className={`flex w-full px-8 py-4`}>
                    <P className="w-full">거래 ID</P>
                    <P className="w-full">거래 일시</P>
                    <P className="w-full text-right">매수 금액</P>
                    <P className="w-full text-right">체결 환율</P>
                    <P className="w-full text-right">매도 금액</P>
                </div>
            </div>
            {(exchangeHistoryData.length === 0) ? (
                <div className="flex w-full h-40 justify-center items-center">
                    <P className="text-gray-500">환전 내역이 없습니다.</P>
                </div>
            ) : (
                <div className="flex flex-col w-full h-full border-gray-200 whitespace-nowrap">
                    {exchangeHistoryData.map((exchangeHistory) => tableRow(exchangeHistory))}
                </div>
            )}
        </Container>
    )
}