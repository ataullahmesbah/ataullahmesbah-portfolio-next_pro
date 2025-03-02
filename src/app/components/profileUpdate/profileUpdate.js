'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaUserGraduate } from 'react-icons/fa';

export default function ProfileUpdate({ session }) {
    const [preview, setPreview] = useState(session?.user.image || '');

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        console.log('Selected file:', file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            console.log('Upload response:', data);

            if (data.url) {
                setPreview(data.url);

                // Update the user's profile image in the database
                await fetch('/api/updateProfileImage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: session.user.email, image: data.url }),
                });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="relative">
            <button className="flex items-center">
                {preview ? (
                    <Image
                        src={preview}
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full"
                        priority
                    />
                ) : (
                    <FaUserGraduate className="text-2xl" />
                )}
            </button>

            <div className="absolute right-0 bg-gray-800 shadow-lg rounded-lg py-2 w-48 mt-2">
                <label className="block px-4 py-2 text-white hover:bg-gray-700 cursor-pointer">
                    Update Profile
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                    />
                </label>
                <button className="block w-full px-4 py-2 text-white hover:bg-gray-700 text-left">
                    Sign Out
                </button>
            </div>
        </div>
    );
}