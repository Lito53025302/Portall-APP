function Auth({ onLogin }) {
    try {
        const [isLogin, setIsLogin] = React.useState(true);

        return (
            <div data-name="auth-page" className="auth-container flex items-center justify-center p-4">
                <div data-name="auth-content" className="auth-card p-8">
                    <h1 data-name="auth-title" className="auth-title">
                        <i className="fas fa-building mr-2"></i>
                        Portall
                    </h1>
                    {isLogin ? (
                        <LoginForm onLogin={onLogin} onSwitchMode={() => setIsLogin(false)} />
                    ) : (
                        <RegisterForm onSwitchMode={() => setIsLogin(true)} />
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Auth page error:', error);
        reportError(error);
        return null;
    }
}
