


const AffiliateDashboard = ({ data }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-lg mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6">Your Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Total Clicks</p>
                    <p className="text-2xl">{data.clicks}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Sign-ups</p>
                    <p className="text-2xl">{data.signups}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Earnings</p>
                    <p className="text-2xl">${data.earnings}</p>
                </div>
            </div>
        </div>
    );
};

export default AffiliateDashboard;
