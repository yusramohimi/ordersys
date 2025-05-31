import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Login";
import OrderList from "./pages/Admin/OrderList";
import ClientsList from "./pages/Admin/ClientsList";
import AddLivreur from "./pages/Admin/AddLivreur";
import LivreurList from "./pages/Admin/LivreurList";
import AdminLogs from "./pages/Admin/adminLogs";
import OrderListLiv from "./pages/Livreur/OrderListLiv";
import DashboardLiv from "./pages/Livreur/DashboardLiv";
import StockMovement from "./pages/Admin/StockMovement";
import ProfileAdmin from "./pages/Admin/ProfileAdmin";
import ProfileLivreur from "./pages/Livreur/ProfileLivreur";
import ClientDashboard from "./pages/Client/ClientDashboard";

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <Router>
      <div>
        {user && <SideBarLiv />}
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="admin/stock" element={<StockMovement />} />
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/clientslist" element={<ClientsList />} />
            <Route path="/admin/livreurs" element={<AddLivreur />} />
            <Route path="/admin/livreurslist" element={<LivreurList />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
            <Route path="/livreur/orders" element={<OrderListLiv />} />
            <Route path="/livreur/dashboard" element={<DashboardLiv />} />
            <Route path="/admin/stock" element={<StockMovement/>}/>
            <Route path="/admin/profile" element={<ProfileAdmin/>}/>
            <Route path="/livreur/profile" element={<ProfileLivreur/>}/>
            <Route path="/client/dashboard" element={<ClientDashboard/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
