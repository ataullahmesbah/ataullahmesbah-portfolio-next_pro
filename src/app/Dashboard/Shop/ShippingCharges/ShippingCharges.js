'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ShippingCharges() {
    const [charges, setCharges] = useState({ 'Dhaka-Chattogram': 0, 'Others': 0 });
    const [dhakaChattogramCharge, setDhakaChattogramCharge] = useState('');
    const [othersCharge, setOthersCharge] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCharges = async () => {
        setLoading(true);
        try {
            setError('');
            const response = await axios.get('/api/products/shipping-charges');
            console.log('Shipping Charges Response:', response.data);
            const chargeMap = { 'Dhaka-Chattogram': 0, 'Others': 0 };
            response.data.forEach(c => {
                if (c.type === 'Dhaka-Chattogram' || c.type === 'Others') {
                    chargeMap[c.type] = c.charge || 0;
                }
            });
            setCharges(chargeMap);
            setDhakaChattogramCharge(chargeMap['Dhaka-Chattogram'].toString());
            setOthersCharge(chargeMap['Others'].toString());
        } catch (error) {
            console.error('Error fetching shipping charges:', error);
            setError('Failed to load shipping charges. Please try again or reset to default.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharges();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dhakaChattogramCharge || Number(dhakaChattogramCharge) < 0) {
            setError('Please enter a valid charge for Dhaka & Chattogram.');
            return;
        }
        if (!othersCharge || Number(othersCharge) < 0) {
            setError('Please enter a valid charge for other districts.');
            return;
        }
        try {
            setError('');
            setLoading(true);
            const payload = [
                { type: 'Dhaka-Chattogram', charge: Number(dhakaChattogramCharge) },
                { type: 'Others', charge: Number(othersCharge) }
            ];
            console.log('Submitting:', payload);
            await axios.post('/api/products/shipping-charges', payload);
            alert('Shipping charges updated successfully');
            fetchCharges();
        } catch (error) {
            console.error('Error updating shipping charges:', error.response?.data || error);
            setError(error.response?.data?.error || 'Failed to update shipping charges. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (confirm('Reset charges to default (Dhaka & Chattogram: 100 BDT, Others: 150 BDT)?')) {
            try {
                setError('');
                setLoading(true);
                const payload = [
                    { type: 'Dhaka-Chattogram', charge: 100 },
                    { type: 'Others', charge: 150 }
                ];
                console.log('Resetting:', payload);
                await axios.post('/api/products/shipping-charges', payload);
                alert('Charges reset to default');
                fetchCharges();
            } catch (error) {
                console.error('Error resetting shipping charges:', error.response?.data || error);
                setError(error.response?.data?.error || 'Failed to reset shipping charges');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-white mb-6">Manage Shipping Charges</h1>
            {error && (
                <div className="bg-red-600/90 text-white p-4 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}
            {loading && (
                <div className="text-center py-4">
                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
            <div className="flex justify-end gap-4 mb-6">
                <button
                    onClick={fetchCharges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={loading}
                >
                    Refresh
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-yellow-400"
                    disabled={loading}
                >
                    Reset to Default
                </button>
            </div>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Dhaka & Chattogram Charge (BDT)</label>
                    <input
                        type="number"
                        value={dhakaChattogramCharge}
                        onChange={(e) => setDhakaChattogramCharge(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 text-white px-3 py-2 rounded-md"
                        required
                        min="0"
                        placeholder="e.g., 100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Other Districts Charge (BDT)</label>
                    <input
                        type="number"
                        value={othersCharge}
                        onChange={(e) => setOthersCharge(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 text-white px-3 py-2 rounded-md"
                        required
                        min="0"
                        placeholder="e.g., 150"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={loading}
                >
                    Update Charges
                </button>
            </form>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Current Charges</h2>
                <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                        <span>Dhaka & Chattogram:</span>
                        <span>৳{charges['Dhaka-Chattogram']}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Other Districts:</span>
                        <span>৳{charges['Others']}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}