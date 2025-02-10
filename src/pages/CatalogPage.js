import '../styles/global.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Catalog from '../components/Catalog';

function CatalogPage() {
    return (
        <div className='catalog_page'>
            <Header />
            <Catalog />
            <Footer />
        </div>
    );
}

export default CatalogPage;
