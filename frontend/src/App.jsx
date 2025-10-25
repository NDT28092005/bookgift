import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/frontend/pages/Home';
import About from './components/frontend/pages/About';
import Login from './components/frontend/pages/Login';
import Register from './components/frontend/pages/Register';
import VerifyEmail from './components/frontend/pages/VerifyEmail';
import { AuthProvider } from './context/AuthProvider';
import LoginAdmin from './components/admin/pages/LoginAdmin';
import AdminDashboard from './components/admin/pages/AdminDashboard';
import AdminGiftPackages from './components/admin/pages/AdminGiftPackages';
import PrivateAdminRoute from './components/admin/PrivateAdminRoute';
import './assets/css/style.scss';
import EditGiftPackage from './components/admin/pages/EditGiftPackage';
import AdminAddGiftPackage from './components/admin/pages/AdminAddGiftPackage';
import AdminOrders from './components/admin/pages/AdminOrders';
import AdminGiftCategories from './components/admin/pages/AdminGiftCategories';
import GiftPackageList from './components/gifts/GiftPackageList';
import GiftPackageDetail from './components/gifts/GiftPackageDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Frontend Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/gifts" element={<GiftPackageList />} />
          <Route path="/gifts/:id" element={<GiftPackageDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route
            path="/admin"
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/admin/gift-packages"
            element={
              <PrivateAdminRoute>
                <AdminGiftPackages />
              </PrivateAdminRoute>
            }
          />
          <Route path="/admin/gift-packages/edit/:id" element={<EditGiftPackage />} />
          <Route path="/admin/gift-packages/create" element={<AdminAddGiftPackage />} />
          <Route
            path="/admin/orders"
            element={
              <PrivateAdminRoute>
                <AdminOrders />
              </PrivateAdminRoute>
            }
          />
          <Route path="/admin/gift-categories" element={<AdminGiftCategories />} />

          {/* Nếu không tìm thấy route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;