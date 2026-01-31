import ExchangeTitle from "@/app/components/exchange/common/Title";
import TransactionsPanel from "@/app/components/exchange/transactions/Panel";

export default function TransactionsPageComponent() {
    return (
        <div className='flex flex-col w-full h-full gap-8'>
            <ExchangeTitle title="환전 내역" description="환전 내역을 확인하실 수 있어요." />
            <TransactionsPanel />
        </div>
    )
}