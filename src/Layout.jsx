// Layout.jsx

import Sidebar from './Components/Sidebar';
import Footer from './Components/Footer';
import { Outlet } from 'react-router-dom';
import Header from './Components/Header';

const Layout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: .25 }} >
                <Sidebar />
            </div>
            <div style={{ flex: .75, display: 'flex', flexDirection: 'column' }}>
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


