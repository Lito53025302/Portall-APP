function Input({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    placeholder = '', 
    required = false,
    className = '' 
}) {
    try {
        return (
            <div data-name="input-container" className="mb-4">
                {label && (
                    <label data-name="input-label" className="block text-sm font-medium text-gray-700 mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    data-name="input-field"
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } ${className}`}
                />
                {error && (
                    <p data-name="input-error" className="mt-1 text-sm text-red-500">
                        {error}
                    </p>
                )}
            </div>
        );
    } catch (error) {
        console.error('Input component error:', error);
        reportError(error);
        return null;
    }
}
