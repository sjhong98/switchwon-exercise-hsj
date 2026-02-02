import { useEffect, useRef, useState } from "react";
import Input, { InputProps } from "./Input";

interface SuffixInputProps extends InputProps {
    suffix: string;
}

export default function SuffixInput(props: SuffixInputProps) {
    const { label, suffix, className, ...rest } = props;

    const [suffixWidth, setSuffixWidth] = useState(0);

    const suffixRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        suffixRef.current?.clientWidth && setSuffixWidth(suffixRef.current?.clientWidth ?? 0);
    }, [suffix])

    return (
        <div id='suffix-input' className='flex flex-col w-full gap-2 relative'>
            <Input label={label} className={`text-right ${className} ${suffixWidth === 0 && 'text-transparent'}`} style={{ paddingRight: `${24 + (suffixRef.current?.clientWidth ?? 0)}px` }} {...rest} />
            <p ref={suffixRef} className='absolute z-[2] bottom-[20px] right-5 text-sm font-normal text-gray-500 text-right'>{suffix}</p>
        </div>
    )
}