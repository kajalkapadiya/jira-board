import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { TaskData } from "../../pages/Project";
import { ToastContainer, toast } from "react-toastify";
import { projectUrl } from "../../utils/apiUrls";

export type ProjectDetails = {
  projectName: string;
  projectDescription: string;
  projectStartDate: string;
  projectEndDate: string;
  projectOwner: string;
  projectStatus: string;
  invitedEmails: string[];
  taskData: TaskData[];
  progressData?: TaskData[];
  completedData?: TaskData[];
};

const ProjectCreationForm: React.FC<{}> = () => {
  const { user } = useAuth0();
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectStartDate, setProjectStartDate] = useState<string>("");
  const [projectEndDate, setProjectEndDate] = useState<string>("");
  const [projectStatus, setProjectStatus] = useState<string>("");
  const [isPlaceholderSelected, setIsPlaceholderSelected] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreateProject = async () => {
    const projectOwner: string = user?.name || "";
    const emailOfUser = user?.email;
    const userEmail = emailOfUser?.replace(/[.#$[\]]/g, "");
    const urlOfProject = userEmail ? projectUrl(userEmail) : "";

    const projectDetails: ProjectDetails = {
      projectName,
      projectDescription,
      projectStartDate,
      projectEndDate,
      projectOwner,
      projectStatus,
      invitedEmails: [projectOwner],
      taskData: [],
      progressData: [],
      completedData: [],
    };

    try {
      const resp = await fetch(urlOfProject, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(projectDetails),
      });

      if (resp.ok) {
        toast.success("New Project Created", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("Error Storing Data.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      navigate(`/project/${projectName}`, { state: { projectDetails } });
    } catch (error) {
      alert("An error occurred while storing project details");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProjectStatus(value);
    setIsPlaceholderSelected(value !== ""); // Set isPlaceholderSelected to true if an option is selected
  };

  return (
    <div className="flex justify-center items-center my-20 h-full">
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <h1 className="text-2xl text-blue-900 font-semibold mb-4 text-center">
          Create a New Project
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Fill out the form below to create a new project and start
          collaborating with your team!
        </p>
        <label className="text-blue-900">Project Title</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
        />
        <label className="text-blue-900">Project Description</label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Project Description"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
        />
        <label className="text-blue-900">Start Date</label>
        <input
          type="text"
          placeholder="MM/DD/YYYY"
          onFocus={(e) => (e.target.type = "date")}
          value={projectStartDate}
          onChange={(e) => setProjectStartDate(e.target.value)}
          id="custom-date-input"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
        />
        <label className="text-blue-900">End Date</label>
        <input
          type="text"
          placeholder="MM/DD/YYYY"
          onFocus={(e) => (e.target.type = "date")}
          value={projectEndDate}
          onChange={(e) => setProjectEndDate(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
        />
        <label className="text-blue-900">Project Status</label>
        <select
          value={projectStatus}
          onChange={handleChange}
          className={`w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${
            !isPlaceholderSelected ? "text-gray-400" : "text-blue-900"
          }`}
        >
          <option value="">None</option>
          <option value="active">Active</option>
          <option value="progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>

        <button
          onClick={handleCreateProject}
          className="w-full px-6 py-2 bg-blue-900 text-gray-100 rounded-md hover:bg-gray-100 hover:text-blue-900 hover:border border-blue-900 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
        >
          Create Project
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ProjectCreationForm;
