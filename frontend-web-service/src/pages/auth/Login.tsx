import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { type LoginResponse } from '../../types/auth';
import { AxiosError } from 'axios';
import { API_PATHS } from '../../utils/apiPaths';
import { getUserFromToken } from '../../utils/authUtils';


const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password) {
            setError('Please enter the password.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response = await axiosInstance.post<LoginResponse>(API_PATHS.AUTH.LOGIN, {
                username,
                password,
            });

            const { access_token, refresh_token } = response.data;

            if (access_token) {
                localStorage.setItem('access_token', access_token);
                if (refresh_token) {
                    localStorage.setItem('refresh_token', refresh_token);
                }

                const decodedUser = getUserFromToken(access_token);

                if (decodedUser) {
                    navigate('/dashboard');
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
        <div>
            <h3 className="text-center mb-3" style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome Back</h3>
            <p className="text-center mb-4" style={{ color: '#6b7280', fontSize: '14px' }}>
                Please enter your details to log in
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-2">
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Email Address"
                    placeholder="example@gmail.com"
                    type="text"
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
                    {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                </button>

                <p className="text-center mt-3" style={{ fontSize: '13px' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;

// function updateUser(userData: User) {
//     throw new Error('Function not implemented.');
// }
