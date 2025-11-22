import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types/auth';

// Define the shape of the context data
interface UserContextType {
    user: User | null;
    updateUser: (userData: User | null) => void;
    isAuthenticated: boolean;
}

// Create the context with a default undefined value
export const UserContext = createContext<UserContextType>({
    user: null,
    updateUser: () => { },
    isAuthenticated: false,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // [INSTRUCTION_B] Check localStorage on initial load to persist user session [INSTRUCTION_E]
    useEffect(() => {
        const token = localStorage.getItem('token');
        // In a real app, you might want to decode the JWT here or call an /auth/me endpoint to validate the token
        if (token) {
            // Placeholder: We assume if token exists, user is logged in. 
            // Ideally, fetch user details from API here.
        }
    }, []);

    const updateUser = (userData: User | null) => {
        setUser(userData);
        if (!userData) {
            localStorage.removeItem('token');
        }
    };

    return (
        <UserContext.Provider value={{ user, updateUser, isAuthenticated: !!user }
        }>
            {children}
        </UserContext.Provider>
    );
};