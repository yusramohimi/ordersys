import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import SideBar from "./components/SideBar";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Login";
import Article from "./pages/Client/Product";
import Stock from "./pages/Admin/Stock";
import Client from "./pages/Client/Client";
import OrderList from "./pages/Admin/OrderList";
import ClientsList from "./pages/Admin/ClientsList";
import AddLivreur from "./pages/Admin/AddLivreur";

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <Router>
      <div>
        {user && <SideBar />}
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard/admin" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/article" element={<Article />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/client" element={<Client />} />
            <Route path="/orders/admin" element={<OrderList />} />
            <Route path="/clients-list" element={<ClientsList/>}/>
            <Route path="/admin/livreurs" element={<AddLivreur/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
