import { Currency } from "../types/Currency";

const normalizeCurrent = (amount: number | undefined, currency: Currency) => {
    if (!amount) return 0;
    return currency === 'JPY' ? amount / 100 : amount;
}

export default normalizeCurrent;