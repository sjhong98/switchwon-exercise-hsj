import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import Button from "@/app/components/common/Button";
import Container from "@/app/components/common/Container";
import Dropdown from "@/app/components/common/Dropdown";
import P from "@/app/components/common/P";
import SuffixInput from "@/app/components/common/SuffixInput";
import Tab from "@/app/components/common/Tab";
import { CurrencyEnum, CurrencyFlag, CurrencyName, CurrencySuffix } from "@/app/enums/currencyEnum";
import useExchange from "@/app/hooks/useExchange";
import useExchangeRate from "@/app/hooks/useExchangeRate";
import useWallet from "@/app/hooks/useWallet";
import formatNumber from "@/app/lib/formatNumber";
import normalizeCurrency from "@/app/lib/normalizeCurrency";
import parseNumber from "@/app/lib/parseNumber";
import { errorToast, successToast } from "@/app/lib/toast";
import { Currency } from "@/app/types/Currency";
import { Quote } from "@/app/types/Exchange";
import { ExchangeRate } from "@/app/types/ExchangeRate";

export default function ExchangePanel() {
    const { getQuote, order } = useExchange();
    const { exchangeRateData, refetchExchangeRate } = useExchangeRate();
    const { walletData, refetchWallet } = useWallet()

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
    const [inputAmount, setInputAmount] = useState<number>(0);
    const [isOrderStart, setIsOrderStart] = useState<boolean>(false);
    const [inputAmountError, setInputAmountError] = useState<string | undefined>(undefined);
    const [krwAmountError, setKrwAmountError] = useState<string | undefined>(undefined);
    const [quote, setQuote] = useState<Quote>({
        krwAmount: 0,
        appliedRate: 0,
    });

    const baseCurrency = 'KRW'
    const enabledExchangeCurrencyList = useMemo(() => Object.values(CurrencyEnum).filter((currency) => baseCurrency !== currency), [])
    const selectedCurrencyWallet = useMemo(() => walletData?.wallets.find((wallet) => wallet.currency === selectedCurrency), [selectedCurrency, walletData])
    const krwWallet = useMemo(() => walletData?.wallets.find((wallet) => wallet.currency === 'KRW'), [walletData])
    const selectedCurrencyExchangeRate: ExchangeRate | undefined = useMemo(() => exchangeRateData?.find((rate) => rate.currency === selectedCurrency), [selectedCurrency, exchangeRateData]);
    const isOrderDisabled = useMemo(() => isOrderStart || inputAmount === 0 || Boolean(inputAmountError) || Boolean(krwAmountError), [isOrderStart, inputAmount, inputAmountError, krwAmountError])

    // 통화 선택
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

    // 통화 선택 드롭다운 아이템 리스트
    const DropdownItemList = useMemo(() => {
        return enabledExchangeCurrencyList.map((currency) => (
            <div key={currency} className="flex items-center gap-2 cursor-pointer text-[12px] font-normal">
                <Image src={CurrencyFlag[currency]} alt={CurrencyName[currency]} width={16} height={16} />
                <div className="flex gap-1">
                    <p>{CurrencyName[currency]}</p>
                    <p>{currency}</p>
                </div>
            </div>
        ))
    }, [enabledExchangeCurrencyList])

    // 탭 변경 핸들러
    const handleTabChange = useCallback((tab: string) => {
        setInputAmountError(undefined)
        setKrwAmountError(undefined)
        setInputAmount(0)
        setQuote({
            krwAmount: 0,
            appliedRate: selectedCurrencyExchangeRate?.rate ?? 0,
        });
        setActiveTab(tab as 'buy' | 'sell')
    }, [])

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
            try {
                const quote = await getQuote({
                    fromCurrency: activeTab === 'buy' ? baseCurrency : selectedCurrency,
                    toCurrency: activeTab === 'buy' ? selectedCurrency : baseCurrency,
                    forexAmount: inputAmount,
                })

                if (quote) setQuote(quote);
            } catch (err) { }
        }, 200);
    }, [inputAmount])

    // 견적요청시 - 환율정보 다를 경우 갱신
    useEffect(() => {
        if (!selectedCurrencyExchangeRate || !quote?.appliedRate) return

        if (selectedCurrencyExchangeRate?.rate !== quote?.appliedRate) {
            console.log('견적요청시 - 환율정보 다를 경우 갱신')
            refetchExchangeRate()
        }
    }, [quote])

    // 환율정보 갱신시 - 견적 상 환율정보 다를 경우 갱신
    useEffect(() => {
        if (!selectedCurrencyExchangeRate || !quote?.appliedRate) return

        if (selectedCurrencyExchangeRate?.rate !== quote?.appliedRate) {
            console.log('환율정보 갱신시 - 견적 상 환율정보 다를 경우 갱신')
            getQuote({
                fromCurrency: activeTab === 'buy' ? baseCurrency : selectedCurrency,
                toCurrency: activeTab === 'buy' ? selectedCurrency : baseCurrency,
                forexAmount: inputAmount,
            }).then((quote) => {
                if (quote) setQuote(quote);
            }).catch((err) => { })
        }
    }, [exchangeRateData])

    // 주문 요청
    const handleOrder = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isOrderDisabled) return

        setIsOrderStart(true)

        const exchangeRateId = selectedCurrencyExchangeRate?.exchangeRateId;
        if (!exchangeRateId) {
            errorToast('환율 정보를 찾을 수 없습니다.');
            return
        }

        try {
            await order({
                exchangeRateId,
                fromCurrency: activeTab === 'buy' ? baseCurrency : selectedCurrency,
                toCurrency: activeTab === 'buy' ? selectedCurrency : baseCurrency,
                forexAmount: inputAmount,
            })
            refetchWallet()
            successToast('환전이 완료되었습니다.', false);
            setInputAmount(0)
            setQuote({
                ...quote,
                krwAmount: 0,
            });
        } catch (error) {
        } finally {
            setIsOrderStart(false)
        }
    }, [order, inputAmount, selectedCurrency, selectedCurrencyExchangeRate, quote, activeTab, refetchWallet, isOrderDisabled])

    // 탭, 통화 변경 시 초기화
    useEffect(() => {
        setInputAmount(0);
        setQuote({
            krwAmount: 0,
            appliedRate: selectedCurrencyExchangeRate?.rate ?? 0,
        });
    }, [activeTab, selectedCurrency])

    // 입력 금액 오류 체크
    useEffect(() => {
        if (!selectedCurrencyWallet || !krwWallet?.balance) return

        if (activeTab === 'buy') {
            quote.krwAmount > krwWallet?.balance ? setKrwAmountError('보유 자산 초과') : setKrwAmountError(undefined);
        } else {
            inputAmount > selectedCurrencyWallet.balance ? setInputAmountError('보유 자산 초과') : setInputAmountError(undefined);
        }
    }, [quote, inputAmount])

    return (
        <Container className="h-full">
            <form onSubmit={handleOrder} className="flex flex-col h-full gap-4">
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
                    onTabChange={handleTabChange}
                />
                <SuffixInput
                    id="input-amount"
                    label={activeTab === 'buy' ? "매수 금액" : "매도 금액"}
                    suffix={activeTab === 'buy' ? `${CurrencySuffix[selectedCurrency]} 사기` : `${CurrencySuffix[selectedCurrency]} 팔기`}
                    value={inputAmount.toLocaleString()}
                    onChange={(e) => setInputAmount(parseNumber(e, inputAmount))}
                    className='font-semibold'
                    errorMessage={inputAmountError}
                />
                <div className='flex justify-center w-full'>
                    <Image src="/assets/nextArrowCircle.svg" alt="next" width={24} height={24} />
                </div>
                <SuffixInput
                    id="krw-amount"
                    label="필요 원화"
                    suffix={activeTab === 'buy' ? "원 필요해요" : "원 받을 수 있어요"}
                    suffixClassName={`${activeTab === 'buy' ? 'text-main-red' : 'text-main-blue'} font-semibold`}
                    value={formatNumber(quote?.krwAmount, 0, 0)}
                    className="!bg-gray-100 !border-gray-300 font-semibold"
                    disabled
                    errorMessage={krwAmountError}
                />
                <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-300 overflow-hidden">
                    <P>적용 환율</P>
                    <P
                        className="text-md font-semibold text-gray-500"
                    >
                        {`1 ${selectedCurrency} = ${formatNumber(normalizeCurrency(Boolean(quote?.appliedRate) ? quote?.appliedRate : selectedCurrencyExchangeRate?.rate, selectedCurrency))} ${baseCurrency}`}
                    </P>
                </div>
                <Button type="submit" className="w-full" disabled={isOrderDisabled} textClassName="text-md font-semibold text-white">
                    환전하기
                </Button>
            </form>
        </Container >
    )
}   