import { createContext, useState } from 'react';

interface LoginContextType {
    isAuthenticated: boolean;
    accessToken: string;
    refreshToken: string;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

const LoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('https://appsnap.hasura.app/api/rest/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (response.ok) {
                if (!data.login.accessToken || !data.login.refreshToken) {
                    throw new Error('Invalid Login, please try again');
                }
                setIsAuthenticated(true);
                setAccessToken(data.login.accessToken);
                setRefreshToken(data.login.refreshToken);
                console.log('Login successful');
            } else {
                throw new Error('Error processing login');
            }
        } catch (error) {
            throw new Error((error as Error)?.message ?? 'An error occurred logging in');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setAccessToken('');
        setRefreshToken('');
    };

    return (
        <LoginContext.Provider value={{ isAuthenticated, accessToken, refreshToken, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
}



export { LoginProvider, LoginContext };