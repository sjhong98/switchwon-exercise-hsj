import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

interface DropdownProps {
    triggerComponent: ReactNode
    itemList: ReactNode[]
    onSelect?: (index: number) => void
}

export default function Dropdown(props: DropdownProps) {
    const { triggerComponent, itemList, onSelect } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false)

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [setIsOpen])

    const handleClose = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const handleSelect = useCallback((index: number) => {
        onSelect?.(index)
        handleClose()
    }, [onSelect, handleClose])

    const ArrowIcon = useMemo(() => {
        return (
            <svg width="10" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.69625 0.34125L0.34125 5.69625C-0.11375 6.15125 -0.11375 6.88625 0.34125 7.34125C0.79625 7.79625 1.53125 7.79625 1.98625 7.34125L6.52458 2.81458L11.0513 7.34125C11.5063 7.79625 12.2413 7.79625 12.6963 7.34125C13.1513 6.88625 13.1513 6.15125 12.6963 5.69625L7.34125 0.34125C6.89792 -0.11375 6.15125 -0.11375 5.69625 0.34125Z" fill="#36414C" />
            </svg>

        )
    }, [])

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                handleClose()
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, handleClose])

    return (
        <div ref={containerRef} className='relative select-none'>
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleToggle}>
                {triggerComponent}
                <div className={`${isOpen ? `` : 'rotate-180'} duration-300`}>
                    {ArrowIcon}
                </div>
            </div>
            <div
                className="flex flex-col absolute py-2 border border-gray-100 rounded-[16px] bg-white overflow-hidden duration-200 z-[9999]"
                style={{
                    height: isOpen ? `${itemList.length * (itemRef.current?.clientHeight ?? 40) + 16}px` : '0px',
                    opacity: isOpen ? 1 : 0
                }}
            >
                {
                    itemList.map((item, index) => (
                        <div key={index} ref={itemRef} className="flex items-center gap-2 px-4 py-2 cursor-pointer duration-200 hover:bg-gray-50" onClick={() => handleSelect(index)}>
                            {item}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}