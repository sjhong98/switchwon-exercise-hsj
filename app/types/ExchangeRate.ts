import { CurrencyEnum } from "../enums/currencyEnum";

export interface ExchangeRate {
    exchangeRateId: number;
    currency: typeof CurrencyEnum[keyof typeof CurrencyEnum];
    rate: number;
    changePercentage: number;
    applyDateTime: string;
}

export interface ExchangeRateResponse {
    data: {
        data: ExchangeRate[]
    }
}