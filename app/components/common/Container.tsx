export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    backgroundColor?: 'transparent' | 'filled';
}
export default function Container(props: ContainerProps) {
    const { className, backgroundColor = 'filled', children, ...rest } = props;
    const backgroundColorClassName = backgroundColor === 'transparent' ? 'bg-transparent' : 'bg-gray-50';

    return (
        <div className={`flex flex-col px-6 py-4 border border-gray-200 rounded-[16px] bg-gray-50 ${backgroundColorClassName} ${className}`} {...rest}>
            {children}
        </div>
    )
}