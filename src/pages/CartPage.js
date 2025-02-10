import '../styles/global.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';



function CartPage() {
    return (
        <div className='cart_page'>
            <Header />
            <Cart />
            <Footer />
        </div>
    );
}

export default CartPage;
