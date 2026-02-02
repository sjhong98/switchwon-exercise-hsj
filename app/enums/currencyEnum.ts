export const CurrencyEnum = {
    KRW: 'KRW',
    USD: 'USD',
    JPY: 'JPY',
} as const;

export const CurrencySymbol = {
    KRW: '₩',
    USD: '$',
    JPY: '¥',
} as const;

export const CurrencyName = {
    KRW: '대한민국 원',
    USD: '미국 달러',
    JPY: '일본 엔화',
} as const;

export const CurrencySuffix = {
    KRW: '원',
    USD: '달러',
    JPY: '엔',
}

export const CurrencyFlag = {
    KRW: '',
    USD: '/assets/flags/united-states.svg',
    JPY: '/assets/flags/japan.svg',
} as const;