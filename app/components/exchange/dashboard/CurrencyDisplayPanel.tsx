import Container from "@/app/components/common/container";
import { CurrencyName } from "@/app/enums/currencyEnum";
import useExchangeRate from "@/app/hooks/useExchangeRate";
import formatNumber from "@/app/lib/formatNumber";
import normalizeCurrent from "@/app/lib/normalizeCurrent";
import Image from "next/image";
import P from "@/app/components/common/P";

interface CurrencyDisplayProps {
    exchangeRateKrw: number;
    currencyCode: string;
    currencyName: string;
    changeRate: number;
}

function CurrencyDisplay(props: CurrencyDisplayProps) {
    const { exchangeRateKrw, currencyCode, currencyName, changeRate } = props;

    const isIncrease = changeRate > 0;
    const is0 = changeRate === 0;

    return (
        <Container backgroundColor="transparent" className='flex flex-col gap-2 items-start w-full overflow-hidden'>
            <div className="flex w-full justify-between items-center gap-2 overflow-hidden">
                <P className="text-md font-bold text-gray-500">{currencyCode}</P>
                <P className="text-sm font-light text-gray-500">{currencyName}</P>
            </div>
            <P className="text-2xl font-bold text-gray-900 w-full">{formatNumber(exchangeRateKrw)} KRW</P>
            <div className='flex items-center'>
                {!is0 && (isIncrease ? <Image src="/assets/upArrow.svg" alt="arrow-up" width={24} height={24} /> : <Image src="/assets/downArrow.svg" alt="arrow-down" width={24} height={24} />)}
                <P className={`text-md font-normal text-gray-500 mt-[-2px] ${isIncrease ? 'text-main-red' : 'text-main-blue'}`}>{formatNumber(changeRate, 1, 1)}%</P>
            </div>
        </Container>
    )
}

export default function CurrencyDisplayPanel() {
    const { exchangeRateData, exchangeRateLoading, exchangeRateError } = useExchangeRate();

    // TODO: 로딩 처리
    return exchangeRateData && (
        <div className='flex w-full gap-4'>
            {exchangeRateData[1] && (
                <CurrencyDisplay exchangeRateKrw={normalizeCurrent(exchangeRateData[1].rate, exchangeRateData[1].currency)} currencyCode={exchangeRateData[1].currency} currencyName={CurrencyName[exchangeRateData[1].currency]} changeRate={exchangeRateData[1].changePercentage} />
            )}
            {exchangeRateData[0] && (
                <CurrencyDisplay exchangeRateKrw={normalizeCurrent(exchangeRateData[0].rate, exchangeRateData[0].currency)} currencyCode={exchangeRateData[0].currency} currencyName={CurrencyName[exchangeRateData[0].currency]} changeRate={exchangeRateData[0].changePercentage} />
            )}
        </div>
    )
}