import P from "@/app/components/common/P";

export default function ExchangeTitle({ title, description }: { title: string, description: string }) {
    return (
        <div className='flex flex-col w-full h-full gap-3'>
            <P element="h1" className='text-4xl font-bold'>{title}</P>
            <P element="h2" className='text-lg text-gray-700'>{description}</P>
        </div>
    )
}