function App() {
    try {
        const [user, setUser] = React.useState(null);
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
            const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
                if (firebaseUser) {
                    try {
                        // Get user profile from Firestore
                        const userDoc = await firebaseDb.collection('users').doc(firebaseUser.uid).get();
                        if (userDoc.exists) {
                            const userData = userDoc.data();
                            setUser({
                                uid: firebaseUser.uid,
                                email: firebaseUser.email,
                                ...userData
                            });
                            saveToLocalStorage('user', {
                                uid: firebaseUser.uid,
                                email: firebaseUser.email,
                                ...userData
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching user profile:', error);
                    }
                } else {
                    setUser(null);
                    removeFromLocalStorage('user');
                }
                setIsLoading(false);
            });

            return () => unsubscribe();
        }, []);

        const handleLogin = (userData) => {
            setUser(userData);
            saveToLocalStorage('user', userData);
        };

        const handleLogout = async () => {
            try {
                await signOutUser();
                setUser(null);
                clearLocalStorage();
            } catch (error) {
                console.error('Logout error:', error);
            }
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
