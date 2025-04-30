// app/api/profile/public-profile/[username]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import User from '@/models/User';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { username } = params;


    const user = await User.findOne({ username })
      .select('username email displayName createdAt')
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }


    const profile = await UserProfile.findOne({ userId: user._id })
      .select('-__v -socialLinks._id') // Removed -verification from exclusion
      .lean();


    const displayName = profile?.displayName || user.displayName || user.username;
    const title = profile?.title || 'Professional';
    const location = profile?.location || 'Unknown Location';

    return NextResponse.json({
      profile: {
        ...profile,
        displayName,
        title,
        location
      },
      user: {
        username: user.username,
        displayName,
        memberSince: user.createdAt
      },
      seo: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: displayName,
        description: profile?.bio || `${displayName}'s professional profile`,
        url: `${process.env.NEXTAUTH_URL}/u/${username}`,
        image: profile?.image || `${process.env.NEXTAUTH_URL}/default-profile.png`,
        jobTitle: title,
        sameAs: [
          profile?.socialLinks?.linkedin,
          profile?.socialLinks?.twitter,
          profile?.socialLinks?.github
        ].filter(Boolean),
        address: location ? {
          "@type": "PostalAddress",
          addressLocality: location
        } : undefined
      },
      meta: {
        title: `${displayName} - ${title} in ${location} | Ataullah Mesbah`,
        description: profile?.bio || '',
        image: profile?.image,
        canonicalUrl: `${process.env.NEXTAUTH_URL}/u/${username}`
      }
    });

  } catch (error) {
    console.error('Error fetching public profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}