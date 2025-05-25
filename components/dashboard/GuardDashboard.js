function GuardDashboard({ user }) {
    try {
        const [searchTerm, setSearchTerm] = React.useState('');
        const [visitors, setVisitors] = React.useState([]);
        const [searchResults, setSearchResults] = React.useState([]);

        const handleSearch = (e) => {
            e.preventDefault();
            if (!searchTerm.trim()) {
                setSearchResults([]);
                return;
            }

            const results = visitors.filter(visitor => 
                visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.token === searchTerm.toUpperCase()
            );

            setSearchResults(results);
        };

        const handleExport = () => {
            const exportData = searchResults.map(v => ({
                name: v.name,
                cpf: v.cpf,
                phone: v.phone,
                visitDate: v.visitDate,
                status: v.status,
                token: v.token
            }));
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `visitors_report_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
        };

        const handleStatusChange = (token, newStatus) => {
            setVisitors(visitors.map(v => 
                v.token === token ? {...v, status: newStatus} : v
            ));
            setSearchResults(searchResults.map(v => 
                v.token === token ? {...v, status: newStatus} : v
            ));
        };

        return (
            <div data-name="guard-dashboard">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Security Control</h2>
                    <div className="flex gap-2 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                            <Input
                                placeholder="Search visitor or token..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="min-w-[250px]"
                            />
                            <Button type="submit" className="px-4">
                                <i className="fas fa-search"></i>
                            </Button>
                        </form>
                        {searchResults.length > 0 && (
                            <Button onClick={handleExport} variant="secondary" className="px-4">
                                <i className="fas fa-download mr-2"></i>
                                Export
                            </Button>
                        )}
                    </div>
                </div>

                {searchResults.length > 0 ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">
                            Results ({searchResults.length})
                        </h3>
                        <VisitorList 
                            visitors={searchResults} 
                            isGuardView 
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                ) : searchTerm ? (
                    <div className="text-center py-8 text-gray-500">
                        <i className="fas fa-search text-4xl mb-2 text-gray-300"></i>
                        <h3 className="text-lg font-semibold mb-1">No visitors found</h3>
                        <p className="text-sm">Check the name or token and try again</p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <i className="fas fa-shield-alt text-4xl mb-2 text-gray-300"></i>
                        <h3 className="text-lg font-semibold mb-1">Ready for Security Check</h3>
                        <p className="text-sm">Search for visitors by name or token to verify access</p>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('GuardDashboard component error:', error);
        reportError(error);
        return null;
    }
}
