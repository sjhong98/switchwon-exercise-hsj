import Button from "@/app/components/common/Button";
import Container from "@/app/components/common/container";
import Dropdown from "@/app/components/common/Dropdown";
import SuffixInput from "@/app/components/common/SuffixInput";
import Tab from "@/app/components/common/Tab";
import { CurrencyEnum, CurrencyFlag, CurrencyName, CurrencySuffix } from "@/app/enums/currencyEnum";
import useExchange from "@/app/hooks/useExchange";
import useExchangeRate from "@/app/hooks/useExchangeRate";
import useWallet from "@/app/hooks/useWallet";
import formatNumber from "@/app/lib/formatNumber";
import normalizeCurrent from "@/app/lib/normalizeCurrent";
import parseNumber from "@/app/lib/parseNumber";
import { errorToast, successToast } from "@/app/lib/toast";
import { Currency } from "@/app/types/Currency";
import { Quote } from "@/app/types/Exchange";
import { ExchangeRate } from "@/app/types/ExchangeRate";
import Image from "next/image";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import P from "@/app/components/common/P";

export default function ExchangePanel() {
    const { getQuote, order } = useExchange();
    const { exchangeRateData, refetchExchangeRate } = useExchangeRate();
    const { refetchWallet } = useWallet()

    const baseCurrency = 'KRW'
    const enabledExchangeCurrencyList = useMemo(() => Object.values(CurrencyEnum).filter((currency) => baseCurrency !== currency), [])

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
    const [inputAmount, setInputAmount] = useState<number>(0);
    const [quote, setQuote] = useState<Quote>({
        krwAmount: 0,
        appliedRate: 0,
    });
    const [isOrderStart, setIsOrderStart] = useState<boolean>(false);

    const selectedCurrencyExchangeRate: ExchangeRate | undefined = useMemo(() => exchangeRateData?.find((rate) => rate.currency === selectedCurrency), [selectedCurrency, exchangeRateData]);

    const SelectedCurrencyComponent = useMemo(() => {
        return (
            <div className='flex gap-1.5'>
                <Image src={CurrencyFlag[selectedCurrency]} alt={CurrencyName[selectedCurrency]} width={24} height={24} />
                <div className='flex gap-1 text-md font-semibold'>
                    <p>{selectedCurrency}</p>
                    <p>환전하기</p>
                </div>
            </div>
        )
    }, [selectedCurrency, enabledExchangeCurrencyList])

    const DropdownItemList = useMemo(() => {
        return enabledExchangeCurrencyList.map((currency) => (
            <div key={currency} className="flex items-center gap-2 cursor-pointer text-[12px] font-nornal">
                <Image src={CurrencyFlag[currency]} alt={CurrencyName[currency]} width={16} height={16} />
                <div className="flex gap-1">
                    <p>{CurrencyName[currency]}</p>
                    <p>{currency}</p>
                </div>
            </div>
        ))
    }, [enabledExchangeCurrencyList])

    // 견적 요청 debounce
    useEffect(() => {
        if (inputAmount === 0) {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            setQuote({
                krwAmount: 0,
                appliedRate: selectedCurrencyExchangeRate?.rate ?? 0,
            });
            return
        }

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        debounceTimerRef.current = setTimeout(async () => {
            const quote = await getQuote({
                fromCurrency: activeTab === 'buy' ? baseCurrency : selectedCurrency,
                toCurrency: activeTab === 'buy' ? selectedCurrency : baseCurrency,
                forexAmount: inputAmount,
            })

            if (quote) setQuote(quote);
        }, 200);
    }, [inputAmount])

    // 견적요청시 - 환율정보 다를 경우 갱신
    useEffect(() => {
        if (!selectedCurrencyExchangeRate || !quote?.appliedRate) return

        if (selectedCurrencyExchangeRate?.rate !== quote?.appliedRate) {
            refetchExchangeRate()
        }
    }, [quote])

    // 환율정보 갱신시 - 견적 상 환율정보 다를 경우 갱신
    useEffect(() => {
        if (!selectedCurrencyExchangeRate || !quote?.appliedRate) return

        if (selectedCurrencyExchangeRate?.rate !== quote?.appliedRate) {
            getQuote({
                fromCurrency: activeTab === 'buy' ? baseCurrency : selectedCurrency,
                toCurrency: activeTab === 'buy' ? selectedCurrency : baseCurrency,
                forexAmount: inputAmount,
            }).then((quote) => {
                if (quote) setQuote(quote);
            })
        }
    }, [exchangeRateData])

    // 주문 요청
    const handleOrder = useCallback(async () => {
        setIsOrderStart(true)

        const exchangeRateId = selectedCurrencyExchangeRate?.exchangeRateId;
        if (!exchangeRateId) {
            errorToast('환율 정보를 찾을 수 없습니다.');
            return
        }

        await order({
            exchangeRateId,
            fromCurrency: activeTab === 'buy' ? baseCurrency : selectedCurrency,
            toCurrency: activeTab === 'buy' ? selectedCurrency : baseCurrency,
            forexAmount: inputAmount,
        })

        setIsOrderStart(false)
        setInputAmount(0)
        setQuote({
            ...quote,
            krwAmount: 0,
        });
        refetchWallet()
        successToast('환전이 완료되었습니다.');
    }, [order, selectedCurrency, inputAmount, selectedCurrency, exchangeRateData, refetchWallet])

    // 탭, 통화 변경 시 초기화
    useEffect(() => {
        setInputAmount(0);
        setQuote({
            krwAmount: 0,
            appliedRate: selectedCurrencyExchangeRate?.rate ?? 0,
        });
    }, [activeTab, selectedCurrency])

    return (
        <Container className="flex flex-col gap-4 h-full">
            <Dropdown
                triggerComponent={SelectedCurrencyComponent}
                itemList={DropdownItemList as ReactNode[]}
                onSelect={(index) => setSelectedCurrency(enabledExchangeCurrencyList[index])}
            />
            <Tab
                tabs={[
                    { label: '살래요', value: 'buy', color: 'var(--color-main-red)' },
                    { label: '팔래요', value: 'sell', color: 'var(--color-main-blue)' },
                ]}
                activeTab={activeTab}
                onTabChange={(tab) => { setActiveTab(tab as 'buy' | 'sell') }}
            />
            <SuffixInput
                label={activeTab === 'buy' ? "매수 금액" : "매도 금액"}
                suffix={activeTab === 'buy' ? `${CurrencySuffix[selectedCurrency]} 사기` : `${CurrencySuffix[selectedCurrency]} 팔기`}
                value={inputAmount.toLocaleString()}
                onChange={(e) => setInputAmount(parseNumber(e, inputAmount))}
                className='font-semibold'
            />
            <div className='flex w-full justify-center'>
                <Image src="/assets/nextArrowCircle.svg" alt="next" width={24} height={24} />
            </div>
            <SuffixInput
                label="필요 원화"
                suffix={activeTab === 'buy' ? "원 필요해요" : "원 받을 수 있어요"}
                value={formatNumber(quote?.krwAmount, 0, 0)}
                className="!bg-gray-100 !border-gray-300 font-semibold"
                disabled
            />
            <div className="flex justify-between items-center mt-auto w-full border-t border-gray-300 pt-4 overflow-hidden">
                <P>적용 환율</P>
                <P
                    className="text-md font-semibold text-gray-500"
                >
                    {`1 ${selectedCurrency} = ${formatNumber(normalizeCurrent(Boolean(quote?.appliedRate) ? quote?.appliedRate : selectedCurrencyExchangeRate?.rate, selectedCurrency))} ${baseCurrency}`}
                </P>
            </div>
            <Button onClick={handleOrder} className="w-full" disabled={isOrderStart} textClassName="text-md font-semibold text-white">
                환전하기
            </Button>
        </Container>
    )
}   