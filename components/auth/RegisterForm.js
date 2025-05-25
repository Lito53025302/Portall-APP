function RegisterForm({ onSwitchMode }) {
    try {
        const [userType, setUserType] = React.useState('resident');
        const [formData, setFormData] = React.useState({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            building: '',
            apartment: '',
            cpf: '',
            phone: '',
            guardId: '',
            shift: 'morning',
            securityCompany: ''
        });
        const [error, setError] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        const handleCPFChange = (e) => {
            const formatted = formatCPF(e.target.value);
            setFormData({...formData, cpf: formatted});
        };

        const handlePhoneChange = (e) => {
            const formatted = formatPhone(e.target.value);
            setFormData({...formData, phone: formatted});
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                if (!validateEmail(formData.email)) {
                    throw new Error('Invalid email format');
                }
                if (!validatePassword(formData.password)) {
                    throw new Error('Password must be at least 8 characters');
                }
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                if (userType === 'resident') {
                    if (!validateCPF(formData.cpf)) {
                        throw new Error('CPF must have 11 digits');
                    }
                    if (!validatePhone(formData.phone)) {
                        throw new Error('Phone must have 11 digits');
                    }
                    if (!formData.building || !formData.apartment) {
                        throw new Error('Building and apartment information is required');
                    }
                }

                const userData = {
                    name: formData.name,
                    userType,
                    ...(userType === 'resident' ? {
                        building: formData.building,
                        apartment: formData.apartment,
                        cpf: formData.cpf,
                        phone: formData.phone
                    } : {
                        guardId: formData.guardId,
                        shift: formData.shift,
                        securityCompany: formData.securityCompany
                    })
                };

                await registerUser(formData.email, formData.password, userData);
                onSwitchMode();
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        return (
            <form data-name="register-form" className="auth-form" onSubmit={handleSubmit}>
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <div data-name="user-type-select" className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Register as:
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                checked={userType === 'resident'}
                                onChange={() => setUserType('resident')}
                                className="mr-2"
                            />
                            Resident
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                checked={userType === 'guard'}
                                onChange={() => setUserType('guard')}
                                className="mr-2"
                            />
                            Guard
                        </label>
                    </div>
                </div>

                <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />

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

                <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                />

                {userType === 'resident' ? (
                    <div data-name="resident-fields">
                        <Input
                            label="Building Name"
                            value={formData.building}
                            onChange={(e) => setFormData({...formData, building: e.target.value})}
                            required
                        />

                        <Input
                            label="Apartment Number"
                            value={formData.apartment}
                            onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                            required
                        />

                        <Input
                            label="CPF"
                            value={formData.cpf}
                            onChange={handleCPFChange}
                            placeholder="29748111830"
                            required
                        />

                        <Input
                            label="Phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="11931470049"
                            required
                        />
                    </div>
                ) : (
                    <div data-name="guard-fields">
                        <Input
                            label="Guard ID"
                            value={formData.guardId}
                            onChange={(e) => setFormData({...formData, guardId: e.target.value})}
                            placeholder="Enter your guard ID"
                            required
                        />

                        <Input
                            label="Security Company"
                            value={formData.securityCompany}
                            onChange={(e) => setFormData({...formData, securityCompany: e.target.value})}
                            placeholder="Enter your security company name"
                            required
                        />

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Work Shift
                            </label>
                            <select
                                value={formData.shift}
                                onChange={(e) => setFormData({...formData, shift: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                            >
                                <option value="morning">Morning (6:00 - 14:00)</option>
                                <option value="afternoon">Afternoon (14:00 - 22:00)</option>
                                <option value="night">Night (22:00 - 6:00)</option>
                            </select>
                        </div>
                    </div>
                )}

                <Button type="submit" className="w-full mb-4" disabled={loading}>
                    {loading ? <div className="loading-spinner"></div> : 'Register'}
                </Button>

                <p data-name="login-prompt" className="text-center text-sm">
                    Already have an account?{' '}
                    <span onClick={onSwitchMode} className="auth-switch">
                        Login here
                    </span>
                </p>
            </form>
        );
    } catch (error) {
        console.error('RegisterForm component error:', error);
        reportError(error);
        return null;
    }
}
