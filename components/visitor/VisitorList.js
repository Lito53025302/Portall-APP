function VisitorList({ visitors, isGuardView = false, onReactivate, onStatusChange, onCheckout }) {
    try {
        if (visitors.length === 0) {
            return (
                <div data-name="empty-visitor-list" className="text-center py-8 text-gray-500">
                    <i className="fas fa-user-friends text-4xl mb-2 text-gray-300"></i>
                    <h3 className="text-lg font-semibold mb-1">No visitors yet</h3>
                    <p className="text-sm">Register your first visitor to get started</p>
                </div>
            );
        }

        return (
            <div data-name="visitor-list" className="visitor-grid">
                {visitors.map((visitor, index) => (
                    <VisitorCard
                        key={visitor.token}
                        visitor={visitor}
                        index={index}
                        isGuardView={isGuardView}
                        onReactivate={onReactivate}
                        onStatusChange={onStatusChange}
                        onCheckout={onCheckout}
                    />
                ))}
            </div>
        );
    } catch (error) {
        console.error('VisitorList component error:', error);
        reportError(error);
        return null;
    }
}
