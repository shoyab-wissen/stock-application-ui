
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './screens/Home';
import About from './screens/About';
import Services from './screens/Services';
import NetBanking from './screens/NetBanking';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';
import BalanceEnquiry from './components/BalanceEnquiry';
import Statement from './components/Statement';
import FundTransfer from './components/FundTransfer';
import BillPayment from './components/BillPayment';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import Profile from './components/Profile';
import './styles/components.css';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />

            {/* Protected Routes */}
            <Route path="/netbanking" element={
              <ProtectedRoute>
                <NetBanking />
              </ProtectedRoute>
            } />
            <Route path="/balance" element={
              <ProtectedRoute>
                <BalanceEnquiry />
              </ProtectedRoute>
            } />
            <Route path="/statement" element={
              <ProtectedRoute>
                <Statement />
              </ProtectedRoute>
            } />
            <Route path="/transfer" element={
              <ProtectedRoute>
                <FundTransfer />
              </ProtectedRoute>
            } />
            <Route path="/deposit" element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            } />
            <Route path="/withdraw" element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            } />
            <Route path="/bills" element={
              <ProtectedRoute>
                <BillPayment />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;