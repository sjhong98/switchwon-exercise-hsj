interface PProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    className?: string;
    element?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export default function P(props: PProps) {    
    const { children, className, element: Element = 'p', ...rest } = props;

    return (
        <Element className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${className}`} {...rest}>{children}</Element>
    )
}
