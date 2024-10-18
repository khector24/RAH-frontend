// Layout.jsx

import Sidebar from './Components/Sidebar';
import Footer from './Components/Footer';
import { Outlet } from 'react-router-dom';
import Header from './Components/Header';

const Layout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '250px' }}>
                <Header />
                <Outlet />
                <Footer />
            </main>
        </div>
    );
};

export default Layout;


// import { Outlet } from 'react-router-dom';
// import Sidebar from './Components/Sidebar';
// import Footer from './Components/Footer';

// export default function Layout() {
//     return (
//         // <>
//         //     <Sidebar />
//         //     <main>
//         //         <Outlet />
//         //     </main>
//         //     <Footer />
//         // </>
//         <></>
//     )
// }