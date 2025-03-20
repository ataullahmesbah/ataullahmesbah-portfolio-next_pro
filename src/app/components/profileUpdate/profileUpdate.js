'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfileUpdate() {
    const { data: session, status } = useSession();
    const [image, setImage] = useState('');
    const [intro, setIntro] = useState('');
    const [bio, setBio] = useState('');
    const [description, setDescription] = useState('');
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true); // Ensure we only use the router on the client side
    }, []);

    // Redirect unauthenticated users to the login page
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            toast.error('Please log in to access this page.');
        }
    }, [status, router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image, intro, bio, description }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                router.push('/profile'); // Redirect to /profile after successful update
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    // Show loading until session is confirmed
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!isClient) return null; // Prevent rendering until client-side

    return (
        <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-5 text-center">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {session?.user?.image ? (
                    <Image
                        src={session.user.image}
                        alt="Profile"
                        width={80}  // Change width
                        height={80} // Change height
                        className="w-20 h-20 rounded-full mx-auto object-cover" // Ensure correct aspect ratio
                    />
                ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto" />
                )}


                <input type="file" onChange={handleImageChange} className="border p-2 w-full" />
                <input type="text" maxLength="30" placeholder="Intro (Max 30 Chars)" className="border p-2 w-full"
                    onChange={(e) => setIntro(e.target.value)} />
                <textarea maxLength="150" placeholder="Bio (Max 150 Chars)" className="border p-2 w-full"
                    onChange={(e) => setBio(e.target.value)} />
                <textarea placeholder="Description" className="border p-2 w-full"
                    onChange={(e) => setDescription(e.target.value)} />

                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded w-full">
                    Update Profile
                </button>
            </form>
        </div>
    );
}