// Layout.jsx

import Sidebar from './Components/Sidebar';
import Footer from './Components/Footer';
import { Outlet } from 'react-router-dom';
import Header from './Components/Header';

const Layout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <div style={{ flex: 1, padding: 20 }}>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;


