import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTasks } from "react-icons/fa"; // Import task icon
import { BsPerson, BsPeople } from "react-icons/bs"; // Import person icon

const Work: React.FC = () => {
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecentProjects = () => {
      const recentProjectsData = JSON.parse(
        localStorage.getItem("recentProjects") || "[]"
      );
      setRecentProjects(recentProjectsData.slice(0, 10));
    };
    const fetchAssignees = () => {
      const assigneesData = JSON.parse(
        localStorage.getItem("assignees") || "[]"
      );
      setAssignees(assigneesData);
    };

    fetchAssignees();

    fetchRecentProjects();
  }, []);

  const handleProjectClick = (project: any) => {
    const updatedRecentProjects = [
      project,
      ...recentProjects.filter((p) => p.projectName !== project.projectName),
    ].slice(0, 10);
    localStorage.setItem(
      "recentProjects",
      JSON.stringify(updatedRecentProjects)
    );
    setRecentProjects(updatedRecentProjects);
  };

  return (
    <div className="grid grid-cols-1 p-10 gap-6">
      {/* Recent Projects */}
      <div className="bg-gray-100 shadow-md rounded-lg p-6 overflow-x-auto whitespace-nowrap">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          Recent Projects
        </h1>
        <div className="flex space-x-4">
          {recentProjects.map((project, index) => (
            <div key={index} className="inline-block max-w-xs">
              <div className="bg-white border border-gray-100 hover:border-blue-900 transition duration-300 ease-in-out hover:scale-105 shadow-md rounded-md p-6 hover:shadow-lg transition duration-300">
                <Link
                  to={`/project/${project.projectName}`}
                  className="text-blue-900 hover:underline flex items-center mb-2"
                  onClick={() => handleProjectClick(project)}
                >
                  <FaTasks className="mr-2" />
                  <h2 className="text-xl font-semibold truncate">
                    {project.projectName}
                  </h2>
                </Link>
                <p className="text-gray-700 mb-2 overflow-hidden line-clamp-3 h-16">
                  {project.projectDescription}
                </p>
                <div className="flex justify-between items-center bg-gray-100 p-3">
                  <BsPeople className="mr-2 text-blue-900 transition duration-300 ease-in-out transform hover:scale-105" />
                  <span className="flex items-center text-blue-900">
                    <BsPerson />
                    <span className="ml-1">
                      {project.projectOwner ? project.projectOwner : ""}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Work */}
      <div className="bg-gray-100 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          Assigned to me
        </h1>
        <ul>
          {assignees.map((assignee, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-3 border-b border-gray-300"
            >
              <span className="flex items-center">
                <BsPerson className="mr-2" />
                {assignee}
              </span>
              <span>active</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Work;
