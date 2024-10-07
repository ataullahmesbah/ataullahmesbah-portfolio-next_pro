import AffiliateDashboard from "@/app/components/Affiliate/AffiliateDashboard/AffiliateDashboard";
import AffiliateRefer from "@/app/components/Affiliate/AffiliateRefer/AffiliateRefer";
import AffiliateSection from "@/app/components/Affiliate/AffiliateSection/AffiliateSection";



const page = () => {
    const affiliateId = '12345'; // Dummy ID for referral link generation
    const dashboardData = {
        clicks: 120,
        signups: 15,
        earnings: 200,
    };

    return (
        <div className="py-16 bg-gray-900 text-white">
            {/* Affiliate Program Introduction and Sign Up */}
            <AffiliateSection />

            {/* Referral Link Generator */}
            <AffiliateRefer affiliateId={affiliateId} />

            {/* Affiliate Dashboard */}
            <AffiliateDashboard data={dashboardData} />
        </div>
    );
};

export default page;
