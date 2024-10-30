import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Products from './pages/Prodcucts/Products';
import ProductDetailPage from './pages/Prodcucts/ProductsDetails';
import AddressList from './pages/Address/AddressList';
import SingleAddress from './pages/Address/AddressbyId';
import CreateAddress from './pages/Address/CreateAddress';
import UpdateAddressForm from './pages/Address/CreateAddress';
import PlaceOrderPage from './pages/Order/Order';
import ProductReviewPage from './pages/Prodcucts/ProductReview';
import CartPage from './pages/Cart/FetchCart';
import AddToCartPage from './pages/Cart/AddtoCart';
import UpdateCartPage from './pages/Cart/UpdateCart';
import DeleteCartItem from './pages/Cart/DeleteCart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/address" element={<AddressList />} />
        <Route path="/address/:id" element={<SingleAddress />} />
        <Route path="/address/new" element={<CreateAddress />} />
        <Route path="/address/update" element={<UpdateAddressForm />} />
        <Route path="/place-order" element={<PlaceOrderPage />} />
        <Route path="/product/review" element={<ProductReviewPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart/add" element={<AddToCartPage />} />
        <Route path="/cart/update/:id" element={<UpdateCartPage />} />
        <Route path="/cart/delete/:id" element={<DeleteCartItem />} />
      </Routes>
    </Router>
  );
}

export default App;