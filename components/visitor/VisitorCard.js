function VisitorCard({ visitor, isGuardView, index = 0, onReactivate, onStatusChange, onCheckout }) {
    try {
        const isExpired = isTokenExpired(visitor.createdAt);
        const showWarning = shouldShowWarning(visitor.failedAttempts || 0);
        const colorClass = `visitor-card-${getVisitorCardColor(index)}`;
        
        const cardClasses = `visitor-card ${colorClass} ${
            showWarning ? 'warning-blink' : ''
        } ${isExpired ? 'expired-token' : ''}`;

        const handleReactivate = () => {
            if (confirm(`Reactivate token for ${visitor.name}?`)) {
                onReactivate(visitor);
            }
        };

        const handleGuardAction = (action) => {
            if (isExpired) {
                alert('Token expired! Please wait for resident to reactivate.');
                return;
            }
            onStatusChange(visitor.id, action);
        };

        const handleCheckout = () => {
            if (confirm(`Checkout ${visitor.name}?`)) {
                onCheckout(visitor.id);
            }
        };

        const getStatusDisplay = () => {
            if (visitor.status === 'saida_registrada') return 'Checked Out';
            if (visitor.status === 'liberado') return 'Approved';
            if (visitor.status === 'negado') return 'Denied';
            if (isExpired) return 'Expired';
            return 'Pending';
        };

        const getStatusColor = () => {
            if (visitor.status === 'liberado') return 'bg-green-100 text-green-800';
            if (visitor.status === 'negado') return 'bg-red-100 text-red-800';
            if (visitor.status === 'saida_registrada') return 'bg-gray-100 text-gray-800';
            if (isExpired) return 'bg-gray-100 text-gray-800';
            return 'bg-yellow-100 text-yellow-800';
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
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
                        {getStatusDisplay()}
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
                        ) : visitor.status === 'liberado' && visitor.status !== 'saida_registrada' ? (
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

                {isGuardView && visitor.status === 'pendente' && (
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
                                    onClick={() => handleGuardAction('liberado')}
                                    className="flex-1 text-xs py-1"
                                >
                                    <i className="fas fa-check"></i>
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleGuardAction('negado')}
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
