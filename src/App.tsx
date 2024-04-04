import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header/header";
import Layout from "./components/router/Layout";
import LeftMenu from "./components/verticalDropDown/LeftMenu";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownChange = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  useEffect(() => {
    const getTokenAndStore = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          localStorage.setItem("token", token);
        } catch (error) {
          console.error("Error during login:", error);
        }
      }
    };

    getTokenAndStore();
  }, [isAuthenticated]);

  return (
    <>
      <Header />
      <div className="relative h-screen flex overflow-hidden">
        <LeftMenu onDropdownChange={handleDropdownChange} />
        <div
          className={`flex-1 overflow-auto ${
            isDropdownOpen ? "ml-52" : ""
          } transition-margin`}
        >
          <div className="content">
            <Layout />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
