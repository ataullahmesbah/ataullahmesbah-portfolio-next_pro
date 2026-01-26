"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProfileUpdate() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        displayName: '', // Add this
        image: '',
        title: '',
        displayName: '',
        location: '',
        expertise: '',
        bio: '',
        portfolio: [{ title: '', sectors: '' }],
        experience: '',
        workAvailability: [],
        workExperience: [{ companyName: '', designation: '', roles: '', startDate: '', endDate: '' }],
        education: [{ degree: '', instituteName: '', location: '', startDate: '', endDate: '' }],
        skills: [{ title: '', skills: '' }],
        socialLinks: { twitter: '', linkedin: '' },
    });
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            toast.error('Please log in to access this page.');
        } else if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status, router]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`/api/profile/${session.user.id}`);
            if (!response.ok) throw new Error('Failed to fetch profile');

            const data = await response.json();
            if (data.profile) {
                setFormData({
                    ...formData,
                    title: data.profile.title || '',
                    displayName: data.profile.displayName || '',
                    location: data.profile.location || '',
                    expertise: data.profile.expertise?.join(', ') || '',
                    bio: data.profile.bio || '',
                    portfolio: data.profile.portfolio?.length > 0
                        ? data.profile.portfolio.map(p => ({
                            title: p.title,
                            sectors: p.sectors?.join(', ') || ''
                        }))
                        : [{ title: '', sectors: '' }],
                    experience: data.profile.experience?.join(', ') || '',
                    workAvailability: data.profile.workAvailability || [],
                    workExperience: data.profile.workExperience?.length > 0
                        ? data.profile.workExperience.map(w => ({
                            companyName: w.companyName,
                            designation: w.designation,
                            roles: w.roles?.join(', ') || '',
                            startDate: w.startDate?.split('T')[0] || '',
                            endDate: w.endDate?.split('T')[0] || ''
                        }))
                        : [{ companyName: '', designation: '', roles: '', startDate: '', endDate: '' }],
                    education: data.profile.education?.length > 0
                        ? data.profile.education.map(e => ({
                            degree: e.degree,
                            instituteName: e.instituteName,
                            location: e.location,
                            startDate: e.startDate?.split('T')[0] || '',
                            endDate: e.endDate?.split('T')[0] || ''
                        }))
                        : [{ degree: '', instituteName: '', location: '', startDate: '', endDate: '' }],
                    skills: data.profile.skills?.length > 0
                        ? data.profile.skills.map(s => ({
                            title: s.title,
                            skills: s.skills?.join(', ') || ''
                        }))
                        : [{ title: '', skills: '' }],
                    socialLinks: data.profile.socialLinks || { twitter: '', linkedin: '' }
                });
                setImagePreview(data.profile.image || '');
            }
        } catch (error) {

            toast.error('Failed to load profile');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e, field, index, subfield) => {
        if (field === 'portfolio' || field === 'workExperience' || field === 'education' || field === 'skills') {
            const updatedArray = [...formData[field]];
            updatedArray[index] = { ...updatedArray[index], [subfield]: e.target.value };
            setFormData({ ...formData, [field]: updatedArray });
        } else if (field === 'socialLinks') {
            setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, [subfield]: e.target.value },
            });
        } else {
            setFormData({ ...formData, [field]: e.target.value });
        }
        // Validate bio on change
        if (field === 'bio') {
            if (e.target.value.length < 380) {
                setErrors({ ...errors, bio: 'Bio must be at least 380 characters' });
            } else if (e.target.value.length > 1000) {
                setErrors({ ...errors, bio: 'Bio cannot exceed 1000 characters' });
            } else {
                setErrors({ ...errors, bio: '' });
            }
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData({
            ...formData,
            workAvailability: checked
                ? [...formData.workAvailability, value]
                : formData.workAvailability.filter((item) => item !== value),
        });
    };

    const addField = (field) => {
        setFormData({
            ...formData,
            [field]:
                field === 'portfolio'
                    ? [...formData.portfolio, { title: '', sectors: '' }]
                    : field === 'workExperience'
                        ? [...formData.workExperience, { companyName: '', designation: '', roles: '', startDate: '', endDate: '' }]
                        : field === 'education'
                            ? [...formData.education, { degree: '', instituteName: '', location: '', startDate: '', endDate: '' }]
                            : [...formData.skills, { title: '', skills: '' }],
        });
    };

    const removeField = (field, index) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const newErrors = {};
        if (!formData.displayName) newErrors.title = 'displayName is required';
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (formData.bio.length < 380) newErrors.bio = 'Bio must be at least 380 characters';
        if (formData.bio.length > 1000) newErrors.bio = 'Bio cannot exceed 1000 characters';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix form errors');
            return;
        }

        setLoading(true);

        try {


            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            toast.success('Profile updated successfully');
            router.push('/profile');

        } catch (error) {

            toast.error(error.message || 'Something went wrong');

            // Check for specific validation errors from Mongoose
            if (error.errors) {
                setErrors(error.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 rounded-xl shadow-lg p-8"
                >
                    <h2 className="text-3xl font-bold text-white mb-6">Update Profile</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image */}
                        <div>
                            <label className="block text-gray-300 mb-2">Profile Image</label>
                            {imagePreview && (
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 rounded-full object-cover mb-4"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-gray-300"
                            />
                        </div>

                        {/* Display Name */}
                        <div>
                            <label className="block text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => handleInputChange(e, 'displayName')}
                                placeholder="Your full name"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                                maxLength={100}
                            />
                        </div>
                        {/* Title */}
                        <div>
                            <label className="block text-gray-300 mb-2">Professional Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange(e, 'title')}
                                placeholder="e.g., Full Stack Developer"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                                maxLength={50}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-gray-300 mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange(e, 'location')}
                                placeholder="e.g., Dhaka, Bangladesh"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                                maxLength={100}
                            />
                        </div>

                        {/* Expertise */}
                        <div>
                            <label className="block text-gray-300 mb-2">Expertise (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.expertise}
                                onChange={(e) => handleInputChange(e, 'expertise')}
                                placeholder="e.g., React, Node.js, MongoDB"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-gray-300 mb-2">Bio (380–1000 characters)</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange(e, 'bio')}
                                placeholder="Write about yourself (min 380 characters)"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                                minLength={380}
                                maxLength={1000}
                                rows={6}
                            />
                            <p className="text-gray-400 text-sm">{formData.bio.length}/1000 characters</p>
                            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                        </div>

                        {/* Portfolio */}
                        <div>
                            <label className="block text-gray-300 mb-2">Portfolio</label>
                            {formData.portfolio.map((project, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => handleInputChange(e, 'portfolio', index, 'title')}
                                        placeholder="Project title"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={project.sectors}
                                        onChange={(e) => handleInputChange(e, 'portfolio', index, 'sectors')}
                                        placeholder="Sectors (comma-separated)"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg"
                                    />
                                    {formData.portfolio.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeField('portfolio', index)}
                                            className="text-red-500 mt-2"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addField('portfolio')}
                                className="text-purple-400 hover:text-purple-300"
                            >
                                + Add Project
                            </button>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-gray-300 mb-2">Experience (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.experience}
                                onChange={(e) => handleInputChange(e, 'experience')}
                                placeholder="e.g., Senior Developer, Freelancer"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                            />
                        </div>

                        {/* Work Availability */}
                        <div>
                            <label className="block text-gray-300 mb-2">Work Availability</label>
                            {['full-time', 'part-time', 'remote', 'onsite'].map((type) => (
                                <label key={type} className="flex items-center gap-2 text-gray-300">
                                    <input
                                        type="checkbox"
                                        value={type}
                                        checked={formData.workAvailability.includes(type)}
                                        onChange={handleCheckboxChange}
                                        className="text-purple-600"
                                    />
                                    {type.replace('-', ' ').toUpperCase()}
                                </label>
                            ))}
                        </div>

                        {/* Work Experience */}
                        <div>
                            <label className="block text-gray-300 mb-2">Work Experience</label>
                            {formData.workExperience.map((job, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                                    <input
                                        type="text"
                                        value={job.companyName}
                                        onChange={(e) => handleInputChange(e, 'workExperience', index, 'companyName')}
                                        placeholder="Company name"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={job.designation}
                                        onChange={(e) => handleInputChange(e, 'workExperience', index, 'designation')}
                                        placeholder="Designation"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={job.roles}
                                        onChange={(e) => handleInputChange(e, 'workExperience', index, 'roles')}
                                        placeholder="Roles (comma-separated)"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="date"
                                        value={job.startDate}
                                        onChange={(e) => handleInputChange(e, 'workExperience', index, 'startDate')}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="date"
                                        value={job.endDate}
                                        onChange={(e) => handleInputChange(e, 'workExperience', index, 'endDate')}
                                        placeholder="Leave blank for Present"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg"
                                    />
                                    {formData.workExperience.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeField('workExperience', index)}
                                            className="text-red-500 mt-2"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addField('workExperience')}
                                className="text-purple-400 hover:text-purple-300"
                            >
                                + Add Work Experience
                            </button>
                        </div>

                        {/* Education */}
                        <div>
                            <label className="block text-gray-300 mb-2">Education</label>
                            {formData.education.map((edu, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => handleInputChange(e, 'education', index, 'degree')}
                                        placeholder="Degree"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={edu.instituteName}
                                        onChange={(e) => handleInputChange(e, 'education', index, 'instituteName')}
                                        placeholder="Institute Name"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={edu.location}
                                        onChange={(e) => handleInputChange(e, 'education', index, 'location')}
                                        placeholder="Location"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="date"
                                        value={edu.startDate}
                                        onChange={(e) => handleInputChange(e, 'education', index, 'startDate')}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="date"
                                        value={edu.endDate}
                                        onChange={(e) => handleInputChange(e, 'education', index, 'endDate')}
                                        placeholder="Leave blank for Present"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg"
                                    />
                                    {formData.education.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeField('education', index)}
                                            className="text-red-500 mt-2"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addField('education')}
                                className="text-purple-400 hover:text-purple-300"
                            >
                                + Add Education
                            </button>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-gray-300 mb-2">Skills</label>
                            {formData.skills.map((skill, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                                    <input
                                        type="text"
                                        value={skill.title}
                                        onChange={(e) => handleInputChange(e, 'skills', index, 'title')}
                                        placeholder="Skill Category (e.g., Programming)"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={skill.skills}
                                        onChange={(e) => handleInputChange(e, 'skills', index, 'skills')}
                                        placeholder="Skills (comma-separated)"
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg"
                                    />
                                    {formData.skills.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeField('skills', index)}
                                            className="text-red-500 mt-2"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addField('skills')}
                                className="text-purple-400 hover:text-purple-300"
                            >
                                + Add Skills
                            </button>
                        </div>

                        {/* Social Links */}
                        <div>
                            <label className="block text-gray-300 mb-2">Social Links (Optional)</label>
                            <input
                                type="url"
                                value={formData.socialLinks.twitter}
                                onChange={(e) => handleInputChange(e, 'socialLinks', null, 'twitter')}
                                placeholder="Twitter URL"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg mb-2"
                            />
                            <input
                                type="url"
                                value={formData.socialLinks.linkedin}
                                onChange={(e) => handleInputChange(e, 'socialLinks', null, 'linkedin')}
                                placeholder="LinkedIn URL"
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !!errors.bio}
                            className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}