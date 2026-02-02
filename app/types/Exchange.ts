import { Currency } from "./Currency";

export interface GetQuoteProps {
    fromCurrency: Currency;
    toCurrency: Currency;
    forexAmount: number;
}

export interface Quote {
    krwAmount: number;
    appliedRate: number;
}

export interface QuoteResponse {
    status: number
    data: {
        data: Quote;
    }
}

export interface GetOrderProps {
    exchangeRateId: number;
    fromCurrency: Currency;
    toCurrency: Currency;
    forexAmount: number;
}

export interface OrderResponse {
    data: {
        data: string;
    }
}

export interface ExchangeHistory {
    orderId: number,
    fromCurrency: Currency,
    fromAmount: number,
    toCurrency: Currency,
    toAmount: number,
    appliedRate: number,
    orderedAt: string
}

export interface ExchangeHistoryResponse {
    data: {
        data: ExchangeHistory[]
    }
}