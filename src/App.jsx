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
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './features/auth/authSlice';
import api from './api/axios';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile', { withCredentials: true });
        console.log("am her:",res)
        dispatch(setCredentials(res.data.data));
      } catch (err) {
        console.error("🔒 Not logged in or token expired");
      }
    };

    fetchProfile();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />

<Route path="/admin/dashboard" element={<SuperAdminDashboard />}/>
    <Route path="/collection/:categoryName" element={<CategoryPage />} />


<Route path="/collections" element={<CollectionPage />} />
<Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
       <Route path="/user/reset-password" element={<ResetPassword />} />

        <Route path="/user/register" element={<Register />}/>
        <Route path="/seller/register" element={<RegisterSeller/>}/>
    </Routes>
  );
}

export default App;
