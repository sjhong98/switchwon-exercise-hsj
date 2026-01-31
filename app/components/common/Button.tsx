interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'main';
}

export default function Button(props: ButtonProps) {
    const { children, onClick, className, size = 'md', color = 'primary', ...rest } = props;

    const padding = size === 'sm' ? 'px-3 py-1 rounded-[8px]' : size === 'md' ? 'px-6 py-4 rounded-[12.5px]' : 'px-8 py-6 rounded-[25px]';
    return (
        <button id='button' className={`text-white cursor-pointer ${padding} font-semibold active:scale-[0.97] active:brightness-95 transition-all duration-200 ${color === 'primary' ? 'bg-gray-900' : 'bg-main-blue'} ${className}`} onClick={onClick} {...rest}>
            {children}
        </button>
    );
}