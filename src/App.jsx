import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './Components/Navbar';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Portfolio from './Screens/Portfolio';
import Watchlist from './Screens/Watchlist';
import Profile from './Screens/Profile';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
    </Provider>
  );
}

export default App
