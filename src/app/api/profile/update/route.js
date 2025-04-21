// api/profile/update/route.js 

import { getServerSession } from 'next-auth/next';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';


export async function POST(req) {
  try {
    // 1. Verify session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Connect to DB
    await dbConnect();
    console.log('Database connected');

    // 3. Parse request body
    const formData = await req.json();
    console.log('Received form data:', formData);

    // 4. Basic validation
    if (!formData.title || !formData.location) {
      return NextResponse.json(
        { success: false, message: 'Title and location are required' },
        { status: 400 }
      );
    }

    // 5. Handle image upload
    let imageUrl = '';
    if (formData.image && formData.image.startsWith('data:image')) {
      try {
        console.log('Uploading image to Cloudinary...');
        const uploadResult = await cloudinary.uploader.upload(formData.image, {
          folder: 'profile_images',
          public_id: `profile_${session.user.id}`,
          overwrite: true,
          transformation: [{ width: 800, crop: 'limit' }]
        });
        imageUrl = uploadResult.secure_url;
        console.log('Image uploaded:', imageUrl);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return NextResponse.json(
          { success: false, message: 'Image upload failed' },
          { status: 500 }
        );
      }
    }

    // 6. Prepare data for database
    const profileData = {
      userId: session.user.id,
      title: formData.title,
      displayName: formData.displayName,
      location: formData.location,
      image: imageUrl || undefined, // Keep existing if no new image
      expertise: formData.expertise
        ? formData.expertise.split(',').map(item => item.trim()).filter(item => item)
        : [],
      bio: formData.bio,
      portfolio: formData.portfolio
        .filter(item => item.title.trim())
        .map(item => ({
          title: item.title,
          sectors: item.sectors
            ? item.sectors.split(',').map(s => s.trim()).filter(s => s)
            : []
        })),
      experience: formData.experience
        ? formData.experience.split(',').map(item => item.trim()).filter(item => item)
        : [],
      workAvailability: formData.workAvailability || [],
      workExperience: formData.workExperience
        .filter(exp => exp.companyName.trim() && exp.designation.trim())
        .map(exp => ({
          companyName: exp.companyName,
          designation: exp.designation,
          roles: exp.roles
            ? exp.roles.split(',').map(r => r.trim()).filter(r => r)
            : [],
          startDate: exp.startDate || null,
          endDate: exp.endDate || null
        })),
      education: formData.education
        .filter(edu => edu.degree.trim() && edu.instituteName.trim() && edu.location.trim())
        .map(edu => ({
          degree: edu.degree,
          instituteName: edu.instituteName,
          location: edu.location,
          startDate: edu.startDate || null,
          endDate: edu.endDate || null
        })),
      skills: formData.skills
        .filter(skill => skill.title.trim() && skill.skills.trim())
        .map(skill => ({
          title: skill.title,
          skills: skill.skills.split(',').map(s => s.trim()).filter(s => s)
        })),
      socialLinks: {
        twitter: formData.socialLinks?.twitter || '',
        linkedin: formData.socialLinks?.linkedin || ''
      }
    };

  

    // 7. Save to database
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: session.user.id },
      profileData,
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );



    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update profile',
        error: error.message,
        ...(error.errors && { errors: error.errors }) // Mongoose validation errors
      },
      { status: 500 }
    );
  }
}