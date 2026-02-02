import { useQuery } from "@tanstack/react-query";
import { ExchangeRateResponse } from "../types/ExchangeRate";
import useApi from "./useApi";
import { getQueryOptions } from "../config/queryConfig";

export default function useExchangeRate() {
    const { api } = useApi();

    const getExchangeRates = async () => {
        const res: ExchangeRateResponse = await api({
            url: '/exchange-rates/latest',
            method: 'GET',
        });
        return res;
    }

    const getExchangeRateQuery = useQuery({
        queryKey: ['getExchangeRates'],
        queryFn: async () => await getExchangeRates(),
        enabled: true,
        ...getQueryOptions('exchangeRates'),
        select: (data: ExchangeRateResponse) => {
            return data.data.data;
        }
    })

    const {
        data: exchangeRateData,
        isLoading: exchangeRateLoading,
        error: exchangeRateError,
        refetch: refetchExchangeRate,
    } = getExchangeRateQuery;

    return {
        exchangeRateData,
        exchangeRateLoading,
        exchangeRateError,
        refetchExchangeRate
    }
}