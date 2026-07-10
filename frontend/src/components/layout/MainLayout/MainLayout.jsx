import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

import './MainLayout.scss';

function MainLayout({ children }) {
    return (
        <div className="layout">

            <Navbar />

            <main className="layout-content">
                {children}
            </main>

            <Footer />

        </div>
    );
}

export default MainLayout;