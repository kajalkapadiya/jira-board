import "./project.css";
import { Link } from "react-router-dom";

const Project = () => {
  return (
    <>
      <div className="project-dropDown-container">
        <div className="project-block" role="group">
          <span>
            <a className="projects-link" href="/jira/projects" target="_self">
              <Link to="view" className="project-dropdown-text">
                View all projects
              </Link>
            </a>
            <button className="projects-link">
              <Link to="create" className="project-dropdown-text">
                Create project
              </Link>
            </button>
          </span>
        </div>
      </div>
    </>
  );
};

export default Project;
