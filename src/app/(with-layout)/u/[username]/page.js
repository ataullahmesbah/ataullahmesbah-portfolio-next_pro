// app/(with-layout)/u/[username]/page.js
import PublicProfile from "@/app/components/Profile/PublicProfile/PublicProfile";

<<<<<<< Updated upstream
export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/profile/public-profile/${params.username}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error('Profile not found');

    const data = await res.json();
    const title = `${data.user.displayName || data.user.username} - ${data.profile?.title || 'Professional'} in ${data.profile?.location || 'Unknown Location'} | Ataullah Mesbah`;
    const description = data.profile?.bio || `Profile of ${data.user.displayName || data.user.username}`;
    const imageUrl = data.profile?.image || '/default-profile.png';
    const url = `${process.env.NEXTAUTH_URL}/u/${params.username}`;

    return {
      title,
      description,
      alternates: {
        canonical: url
      },
      openGraph: {
        title,
        description,
        url,
        siteName: 'Ataullah Mesbah',
        images: [{
          url: imageUrl,
          width: 800,
          height: 600,
        }],
        locale: 'en_US',
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      other: {
        'adsbygoogle': 'none'
      }
    };
  } catch (error) {
    return {
      title: 'User Profile | Ataullah Mesbah',
      description: 'Professional profile page'
    };
  }
}

export default async function Page({ params }) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/profile/public-profile/${params.username}`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();

  return <PublicProfile username={params.username} initialData={data} />;
}
=======
export default function Page({ params }) {
  return <PublicProfile username={params.username} />;
}

>>>>>>> Stashed changes
