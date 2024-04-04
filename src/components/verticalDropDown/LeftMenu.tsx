import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./LeftMenu.css";

interface LeftMenuProps {
  onDropdownChange: (isOpen: boolean) => void;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ onDropdownChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth0();
  const navigate = useNavigate();
  const userEmail = user?.email || "";
  const userProjects = JSON.parse(localStorage.getItem(userEmail) || "[]");

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleButtonClick = () => {
    setIsHovered(true);
    setIsDropdownOpen(!isDropdownOpen);
    onDropdownChange(!isDropdownOpen);
  };

  const handleProjectClick = (projectName: string) => {
    navigate(`/project/${projectName}`);
  };

  return (
    <div className="relative">
      <div className={`${isDropdownOpen ? "line-open" : "line"}`}></div>
      <button
        className={`bg-blue-900 text-gray-100 ${
          isDropdownOpen ? "expand-btn-open" : "expand-btn"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleButtonClick}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          role="presentation"
          style={{
            verticalAlign: "middle",
            transform: isHovered ? "rotate(180deg)" : "rotate(0deg)",
            color: isHovered ? "white" : "currentColor",
          }}
        >
          <path
            d="M10.294 9.698a.988.988 0 010-1.407 1.01 1.01 0 011.419 0l2.965 2.94a1.09 1.09 0 010 1.548l-2.955 2.93a1.01 1.01 0 01-1.42 0 .988.988 0 010-1.407l2.318-2.297-2.327-2.307z"
            fill="currentColor"
            fillRule="evenodd"
          ></path>
        </svg>
      </button>
      {isDropdownOpen && (
        <>
          <div className="dropdown1 ">
            <div className="relative flex items-center w-full min-h-40px p-2 border-none text-base outline-none text-current cursor-pointer rounded-md bg-transparent">
              <span className="flex items-center justify-between w-full flex-1 gap-12px">
                <span className="flex items-center justify-center flex-shrink-0">
                  <div className="inline-block relative outline-none">
                    <span className="h-6 w-6 items-center bg-transparent rounded-md cursor-pointer flex flex-col justify-center outline-none transition duration-200 ease-in-out shadow-none border-none m-2 p-0">
                      <img
                        src="https://iview-internal.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10414?size=xxlarge"
                        alt=""
                        className="border rounded-md"
                      />
                    </span>
                  </div>
                </span>
                <span className="flex justify-center flex-col flex-grow line-height-[16px] outline-none overflow-hidden text-left">
                  <h2 className="text-base font-semibold tracking-tight text-blue-900">
                    {user?.name?.split(" ")[0]} - Tasks
                  </h2>
                  <span className="mt-1 text-gray-400 text-xs block overflow-hidden truncate whitespace-nowrap">
                    Software project
                  </span>
                </span>
              </span>
            </div>

            {/* user's work */}

            <div className="card-list">
              {userProjects.map((project: any, index: number) => (
                <div
                  key={index}
                  onClick={() => handleProjectClick(project.projectName)}
                  className="card p-2 cursor-pointer hover:bg-blue-100"
                >
                  <div className="card-content" onClick={handleButtonClick}>
                    <h3 className="text-lg font-semibold text-blue-900 hover:bg-gray-100">
                      {project.projectName}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftMenu;
