import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './Components/Navbar';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Components/Register';
import Portfolio from './Screens/Portfolio';
import Watchlist from './Screens/Watchlist';
import Profile from './Screens/Profile';
import Stocks from './Screens/Stocks';
import StockDetail from './Screens/StockDetail';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/stocks/:stockId" element={<StockDetail />} />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
