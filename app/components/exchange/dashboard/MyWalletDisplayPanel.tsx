import Container from "@/app/components/common/container";
import { CurrencySymbol } from "@/app/enums/currencyEnum";
import useWallet from "@/app/hooks/useWallet";
import formatNumber from "@/app/lib/formatNumber";
import { Wallet } from "@/app/types/Wallet";
import P from "@/app/components/common/P";

export default function MyWalletDisplay() {
    const { walletData, walletLoading, walletError } = useWallet();

    return walletData && (
        <Container className="flex flex-col gap-8 items-start w-full min-h-[400px] overflow-hidden">
            <p className="text-xl font-bold">내 지갑</p>
            <div className="flex flex-col w-full gap-2">
                {
                    walletData.wallets.map((wallet: Wallet) => (
                        <div key={wallet.walletId} className="flex w-full justify-between items-center gap-2">
                            <p className="text-md font-semibold text-gray-500">{wallet.currency}</p>
                            <div className="flex items-center gap-1 overflow-hidden">
                                <p className="text-md font-semibold text-gray-500">{CurrencySymbol[wallet.currency]}</p>
                                <P className="text-md font-semibold text-gray-500">{formatNumber(wallet.balance, 3, 3)}</P>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="flex justify-between items-center mt-auto w-full border-t border-gray-300 pt-4">
                <P>총 보유 자산</P>
                <P className="text-md font-bold text-main-blue">₩ {formatNumber(walletData.totalKrwBalance, 0, 0)}</P>
            </div>
        </Container>
    )
}