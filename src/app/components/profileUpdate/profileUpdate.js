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
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (uploadData.url) {
                setPreview(uploadData.url);

                const updateRes = await fetch('/api/user/updateProfileImage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: session.user.email, image: uploadData.url }),
                });

                const updatedUser = await updateRes.json();
                console.log('Updated User:', updatedUser);

                await update({ image: uploadData.url });
            }
        } catch (error) {
            console.error('Upload Error:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            {preview && <Image src={preview} width={100} height={100} />}
        </div>
    );
};

export default ProfileUpdate;
