import '../styles/global.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Auth from '../components/Auth';



function ProfilePage() {
    return (
        <div className='profile_page'>
            <Header />
            <Auth />
            <Footer />
        </div>
    );
}

export default ProfilePage;
