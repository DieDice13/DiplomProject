import '../styles/global.scss';
import Header from '../components/Header';
import Promotions from '../components/Promotions';
import SpecialProducts from '../components/SpecialProducts';
import Footer from '../components/Footer';
import Brands from '../components/Brands';

function HomePage() {
    return (
        <div className='home_page'>
            <Header />
            <Promotions />
            <SpecialProducts category="smartphones"/>
            <SpecialProducts category="laptops"/>
            <SpecialProducts category="microwaves"/>
            <Promotions />
            <Brands />
            <Footer />
        </div>
    );
}

export default HomePage;
