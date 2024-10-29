import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Login';
import Products from './pages/Prodcucts/Products';
import ProductDetailPage from './pages/Prodcucts/ProductsDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;