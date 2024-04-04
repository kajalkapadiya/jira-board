import { useState } from "react";
import "./header.css";
import { useAuth0 } from "@auth0/auth0-react";
import Project from "../projectForm/Project";
import { Link } from "react-router-dom";
import HomeIcon from "../../assets/HomeIcon";
import ArrowIcon from "../../assets/ArrowIcon";
import ManageAccount from "../../assets/ManageAccount";
import JiraSoftware from "../../assets/JiraSoftware";

const Header = () => {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectDropDown, setprojectDropDown] = useState(false);

  const loginHandler = () => {
    loginWithRedirect();
  };

  const logoutHandler = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("projectDetails");
    localStorage.removeItem("projectKey");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleprojectDropDown = () => {
    setprojectDropDown(!projectDropDown);
  };

  const closeProjectDropDown = () => {
    setTimeout(() => {
      setprojectDropDown(false);
    }, 2000);
  };

  const getFirstLetter = (name: string) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return "";
  };

  return (
    <>
      <div>
        <header className="header">
          <nav className="header-left">
            <div role="presentation">
              <Link to="/">
                <HomeIcon />
              </Link>
            </div>
            <div className="outer-menu">
              <div className="div-btn mx-2">
                <Link to="work">
                  <JiraSoftware />
                </Link>
              </div>
              {/* Your Work */}
              <div role="listitem" className="div-btn">
                <div className="inner-div">
                  <Link to="work" className="work">
                    Your work
                  </Link>
                  <span className="work-span">
                    <ArrowIcon />
                  </span>
                </div>
              </div>

              {/* Projects */}
              <div role="listitem" className="div-btn">
                <div
                  className="inner-div"
                  onMouseEnter={toggleprojectDropDown}
                  onMouseLeave={closeProjectDropDown}
                >
                  <Link to="view" className="projects">
                    Projects
                  </Link>
                  <ArrowIcon />
                </div>
                {projectDropDown && <Project />}
              </div>

              {/* create */}
              <div role="listitem" className="div-btn">
                <div className="inner-div">
                  <Link to="create" className="create">
                    Create
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <div className="header-right">
            <div className="inner-right-header">
              <div>
                {/* Login DropDown */}
                {isAuthenticated ? (
                  <div>
                    <div className="dropdown">
                      <button className="login-btn" onClick={toggleDropdown}>
                        {user && user.name ? (
                          <div className="login-initial">
                            {getFirstLetter(user.name)}
                          </div>
                        ) : (
                          "Log In"
                        )}
                      </button>
                      {dropdownOpen && (
                        <div className="dropdown-content">
                          <div className="dropdown-name">Account</div>
                          <div className="dropdown-user-details">
                            <div className="flex">
                              <button
                                className="login-btn"
                                onClick={toggleDropdown}
                              >
                                {user && user.name ? (
                                  <div className="login-initial">
                                    {getFirstLetter(user.name)}
                                  </div>
                                ) : (
                                  "Log In"
                                )}
                              </button>
                              <p className="ml-3">{user?.name}</p>
                            </div>
                            <Link
                              to={{
                                pathname: "account",
                                search: `?userImage=${
                                  user && user.name
                                    ? encodeURIComponent(
                                        getFirstLetter(user.name)
                                      )
                                    : ""
                                }`,
                              }}
                              className="flex justify-between w-full mt-3 space-x-12 h-7 hover:bg-gray-100 hover:text-gray-800"
                            >
                              <span className="flex flex-grow">
                                <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                                  Manage account
                                </span>
                              </span>
                              <span className="flex">
                                <span className="inline-block flex-shrink-0 leading-none w-16 h-16">
                                  <ManageAccount />
                                </span>
                              </span>
                            </Link>
                          </div>

                          <div className="dropdown-divider"></div>

                          <button
                            className="logout-btn"
                            onClick={logoutHandler}
                          >
                            Log Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <button onClick={loginHandler}>Log In</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
