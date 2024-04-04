import { useState, useEffect } from "react";
import UploadImage from "../assets/UploadImage";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Working from "../assets/Working";
import Department from "../assets/Department";
import Organisation from "../assets/Organisation";
import Location from "../assets/Location";
import Email from "../assets/Email";

const Account = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userImage = params.get("userImage");
  const { user } = useAuth0();
  const [isImgDropdownOpen, setIsImgDropdownOpen] = useState(false);
  const [isHeaderImageSet, setIsHeaderImageSet] = useState(false);
  const userEmail = user?.email || "";
  const userProjects = JSON.parse(localStorage.getItem(userEmail) || "[]");
  const [softwareDevelopment, setSoftwareDevelopment] = useState(() => {
    const savedValue = localStorage.getItem("softwareDevelopment");
    return savedValue !== null ? savedValue : "software development";
  });

  const [department, setDepartment] = useState(() => {
    const savedValue = localStorage.getItem("department");
    return savedValue !== null ? savedValue : "Your department";
  });

  const [organisation, setOrganisation] = useState(() => {
    const savedValue = localStorage.getItem("organisation");
    return savedValue !== null ? savedValue : "Your organisation";
  });

  const [locationOfUser, setLocationOfUser] = useState(() => {
    const savedValue = localStorage.getItem("location");
    return savedValue !== null ? savedValue : "Your location";
  });
  const navigate = useNavigate();

  const handleProjectClick = (projectName: string) => {
    navigate(`/project/${projectName}`);
  };

  useEffect(() => {
    localStorage.setItem("softwareDevelopment", softwareDevelopment);
    localStorage.setItem("department", department);
    localStorage.setItem("organisation", organisation);
    localStorage.setItem("location", locationOfUser);
  }, [softwareDevelopment, department, organisation, location]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(event.target.value);
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (event.key === "Enter") {
      localStorage.setItem(
        setState.name,
        (event.target as HTMLInputElement).value
      );
      setState((event.target as HTMLInputElement).value);
    }
  };

  console.log(user);
  const date = user?.updated_at;

  const toggleImgDropdown = () => {
    setIsImgDropdownOpen(!isImgDropdownOpen);
  };

  const handleRemoveHeaderImage = () => {
    const header = document.querySelector(".header1") as HTMLElement;
    if (header) {
      header.style.backgroundImage = "";
    }
    setIsHeaderImageSet(false);
    setIsImgDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) {
      return;
    }

    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const imageSrc = e?.target?.result as string;
      const header = document.querySelector(".header1") as HTMLElement;

      if (header) {
        header.style.backgroundImage = `url('${imageSrc}')`;
        header.style.backgroundSize = "cover"; // Ensure image covers the header area
        header.style.backgroundPosition = "center"; // Center the image
      }
    };

    reader.readAsDataURL(file);

    setIsHeaderImageSet(true);
    setIsImgDropdownOpen(false);
  };

  return (
    <div className="p-8">
      <div className="relative rounded-md shadow-md  overflow-hidden">
        {/* cover img */}
        <div className="relative top-0 bg-white left-0 w-full h-112 rounded-t-md">
          <header
            className="flex items-center justify-center p-4 group header1"
            // onClick={toggleImgDropdown}
          >
            <div className="flex flex-col items-center justify-center ">
              <UploadImage />
              <p className="mt-2 text-sm">Update your header image</p>
              <input
                type="file"
                accept=".jpg,.png"
                className="hidden absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer group-hover:block"
                onChange={handleFileChange}
              />
            </div>
          </header>
          {isImgDropdownOpen && (
            <div className="absolute flex bg-white flex-col bg-gray-100 top-12 right-72 mt-2 bg-white p-2 rounded shadow-md">
              {isHeaderImageSet && (
                <button onClick={handleRemoveHeaderImage}>
                  Remove header image
                </button>
              )}
            </div>
          )}
        </div>

        {/* img */}
        <div className="absolute top-2 left5 block mt-10 ml-10">
          <div className="h-32 w-32 bg-red-600 rounded-full cursor-default flex items-center justify-center shadow-md border border-gray-100">
            <div className="text-gray-100 text-6xl">{userImage}</div>
          </div>
        </div>

        {/* details */}
        <div className="mt-112 p-3 h-28 bg-blue-900">
          <div className="absolute ml-52 mt-2 bottom-0 left-0 p-3 text-white">
            <h1 className="text-2xl font-bold mr-3">{user?.name}</h1>
            <span className="text-sm">{softwareDevelopment}</span>

            <div className="flex items-center">
              <span className="mr-1 text-gray-600">Language:</span>
              <span className="mr-3 text-gray-600">{user?.locale}</span>
              <span className="mr-3 text-gray-600">
                Updated at {date?.split("T")[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mt-4 mb-4 text-blue-900">
          Profile and visibility
        </h1>
        <div className="mb-4">
          <p className="mb-2">
            Manage your personal information, and control which information
            other people see and apps may access.
          </p>
          <a
            href="https://support.atlassian.com/atlassian-account/docs/update-your-profile-and-visibility-settings/"
            className="text-blue-500 hover:underline"
          >
            Learn more about your profile and visibility
            <span className="mx-1">or</span>
          </a>
          <a
            href="https://www.atlassian.com/legal/privacy-policy#what-this-policy-covers"
            className="text-blue-500 hover:underline"
          >
            view our privacy policy.
          </a>
        </div>

        <h3 className="text-lg font-semibold mt-3 mb-4 text-blue-900">
          Manage your account
        </h3>

        <div className="flex p-5 md:p-4 rounded-lg shadow-md bg-white">
          <div className="border border-gray-100 w-40% px-3 py-2 mr-3 rounded-md focus:outline-none focus:border-blue-500">
            <h4 className="text-blue-900 font-bold">About</h4>
            <div className="flex flex-col md:flex-row ">
              <div className="flex items-center mb-2">
                <span className="ml-3">
                  <Working />
                </span>
                <input
                  type="text"
                  value={softwareDevelopment}
                  onChange={(e) => handleInputChange(e, setSoftwareDevelopment)}
                  onKeyDown={(e) => handleKeyPress(e, setSoftwareDevelopment)}
                  className="border border-gray-100 px-3 text-gray-600 py-2 rounded-md focus:outline-none focus:border-blue-900"
                />
              </div>
              <div className="flex items-center mb-2">
                <span className="ml-3">
                  <Department />
                </span>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => handleInputChange(e, setDepartment)}
                  onKeyDown={(e) => handleKeyPress(e, setDepartment)}
                  className="border border-gray-100 px-3 py-2 text-gray-600 rounded-md focus:outline-none focus:border-blue-900"
                />
              </div>
              <div className="flex items-center mb-2">
                <span className="ml-3">
                  <Organisation />
                </span>
                <input
                  type="text"
                  value={organisation}
                  onChange={(e) => handleInputChange(e, setOrganisation)}
                  onKeyDown={(e) => handleKeyPress(e, setOrganisation)}
                  className="border border-gray-100 px-3 py-2 text-gray-600 rounded-md focus:outline-none focus:border-blue-900"
                />
              </div>
              <div className="flex items-center">
                <span className="ml-3">
                  <Location />
                </span>
                <input
                  type="text"
                  value={locationOfUser}
                  onChange={(e) => handleInputChange(e, setLocationOfUser)}
                  onKeyDown={(e) => handleKeyPress(e, setLocationOfUser)}
                  className="border border-gray-100 px-3 py-2 text-gray-600 rounded-md focus:outline-none focus:border-blue-900"
                />
              </div>
            </div>

            <h4 className="text-blue-900 font-bold mt-4">Contact</h4>
            <div className="flex items-center mt-2">
              <span className="mr-3">
                <Email />
              </span>
              <span className="text-gray-600">{user?.email}</span>
            </div>
          </div>
          <div className="border border-gray-100 w-60% px-3 py-2 mr-3 rounded-md focus:outline-none focus:border-blue-500">
            <h4>Worked on</h4>
            <div>
              {userProjects.map((project: any, index: number) => (
                <div
                  key={index}
                  onClick={() => handleProjectClick(project.projectName)}
                  className="card p-2 cursor-pointer hover:bg-blue-100"
                >
                  <div className="flex">
                    <img
                      className="mr-3"
                      src="https://iview-internal.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10316?size=xsmall"
                      alt=""
                    />
                    <h4 className="text-lg font-semibold text-gray-600 hover:bg-gray-100">
                      {project.projectName}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
