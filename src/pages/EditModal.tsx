import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Button } from "antd";

interface EditModalProps {
  projectKey: string;
  closeModal: () => void;
  projectDetails: any;
  user: any;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  projectKey,
  closeModal,
  projectDetails,
  user,
  isEditModalOpen,
  setIsEditModalOpen,
}) => {
  const navigate = useNavigate();

  const [updatedProjectDetails, setUpdatedProjectDetails] =
    useState(projectDetails);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProjectDetails({ ...updatedProjectDetails, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const resp = await fetch(
        `https://project-management-tool-2dcae-default-rtdb.firebaseio.com/${user?.name}/${projectKey}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(updatedProjectDetails),
        }
      );

      if (resp.ok) {
        toast.success("Project Updated Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        closeModal();
        navigate(`/project/${updatedProjectDetails.projectName}`);
      } else {
        toast.error("Error Updating Project.", {
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
    } catch (error) {
      console.error("An error occurred while updating the project:", error);
      alert("An error occurred while updating the project");
    }
  };

  return (
    <Modal
      title={
        <span className="text-blue-900 font-bold text-xl">Edit Project</span>
      }
      open={isEditModalOpen}
      onCancel={() => setIsEditModalOpen(false)}
      footer={[
        <Button
          key="cancel"
          onClick={closeModal}
          className="mr-2 bg-gray-100 text-blue-900 hover:bg-blue-900 hover:text-gray-100 "
        >
          Cancel
        </Button>,
        <Button
          key="update"
          className="bg-blue-900 text-gray-100 hover:bg-gray-100 hover:text-blue-900"
          onClick={handleUpdate}
        >
          Update
        </Button>,
      ]}
    >
      <div className="flex flex-col space-y-4">
        <label className="text-blue-900 font-bold">Project Name</label>
        <input
          type="text"
          name="projectName"
          value={updatedProjectDetails.projectName}
          onChange={handleChange}
          className="border border-gray-100 rounded-md p-2 focus:outline-none focus:border-blue-500"
        />

        <label className="text-blue-900 font-bold">Project Description</label>
        <input
          type="text"
          name="projectDescription"
          value={updatedProjectDetails.projectDescription}
          onChange={handleChange}
          className="border border-gray-100 rounded-md p-2 focus:outline-none focus:border-blue-500"
        />

        <label className="text-blue-900 font-bold">Project Start Date</label>
        <input
          type="date"
          name="projectStartDate"
          value={updatedProjectDetails.projectStartDate}
          onChange={handleChange}
          className="border border-gray-100 rounded-md p-2 focus:outline-none focus:border-blue-500"
        />

        <label className="text-blue-900 font-bold">Project End Date</label>
        <input
          type="date"
          name="projectEndDate"
          value={updatedProjectDetails.projectEndDate}
          onChange={handleChange}
          className="border border-gray-100 rounded-md p-2 focus:outline-none focus:border-blue-500"
        />

        <label className="text-blue-900 font-bold">Project Status</label>
        <input
          type="text"
          name="projectStatus"
          value={updatedProjectDetails.projectStatus}
          onChange={handleChange}
          className="border border-gray-100 rounded-md p-2 focus:outline-none focus:border-blue-500"
        />
      </div>
    </Modal>
  );
};

export default EditModal;
