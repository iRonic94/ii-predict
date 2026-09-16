import './AuthLayout.scss';

function AuthLayout({
    title,
    titleClassName = '',
    children,
}) {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className={titleClassName}>{title}</h1>
                {children}

            </div>
        </div>
    );
}

export default AuthLayout;