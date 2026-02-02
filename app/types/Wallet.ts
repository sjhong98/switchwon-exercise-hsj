import { CurrencyEnum } from "../enums/currencyEnum";

export interface Wallet {
    walletId: number;
    currency: typeof CurrencyEnum[keyof typeof CurrencyEnum];
    balance: number;
}

export interface WalletResponse {
    data: {
        data: {
            totalKrwBalance: number,
            wallets: Wallet[]
        }
    }
}