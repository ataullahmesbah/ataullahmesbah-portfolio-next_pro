
import PublicProfile from '@/app/components/Profile/PublicProfile/PublicProfile';
import { notFound } from 'next/navigation';

export default async function ProfilePage({ params }) {
    const { slug } = params;

    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/profile/username/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            return notFound();
        }

        const { data } = await res.json();

        if (!data?.profile) {
            return notFound();
        }

        return <PublicProfile profile={data.profile} user={data.user} />;
    } catch (error) {
        console.error('Profile load error:', error);
        return notFound();
    }
}

export async function generateMetadata({ params }) {
    const { slug } = params;

    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/profile/username/${slug}`);
        if (!res.ok) {
            return { title: 'User Profile', description: 'View this user profile' };
        }

        const { data } = await res.json();

        return {
            title: `${data.profile.displayName} | Profile`,
            description: data.profile.bio || `View ${data.profile.displayName}'s profile`,
            alternates: { canonical: `/u/${slug}` },
            openGraph: {
                images: [
                    {
                        url: data.profile.image || '/default-profile.png',
                        width: 800,
                        height: 800,
                        alt: `${data.profile.displayName}'s profile image`
                    }
                ]
            }
        };
    } catch (error) {
        return { title: 'User Profile', description: 'View this user profile' };
    }
}