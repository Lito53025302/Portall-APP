function ResidentDashboard({ user }) {
    try {
        const [visitors, setVisitors] = React.useState([]);
        const [showVisitorForm, setShowVisitorForm] = React.useState(false);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
            loadVisitors();
        }, [user]);

        const loadVisitors = async () => {
            try {
                const visitorsList = await getVisitorsByResident(user.uid);
                setVisitors(visitorsList);
            } catch (error) {
                console.error('Error loading visitors:', error);
            } finally {
                setLoading(false);
            }
        };

        const activeVisitors = visitors.filter(v => 
            !isTokenExpired(v.createdAt) && v.status !== 'saida_registrada'
        );
        const checkedOutVisitors = visitors.filter(v => v.status === 'saida_registrada');
        const warningVisitors = visitors.filter(v => shouldShowWarning(v.failedAttempts || 0));

        const handleReactivate = async (visitor) => {
            try {
                const newToken = await reactivateVisitorToken(visitor.id);
                await loadVisitors(); // Reload data
            } catch (error) {
                console.error('Error reactivating token:', error);
            }
        };

        const handleCheckout = async (visitorId) => {
            try {
                await updateVisitorStatus(visitorId, 'saida_registrada');
                await loadVisitors(); // Reload data
            } catch (error) {
                console.error('Error checking out visitor:', error);
            }
        };

        const handleAddVisitor = async (visitorData) => {
            try {
                await createVisitor(visitorData, user.uid);
                await loadVisitors(); // Reload data
                setShowVisitorForm(false);
            } catch (error) {
                console.error('Error creating visitor:', error);
            }
        };

        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        return (
            <div data-name="resident-dashboard">
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Active</p>
                                <p className="text-2xl font-bold">{activeVisitors.length}</p>
                            </div>
                            <i className="fas fa-user-check text-2xl opacity-70"></i>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Checked Out</p>
                                <p className="text-2xl font-bold">{checkedOutVisitors.length}</p>
                            </div>
                            <i className="fas fa-sign-out-alt text-2xl opacity-70"></i>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Warnings</p>
                                <p className="text-2xl font-bold">{warningVisitors.length}</p>
                            </div>
                            <i className="fas fa-exclamation-triangle text-2xl opacity-70"></i>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">My Visitors</h2>
                    <Button onClick={() => setShowVisitorForm(true)} className="px-4 py-2">
                        <i className="fas fa-plus mr-2"></i>
                        Add Visitor
                    </Button>
                </div>

                {showVisitorForm && (
                    <VisitorForm
                        onClose={() => setShowVisitorForm(false)}
                        onSubmit={handleAddVisitor}
                    />
                )}

                <VisitorList 
                    visitors={visitors} 
                    onReactivate={handleReactivate}
                    onCheckout={handleCheckout}
                />
            </div>
        );
    } catch (error) {
        console.error('ResidentDashboard component error:', error);
        reportError(error);
        return null;
    }
}
