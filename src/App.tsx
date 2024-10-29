import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Products from './pages/Prodcucts/Products';
import ProductDetailPage from './pages/Prodcucts/ProductsDetails';
import AddressList from './pages/Address/AddressList';
import SingleAddress from './pages/Address/AddressbyId';
import CreateAddress from './pages/Address/CreateAddress';
import UpdateAddressForm from './pages/Address/UpdateAddress';

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
        <Route path="/address/new" element={<UpdateAddressForm />} />
        <Route path="/address/update" element={<UpdateAddressForm />} />
      </Routes>
    </Router>
  );
}

export default App;