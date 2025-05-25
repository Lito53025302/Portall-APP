function Alert({ type = 'info', message, onClose }) {
    try {
        const types = {
            success: 'bg-green-100 text-green-800 border-green-200',
            error: 'bg-red-100 text-red-800 border-red-200',
            warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            info: 'bg-blue-100 text-blue-800 border-blue-200'
        };

        return (
            <div
                data-name="alert"
                className={`${types[type]} border p-4 rounded-lg mb-4 relative`}
            >
                <span data-name="alert-message">{message}</span>
                {onClose && (
                    <button
                        data-name="alert-close"
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        );
    } catch (error) {
        console.error('Alert component error:', error);
        reportError(error);
        return null;
    }
}
