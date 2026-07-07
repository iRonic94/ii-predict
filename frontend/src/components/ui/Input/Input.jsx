function Input({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    error = '',
}) {
    return (
        <div className="input-group">
            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                </label>
            )}

            <input
                id={name}
                className={`input ${error ? 'input--error' : ''}`}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />

            {error && (
                <span className="input-error">
                    {error}
                </span>
            )}
        </div>
    );
}

export default Input;