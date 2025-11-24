import React, { useContext, useState } from 'react'; // Removed useContext for simplicity, assuming you handle context separately
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { getUserFromToken } from '../../utils/authUtils';
import { type LoginResponse, type User } from '../../types/auth';
import { AxiosError } from 'axios';

// [INSTRUCTION_B] Define API paths constant locally or import from utils [INSTRUCTION_E]
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext); // Uncomment when Context is ready

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
                localStorage.setItem('refresh_token', refresh_token);

                const userData = getUserFromToken(access_token);


                if (userData) {
                    updateUser(userData);
                    console.log(userData);
                    if (userData.role === 'ADMIN') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/user/dashboard');
                    }
                }
            } else {
                setError('Token invalid.');
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label="Username"
                        placeholder="Username"
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

function updateUser(userData: User) {
    throw new Error('Function not implemented.');
}
