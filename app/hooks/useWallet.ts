import { useQuery } from "@tanstack/react-query";
import useApi from "./useApi";
import { WalletResponse } from "../types/Wallet";
import { useCallback } from "react";
import { getQueryOptions } from "../config/queryConfig";

export default function useWallet() {
    const { api } = useApi();

    const getWallets = useCallback(async () => {
        const res: WalletResponse = await api({
            url: '/wallets',
            method: 'GET',
        });
        return res.data.data;
    }, [api])

    const getWalletQuery = useQuery({
        queryKey: ['wallets'],
        queryFn: async () => await getWallets(),
        enabled: true,
        ...getQueryOptions('wallets'),
    })

    const {
        data: walletData,
        isLoading: walletLoading,
        error: walletError,
        refetch: refetchWallet,
    } = getWalletQuery;

    return {
        walletData,
        walletLoading,
        walletError,
        refetchWallet,
    }
}