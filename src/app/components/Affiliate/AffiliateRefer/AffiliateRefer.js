'use client';

import { useState } from "react";

const AffiliateRefer = ({ affiliateId }) => {
    const [referralLink, setReferralLink] = useState('');

    const generateLink = () => {
        const link = `https://ataullahmesbah.com?ref=${affiliateId}`;
        setReferralLink(link);
    };

    return (
        <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">Generate Your Referral Link</h3>
            <button
                onClick={generateLink}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
                Generate Link
            </button>
            {referralLink && (
                <div className="mt-4">
                    <p className="text-gray-300">Your Referral Link:</p>
                    <p className="text-indigo-400">{referralLink}</p>
                </div>
            )}
        </div>
    );
};

export default AffiliateRefer;
