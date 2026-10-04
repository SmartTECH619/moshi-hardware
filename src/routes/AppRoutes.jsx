import { Route, Routes } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import AdminLogin from '../admin/AdminLogin';
import AdminLayout from '../admin/AdminLayout';
import Dashboard from '../admin/Dashboard';
import AdminProducts from '../admin/AdminProducts';
import AdminOrders from '../admin/AdminOrders';
import AdminOrderDetails from '../admin/AdminOrderDetails';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<CustomerLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
