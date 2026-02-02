import { useCallback } from "react";
import { GetOrderProps, GetQuoteProps, OrderResponse, QuoteResponse, ExchangeHistoryResponse } from "../types/Exchange";
import useApi from "./useApi";
import { useQuery } from "@tanstack/react-query";
import { getQueryOptions } from "../config/queryConfig";

export default function useExchange() {
    const { api } = useApi();

    const order = useCallback(async (body: GetOrderProps) => {
        const res: OrderResponse = await api({
            url: `/orders`,
            method: 'POST',
            body,
        })
        return res.data.data;
    }, [api])

    const getQuote = useCallback(async (params: GetQuoteProps) => {
        if (params.forexAmount === 0) return;

        const res: QuoteResponse = await api({
            url: `/orders/quote&${new URLSearchParams({
                fromCurrency: params.fromCurrency,
                toCurrency: params.toCurrency,
                forexAmount: params.forexAmount.toString(),
            }).toString()}`,
            method: 'GET',
        })

        return res?.data?.data;
    }, [api])

    const getExchangeHistory = useCallback(async () => {
        const res: ExchangeHistoryResponse = await api({
            url: '/orders',
            method: 'GET',
        })
        return res.data.data;
    }, [api])

    const getExchangeHistoryQuery = useQuery({
        queryKey: ['exchangeHistory'],
        queryFn: async () => await getExchangeHistory(),
        enabled: true,
        ...getQueryOptions('exchangeHistory'),
    })

    const {
        data: exchangeHistoryData,
        isLoading: exchangeHistoryLoading,
        error: exchangeHistoryError,
    } = getExchangeHistoryQuery;

    return {
        order,
        getQuote,
        exchangeHistoryData,
        exchangeHistoryLoading,
        exchangeHistoryError,
    }
}