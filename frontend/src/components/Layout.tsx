import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Header */}
      <div style={{ background: '#1a1a2e', color: 'white', padding: '15px 20px' }}>
        <h2>Image Forensic App</h2>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Sidebar */}
        <div style={{ width: '200px', background: '#16213e', color: 'white', padding: '20px' }}>
          <p onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>Home</p>
          <p onClick={() => navigate('/history')} style={{ cursor: 'pointer' }}>History</p>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;