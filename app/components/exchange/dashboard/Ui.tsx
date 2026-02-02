import CurrencyDisplayPanel from "@/app/components/exchange/dashboard/CurrencyDisplayPanel";
import MyWalletDisplayPanel from "@/app/components/exchange/dashboard/MyWalletDisplayPanel";
import ExchangePanel from "@/app/components/exchange/dashboard/ExchangePanel";

export default function ExchangeDashboard() {
    return (
        <div className="flex gap-4 w-full">
            <div className='flex flex-col w-full gap-4 flex-[1]'>
                <CurrencyDisplayPanel />
                <MyWalletDisplayPanel />
            </div>
            <div className='flex flex-col w-full gap-4 flex-[1]'>
                <ExchangePanel />
            </div>
        </div>
    )
}