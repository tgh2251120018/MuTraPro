import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { type AuthResponse } from '../../types/auth';
import { AxiosError } from 'axios';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';

const SignUp: React.FC = () => {
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username) {
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
            const profileImageUrl = '';

            if (profilePic) {
                //

            }

            const response = await axiosInstance.post<AuthResponse>(API_PATHS.AUTH.REGISTER, {
                username,
                email,
                password,
            });

            if (response.status === 201) {
                alert("Registration successful! Please login.");
                navigate('/login');
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
        <div>
            <h3 className="text-center mb-3" style={{ fontSize: '24px', fontWeight: 'bold' }}>Create an Account</h3>
            <p className="text-center mb-4" style={{ color: '#6b7280', fontSize: '14px' }}>
                Join us today by entering your details below.
            </p>

            <form onSubmit={handleSignUp}>
                <div className="input-group">
                    <label className="input-label">Profile Photo</label>
                    <div className="input-wrapper" style={{ padding: '6px 16px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
                            className="input-control"
                            style={{ padding: '6px 0' }}
                        />
                    </div>
                </div>

                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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

                {error && <p className="text-danger text-center mt-3">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '16px' }}
                >
                    {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                </button>

                <p className="text-center mt-3" style={{ fontSize: '13px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignUp;