function VisitorForm({ onClose, onSubmit }) {
    try {
        const [formData, setFormData] = React.useState({
            name: '',
            cpf: '',
            phone: '',
            visitDate: '',
            photo: null
        });
        const [error, setError] = React.useState('');

        const handleCPFChange = (e) => {
            const formatted = formatCPF(e.target.value);
            setFormData({...formData, cpf: formatted});
        };

        const handlePhoneChange = (e) => {
            const formatted = formatPhone(e.target.value);
            setFormData({...formData, phone: formatted});
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            try {
                if (!validateCPF(formData.cpf)) {
                    throw new Error('CPF must have 11 digits');
                }
                if (!validatePhone(formData.phone)) {
                    throw new Error('Phone must have 11 digits');
                }

                const token = generateToken();

                onSubmit({
                    ...formData,
                    token,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                });
            } catch (error) {
                setError(error.message);
            }
        };

        return (
            <div data-name="visitor-form" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold mb-4">Register New Visitor</h3>
                    
                    <form onSubmit={handleSubmit}>
                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                        <Input
                            label="Visitor Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
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

                        <Input
                            label="Visit Date"
                            type="date"
                            value={formData.visitDate}
                            onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                            required
                        />

                        <Input
                            label="Photo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                            required
                        />

                        <div className="flex gap-2 mt-6">
                            <Button type="submit">Register Visitor</Button>
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    } catch (error) {
        console.error('VisitorForm component error:', error);
        reportError(error);
        return null;
    }
}
