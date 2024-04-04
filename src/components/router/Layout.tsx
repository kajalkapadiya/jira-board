import { Routes, Route } from "react-router-dom";
import ProjectPage from "../../pages/Project";
import ProjectListPage from "../../pages/ProjectListPage";
import ProjectCreationForm from "../projectForm/ProjectCreationForm";
import Home from "../../pages/Home";
import PrivateRoute from "./PrivateRoute";
import Account from "../../pages/Account";
import Work from "../../pages/Work";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PrivateRoute />}>
        <Route path="/create" element={<ProjectCreationForm />} />
        <Route path="/project/:projectName" element={<ProjectPage />} />
        <Route path="/view" element={<ProjectListPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/work" element={<Work />} />
      </Route>
    </Routes>
  );
};

export default Layout;
