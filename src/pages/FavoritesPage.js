import '../styles/global.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Favorites from '../components/Favorites';


function FavoritesPage() {
    
    return (
        <div className='home_page'>
            <Header />
            <Favorites />
            <Footer />
        </div>
    );
}

export default FavoritesPage;
