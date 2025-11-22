import React, { useState } from 'react'; // Removed useContext for simplicity, assuming you handle context separately
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/Inputs/Input';
import axiosInstance from '../utils/axiosInstance';
import { type AuthResponse } from '../types/auth';
import { AxiosError } from 'axios';

// [INSTRUCTION_B] Define API paths constant locally or import from utils [INSTRUCTION_E]
const API_PATHS = {
    AUTH: { LOGIN: '/auth/login' }
};

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    // const { updateUser } = useContext(UserContext); // Uncomment when Context is ready

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password) {
            setError('Please enter the password.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            // [INSTRUCTION_B] API Call with typed response [INSTRUCTION_E]
            const response = await axiosInstance.post<AuthResponse>(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                // updateUser(user); // Update context

                // Redirect based on role
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
            <div className="lg:w-[70%] h-full w-full flex flex-col justify-center mx-auto">
                <h3 className="text-2xl font-bold text-black mb-1">Welcome Back</h3>
                <p className="text-sm text-slate-500 mb-8">
                    Please enter your details to log in
                </p>

                <form onSubmit={handleLogin} className="flex flex-col gap-2">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                    {error && <p className="text-red-500 text-xs pt-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors disabled:opacity-70"
                    >
                        {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>

                    <p className="text-sm text-slate-600 mt-4 text-center">
                        Don't have an account?{' '}
                        <Link className="text-blue-600 font-medium underline hover:text-blue-700" to="/signup">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;