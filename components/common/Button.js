function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
    try {
        const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center';
        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
            secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
            danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
        };

        return (
            <button
                data-name="button"
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${baseClasses} ${variants[variant]} ${className}`}
            >
                {children}
            </button>
        );
    } catch (error) {
        console.error('Button component error:', error);
        reportError(error);
        return null;
    }
}
