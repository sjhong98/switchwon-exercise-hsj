import { CurrencyEnum } from "../enums/currencyEnum";

export type Currency = typeof CurrencyEnum[keyof typeof CurrencyEnum];