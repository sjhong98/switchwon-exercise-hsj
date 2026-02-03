import { useCallback, useMemo } from "react";

interface TabItemProps {
    label: string;
    value: string;
    color: string;
}

interface TabProps {
    tabs: TabItemProps[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Tab(props: TabProps) {
    const { tabs, activeTab, onTabChange } = props;

    const selectedTab = useMemo(() => {
        return tabs.find((tab) => tab.value === activeTab);
    }, [tabs, activeTab])

    return (
        <div id='tab-track' className='flex items-center gap-2 p-2 border-1 border-gray-200 rounded-[10px] relative select-none'>
            <div id='tab-list' className='flex w-full'>
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        className='w-full p-2 rounded-[16px] bg-gray-200 bg-transparent cursor-pointer '
                        style={{ color: tab.color }}
                        onClick={() => onTabChange(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div
                id='tab-indicator'
                className='absolute h-full bottom-0 p-2 duration-200'
                style={{
                    left: `${100 / tabs.length * tabs.findIndex((tab) => tab.value === activeTab)}%`,
                    width: `${100 / tabs.length}%`
                }}
            >
                <div
                    className='flex items-center justify-center w-full h-full rounded-md text-white duration-300'
                    style={{ 
                        backgroundColor: selectedTab?.color
                    }}
                >
                    <p>{selectedTab?.label}</p>
                </div>
            </div>
        </div>
    )
}