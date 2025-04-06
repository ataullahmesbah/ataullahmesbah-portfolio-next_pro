// app/(with-layout)/mesbahoffwego/historical/page.js

import HistoricalPage from "@/app/components/Travel/HistoricalPage/HistoricalPage";


async function getHistoricalData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/travel?category=Historical`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch historical data');
    return res.json();
}


export async function generateMetadata() {
    return {
        title: "Historical Sites - Mesbah Off We Go",
        description: "Explore all historical travel sites visited by Ataullah Mesbah",
    };
}

export default async function Historical() {
    const historical = await getHistoricalData();
    return <HistoricalPage historical={historical} />;
}