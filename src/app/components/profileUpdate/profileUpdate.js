'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const ProfileUpdate = () => {
    const { data: session } = useSession();
    const [preview, setPreview] = useState(session?.user.image || '');
    const [intro, setIntro] = useState('');
    const [bio, setBio] = useState('');
    const [description, setDescription] = useState('');

    const handleImageUpload = async (e) => {
        // Check if files are selected
        if (!e.target.files || e.target.files.length === 0) {
            console.error('No file selected');
            return;
        }

        const file = e.target.files[0];
        console.log('Selected file:', file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload image to Cloudinary
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

                // Update the user's profile in the database
                const updateResponse = await fetch('/api/user/updateProfile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: session.user.id, // Ensure this matches the user's ID
                        image: data.url,
                        intro,
                        bio,
                        description,
                    }),
                });

                const updatedProfile = await updateResponse.json();
                console.log('Updated profile:', updatedProfile);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="p-4">
            {/* File Input */}
            <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="w-full p-2 border rounded"
            />

            {/* Image Preview */}
            {preview && (
                <Image
                    src={preview}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="mt-4 rounded-full"
                />
            )}

            {/* Intro Field */}
            <div className="mt-4">
                <label className="block text-sm font-medium">Intro (max 20 characters)</label>
                <input
                    type="text"
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    maxLength={20}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Bio Field */}
            <div className="mt-4">
                <label className="block text-sm font-medium">Bio (max 150 characters)</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={150}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Description Field */}
            <div className="mt-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Update Profile Button */}
            <button
                onClick={handleImageUpload}
                className="mt-4 p-2 bg-blue-500 text-white rounded w-full"
            >
                Update Profile
            </button>
        </div>
    );
};

export default ProfileUpdate;