import { useState } from 'react';

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

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';

    const inputType =
        isPassword && showPassword
            ? 'text'
            : type;

    return (
        <div className="input-group">

            {label && (
                <label
                    htmlFor={name}
                    className="input-label"
                >
                    {label}
                </label>
            )}

            <div className="input-wrapper">

                <input
                    id={name}
                    className={`input ${error ? 'input--error' : ''}`}
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="password-eye"
                        onClick={() =>
                            setShowPassword((prev) => !prev)
                        }
                        aria-label={
                            showPassword
                                ? 'Ascunde parola'
                                : 'Arată parola'
                        }
                    >
                        {showPassword ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="2.5"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 3l18 18"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M10.6 6.2A10.6 10.6 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-3.1 3.7M6.1 6.1C3.7 7.6 2.5 12 2.5 12s3.5 6 9.5 6c1.3 0 2.5-.3 3.6-.8"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </button>
                )}

            </div>

            {error && (
                <span className="input-error">
                    {error}
                </span>
            )}

        </div>
    );
}

export default Input;