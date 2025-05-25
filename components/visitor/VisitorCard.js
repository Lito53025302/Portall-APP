function VisitorCard({ visitor, isGuardView, index = 0, onReactivate, onStatusChange, onCheckout }) {
    try {
        const isExpired = isTokenExpired(visitor.createdAt);
        const showWarning = shouldShowWarning(visitor.failedAttempts || 0);
        const colorClass = `visitor-card-${getVisitorCardColor(index)}`;
        
        const cardClasses = `visitor-card ${colorClass} ${
            showWarning ? 'warning-blink' : ''
        } ${isExpired ? 'expired-token' : ''}`;

        const handleReactivate = () => {
            const newToken = generateToken();
            onReactivate({
                ...visitor,
                token: newToken,
                createdAt: new Date().toISOString(),
                failedAttempts: 0
            });
        };

        const handleGuardAction = (action) => {
            if (isExpired) {
                alert('Token expired! Please wait for resident to reactivate.');
                return;
            }
            onStatusChange(visitor.token, action);
        };

        const handleCheckout = () => {
            if (confirm(`Checkout ${visitor.name}?`)) {
                onCheckout(visitor.token);
            }
        };

        return (
            <div data-name="visitor-card" className={cardClasses}>
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-bold text-sm text-gray-800 mb-1">{visitor.name}</h3>
                        <p className="text-xs text-gray-600">{visitor.cpf}</p>
                        {showWarning && !isGuardView && (
                            <p className="text-xs text-red-600 font-medium mt-1">
                                ⚠️ Failed attempts
                            </p>
                        )}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                        visitor.status === 'approved' ? 'bg-green-100 text-green-800' :
                        visitor.status === 'denied' ? 'bg-red-100 text-red-800' :
                        visitor.status === 'checked-out' ? 'bg-gray-100 text-gray-800' :
                        isExpired ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                        {visitor.status === 'checked-out' ? 'Checked Out' :
                         isExpired ? 'Expired' : visitor.status}
                    </div>
                </div>

                <div className="mb-3 space-y-1">
                    <p className="text-xs flex items-center">
                        <i className="fas fa-calendar mr-1 text-blue-500"></i>
                        {new Date(visitor.visitDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs flex items-center">
                        <i className="fas fa-clock mr-1 text-orange-500"></i>
                        {getTimeRemaining(visitor.createdAt)}
                    </p>
                </div>

                {!isGuardView && (
                    <div className="qr-code-container mb-3">
                        <p className="text-center font-mono text-xs mb-2 font-bold">
                            {visitor.token}
                        </p>
                        <div className="visitor-photo"></div>
                        {isExpired ? (
                            <Button 
                                onClick={handleReactivate}
                                className="w-full mt-2 text-xs py-1"
                                variant="primary"
                            >
                                <i className="fas fa-refresh mr-1"></i>
                                Reactivate
                            </Button>
                        ) : visitor.status === 'approved' && visitor.status !== 'checked-out' ? (
                            <Button 
                                onClick={handleCheckout}
                                className="w-full mt-2 text-xs py-1"
                                variant="secondary"
                            >
                                <i className="fas fa-sign-out-alt mr-1"></i>
                                Check Out
                            </Button>
                        ) : null}
                    </div>
                )}

                {isGuardView && visitor.status === 'pending' && (
                    <div className="flex gap-1">
                        {isExpired || showWarning ? (
                            <div className="w-full p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-xs text-yellow-800 text-center">
                                    ⚠️ Contact resident
                                </p>
                            </div>
                        ) : (
                            <div className="flex gap-1 w-full">
                                <Button
                                    variant="primary"
                                    onClick={() => handleGuardAction('approved')}
                                    className="flex-1 text-xs py-1"
                                >
                                    <i className="fas fa-check"></i>
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleGuardAction('denied')}
                                    className="flex-1 text-xs py-1"
                                >
                                    <i className="fas fa-times"></i>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('VisitorCard component error:', error);
        reportError(error);
        return null;
    }
}
