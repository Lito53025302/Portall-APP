function LoginForm({ onLogin, onSwitchMode }) {
    try {
        const [formData, setFormData] = React.useState({
            email: '',
            password: '',
            userType: 'resident'
        });
        const [error, setError] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
                    throw new Error('Invalid email or password format');
                }
                
                const user = await signInUser(formData.email, formData.password);
                onLogin({
                    uid: user.uid,
                    email: user.email,
                    userType: formData.userType,
                    name: 'User' // This would come from Firestore profile
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        return (
            <form data-name="login-form" className="auth-form" onSubmit={handleSubmit}>
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                
                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                
                <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />

                <div data-name="user-type-select" className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        I am a:
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                checked={formData.userType === 'resident'}
                                onChange={() => setFormData({...formData, userType: 'resident'})}
                                className="mr-2"
                            />
                            Resident
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                checked={formData.userType === 'guard'}
                                onChange={() => setFormData({...formData, userType: 'guard'})}
                                className="mr-2"
                            />
                            Guard
                        </label>
                    </div>
                </div>

                <Button type="submit" className="w-full mb-4" disabled={loading}>
                    {loading ? <div className="loading-spinner"></div> : 'Login'}
                </Button>

                <p data-name="register-prompt" className="text-center text-sm">
                    Don't have an account?{' '}
                    <span onClick={onSwitchMode} className="auth-switch">
                        Register here
                    </span>
                </p>
            </form>
        );
    } catch (error) {
        console.error('LoginForm component error:', error);
        reportError(error);
        return null;
    }
}
