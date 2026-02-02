const MS = 1000;
const MIN = 60 * MS;

export type QueryKey = 'wallets' | 'exchangeRates' | 'exchangeHistory';

export const queryOptionByKey = {
  wallets: {
    gcTime: 5 * MIN,
    refetchInterval: 1 * MIN,
  },
  exchangeRates: {
    gcTime: 1 * MIN,
    refetchInterval: 1 * MIN,
  },
  exchangeHistory: {
    gcTime: 5 * MS,
  },
};

export const defaultOptions = {
  gcTime: 1 * MIN,
  refetchInterval: 1 * MIN,
};

export function getQueryOptions(queryKey: QueryKey) {
  return queryOptionByKey[queryKey] ?? defaultOptions;
}
