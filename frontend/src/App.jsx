import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";
import { SideBar } from "../components/SideBar";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex min-h-screen">
          <div className="w-64 fixed h-full">
            <SideBar />
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}