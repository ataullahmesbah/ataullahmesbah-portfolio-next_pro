'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const ProfileUpdate = () => {
    const { data: session, update } = useSession();
    const [preview, setPreview] = useState(session?.user.image || '');

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
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

                // Update the user's profile image in the database
                await fetch('/api/updateProfileImage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: session.user.email, image: data.url }),
                });

                // Update the session
                await update({ image: data.url });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} accept="image/*" />
            {preview && <Image src={preview} alt="Preview" width={100} height={100} />}
        </div>
    );
};

export default ProfileUpdate;