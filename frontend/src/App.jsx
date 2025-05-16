import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Article from "./pages/Product";
import Stock from "./pages/Stock";
import Client from "./pages/Client";
import Home from "./pages/Home";

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <Router>
      <div>
        {user && <SideBar />}
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/article" element={<Article />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/client" element={<Client />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
