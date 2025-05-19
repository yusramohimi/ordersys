import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import SideBar from "./pages/Admin/SideBar";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Login";
import Article from "./pages/Client/Product";
import Stock from "./pages/Admin/Stock";
import OrderList from "./pages/Admin/OrderList";
import ClientsList from "./pages/Admin/ClientsList";
import AddLivreur from "./pages/Admin/AddLivreur";
import LivreurList from "./pages/Admin/LivreurList";

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
            <Route path="/article" element={<Article />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="//admin/orders" element={<OrderList />} />
            <Route path="/admin/clientslist" element={<ClientsList/>}/>
            <Route path="/admin/livreurs" element={<AddLivreur/>}/>
            <Route path="/admin/livreurlist" element={<LivreurList/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
