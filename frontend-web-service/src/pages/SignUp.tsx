import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/Inputs/Input';
import axiosInstance from '../utils/axiosInstance';
import { type AuthResponse } from '../types/auth';
import { AxiosError } from 'axios';
// [INSTRUCTION_B] Import helper functions. Ensure simple implementation for validateEmail exists [INSTRUCTION_E]
import { validateEmail } from '../utils/helper';

const API_PATHS = {
    AUTH: { REGISTER: '/auth/register' }
};

const SignUp: React.FC = () => {
    // State definitions with Types
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [adminInviteToken, setAdminInviteToken] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    // const { updateUser } = useContext(UserContext);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName) {
            setError('Please enter full name.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!password) {
            setError('Please enter the password.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            let profileImageUrl = '';

            // [INSTRUCTION_B] Logic for Image Upload. Assuming uploadImage returns { imageUrl: string } [INSTRUCTION_E]
            if (profilePic) {
                // const imgUploadRes = await uploadImage(profilePic); 
                // profileImageUrl = imgUploadRes.imageUrl || "";
                // Placeholder:
                console.log("Uploading image:", profilePic.name);
            }

            // API Call
            const response = await axiosInstance.post<AuthResponse>(API_PATHS.AUTH.REGISTER, {
                name: fullName,
                email,
                password,
                adminInviteToken,
                profileImageUrl, // Include the image URL in the payload
            });

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                // updateUser(user);

                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
                setError(axiosError.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full h-auto flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-black">Create an Account</h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                    Join us today by entering your details below.
                </p>

                <form onSubmit={handleSignUp}>
                    {/* [INSTRUCTION_B] Simple File Input for Profile Pic (Replacment for ProfilePhotoSelector) [INSTRUCTION_E] */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            label="Full Name"
                            placeholder="John Doe"
                        />

                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                            placeholder="example@gmail.com"
                        />

                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            placeholder="Min 8 characters"
                            type="password"
                        />

                        <Input
                            value={adminInviteToken}
                            onChange={(e) => setAdminInviteToken(e.target.value)}
                            label='Admin Invite Token'
                            placeholder='Optional'
                            type='text'
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors disabled:opacity-70"
                    >
                        {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                    </button>

                    <p className="text-sm text-slate-800 mt-4 text-center">
                        Already have an account?{' '}
                        <Link className="text-blue-600 font-medium underline hover:text-blue-700" to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default SignUp;