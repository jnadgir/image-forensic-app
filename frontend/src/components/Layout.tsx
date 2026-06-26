import type { ReactNode } from 'react';
import Header from './Header';
import LeftNav from './LeftNav';

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: '#0a0a0f',
            fontFamily: "'Space Grotesk', sans-serif",
        }}>
            <Header />

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <LeftNav />

                {/* Main Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    backgroundColor: '#0a0a0f',
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;