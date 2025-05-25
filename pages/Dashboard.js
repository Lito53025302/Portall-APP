function Dashboard({ user, onLogout }) {
    try {
        return (
            <div data-name="dashboard-page">
                <header data-name="dashboard-header" className="bg-white shadow-md p-4 border-b">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Portall
                        </h1>
                        <div className="flex items-center gap-4">
                            <span data-name="user-name" className="text-gray-800 font-medium">
                                Welcome, {user.name}
                            </span>
                            <Button variant="secondary" onClick={onLogout}>
                                <i className="fas fa-sign-out-alt mr-2"></i>
                                Logout
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="page-container">
                    {user.userType === 'resident' ? (
                        <ResidentDashboard user={user} />
                    ) : (
                        <GuardDashboard user={user} />
                    )}
                </main>
            </div>
        );
    } catch (error) {
        console.error('Dashboard page error:', error);
        reportError(error);
        return null;
    }
}
