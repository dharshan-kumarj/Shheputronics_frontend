import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;