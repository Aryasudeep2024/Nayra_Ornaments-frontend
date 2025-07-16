import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './components/DashBoard'; // <-- Add this
import UserDashboard from './pages/UserDashboard';
import SellerDashboard from './pages/SellerDashboard';
import ResetPassword from './components/userDashboard/resetPassword'
import Register from "./pages/Register";
import RegisterSeller from "./pages/RegisterSeller"
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CollectionPage from './components/collections/CollectionPage';
import CategoryPage from './components/collections/CategoryPage'
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import SearchResults from './pages/SearchResults';
import ReviewPage from './pages/ReviewPage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './features/auth/authSlice';
import PaymentSuccess from './pages/PaymentSuccess';
import api from './api/axios';
import ThemeWrapper from "./components/ThemeWrapper";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile', { withCredentials: true });
        console.log("am her:",res)
        dispatch(setCredentials(res.data.user));
      } catch (err) {
        console.error("🔒 Not logged in or token expired");
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
    <ThemeWrapper>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reset-password" element={<ForgotPassword/>}/>
      <Route path="/dashboard" element={<Dashboard />} />

<Route path="/admin/dashboard" element={<SuperAdminDashboard />}/>
    <Route path="/collection/:categoryName" element={<CategoryPage />} />

<Route path="/search-results" element={<SearchResults />} />

<Route path="/collections" element={<CollectionPage />} />
<Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
       <Route path="/user/reset-password" element={<ResetPassword />} />

        <Route path="/user/register" element={<Register />}/>
        <Route path="/seller/register" element={<RegisterSeller/>}/>
        <Route path="/review/:productId" element={<ReviewPage />} />
       
        <Route path="/payment-success" element={<PaymentSuccess />} />

<Route path="/payment-cancel" element={<h2>❌ Payment Canceled.</h2>} />

    </Routes></ThemeWrapper></>
  );
}

export default App;
