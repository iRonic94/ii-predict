import './Button.scss';

function Button({
    children,
    type = 'button',
    onClick,
    disabled = false,
    fullWidth = false,
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`button ${fullWidth ? 'button--full' : ''}`}
        >
            {children}
        </button>
    );
}

export default Button;