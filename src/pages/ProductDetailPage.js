import '../styles/global.scss';
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductDetail from "../components/ProductDetail";
import ProductReviews from "../components/Reviews";

function ProductDetailPage() {
    return ( 
        <div className='product_detail'>
            <Header />
            <ProductDetail />
            <ProductReviews />
            <Footer />
        </div>
     );
}

export default ProductDetailPage;