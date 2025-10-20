import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ad from '@/models/Ad';

export async function GET() {
  await dbConnect();
  
  try {
    const stats = await Ad.aggregate([
      {
        $group: {
          _id: null,
          totalImpressions: { $sum: '$impressions' },
          totalClicks: { $sum: '$clicks' },
          totalAds: { $sum: 1 },
          activeAds: {
            $sum: {
              $cond: [{ $eq: ['$isActive', true] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || { 
      totalImpressions: 0, 
      totalClicks: 0, 
      totalAds: 0, 
      activeAds: 0 
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Production Error fetching stats:', error);
    return NextResponse.json({ 
      totalImpressions: 0, 
      totalClicks: 0, 
      totalAds: 0, 
      activeAds: 0 
    });
  }
}