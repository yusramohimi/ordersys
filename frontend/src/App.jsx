import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import SideBar from "./pages/Admin/SideBar";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Login";
import Stock from "./pages/Admin/StockMovement";
import OrderList from "./pages/Admin/OrderList";
import ClientsList from "./pages/Admin/ClientsList";
import AddLivreur from "./pages/Admin/AddLivreur";
import LivreurList from "./pages/Admin/LivreurList";
import AdminLogs from "./pages/Admin/adminLogs";
function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <Router>
      <div>
        {user && <SideBar />}
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/stock" element={<Stock />} />
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/admin/clientslist" element={<ClientsList/>}/>
            <Route path="/admin/livreurs" element={<AddLivreur/>}/>
            <Route path="/admin/livreurslist" element={<LivreurList/>}/>
             <Route path="/admin/logs" element={<AdminLogs/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
