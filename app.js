function App() {
    try {
        const [user, setUser] = React.useState(getFromLocalStorage('user'));
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
            // Simulate authentication check
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }, []);

        const handleLogin = (userData) => {
            setUser(userData);
            saveToLocalStorage('user', userData);
        };

        const handleLogout = () => {
            setUser(null);
            clearLocalStorage();
        };

        if (isLoading) {
            return (
                <div data-name="loading" className="h-screen flex items-center justify-center">
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        return (
            <div data-name="app" className="app-container">
                {user ? (
                    <Dashboard user={user} onLogout={handleLogout} />
                ) : (
                    <Auth onLogin={handleLogin} />
                )}
            </div>
        );
    } catch (error) {
        console.error('App component error:', error);
        reportError(error);
        return null;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
