'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../lib/theme'
import { MockApolloProvider } from '../lib/apollo-client'
import useLogin from './hooks/useLogin'
const inter = Inter({ subsets: ['latin'] })
import LoginPage from './login/page'
import { LoginProvider } from './contexts/LoginContexct'

// export const metadata = {
//     title: 'Modern POS System',
//     description: 'A sleek point of sale system for touch screens',
// }


function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { isAuthenticated } = useLogin()


    return (
        <MockApolloProvider>
            <ThemeProvider>
                <html lang="en">
                    <body className={`${inter.className} bg-background text-foreground`}>
                        {isAuthenticated ? children : <LoginPage />}
                    </body>
                </html>
            </ThemeProvider>
        </MockApolloProvider>
    )
}


function App({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <LoginProvider>
            <RootLayout>
                {children}
            </RootLayout>
        </LoginProvider>
    )
}

export default App