import { createContext, useContext, useState, useEffect, } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// 1. Types
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

// 2. Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Provider component — wraps the entire app and provides auth state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // runs once on app load — checks if user was previously logged in
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);
    }, []);

    // sets axios default header so every request automatically sends the token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = async (email: string, password: string): Promise<void> => {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password,
        });

        const { user, token } = response.data;

        // save to state
        setUser(user);
        setToken(token);

        // save to localStorage so user stays logged in after page refresh
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const register = async (name: string, email: string, password: string): Promise<void> => {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name,
            email,
            password,
        });

        const { user, token } = response.data;

        setUser(user);
        setToken(token);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = (): void => {
        // clear state
        setUser(null);
        setToken(null);

        // clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Custom hook — makes consuming the context cleaner in any component
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};