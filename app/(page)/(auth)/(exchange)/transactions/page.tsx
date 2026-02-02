import ExchangeTitle from "@/app/components/exchange/common/Title";
import TransactionHistoryPanel from "@/app/components/exchange/historyPanel/Ui";

export default function ExchangeHistoryPageComponent() {
    return (
        <div className='flex flex-col w-full h-full gap-8'>
            <ExchangeTitle title="환전 내역" description="환전 내역을 확인하실 수 있어요." />
            <TransactionHistoryPanel />
        </div>
    )
}