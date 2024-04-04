import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import { projectUrl } from "../../utils/apiUrls";
import { ProjectDetails } from "../projectForm/ProjectCreationForm";

interface InviteFormProps {
  onSubmit: (email: string) => void;
  projectDetails: ProjectDetails | null;
  projectKey: string;
}

const InviteForm: React.FC<InviteFormProps> = ({
  onSubmit,
  projectDetails,
}) => {
  const { projectName } = useParams<{ projectName: string | undefined }>();
  const [email, setEmail] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const { user } = useAuth0();

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!projectName || !isValidEmail) {
      return;
    }

    onSubmit(email);
    let updatedProjectDetails: ProjectDetails | null = null;
    if (projectDetails) {
      updatedProjectDetails = {
        ...projectDetails,
        invitedEmails: [...projectDetails.invitedEmails, email],
      };
    }

    const invitedEmail = email?.replace(/[.#$[\]]/g, "");
    const url = projectUrl(invitedEmail);

    try {
      const response = await fetch(url);
      if (response.ok) {
        await fetch(url, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(updatedProjectDetails),
        });
      } else {
        // Email doesn't exist in Firebase, add email and project
        await fetch(url, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ [projectName]: true }), // Create an empty project under the email
        });
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error("An error occurred while inviting the user", {
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

    toast.success("🦄 Wow so easy!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    setEmail("");
    setIsValidEmail(true);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  return (
    <div className="flex flex-row mt-6 items-center">
      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="Invite people"
        className={`flex-grow px-4 py-2 mr-4 border border-gray-100 hover:border-blue-900 rounded-md focus:outline-none ${
          isValidEmail ? "border-gray-100" : "border-red-600"
        }`}
        required
      />
      {!isValidEmail && (
        <p className="text-red-600 mr-4 text-sm">
          *Please enter a valid email address
        </p>
      )}
      <button
        onClick={handleInvite}
        className="font-bold py-2 px-10 bg-blue-900 text-gray-100 text-white rounded-md hover:bg-gray-100 hover:text-blue-900 hover:border border-blue-900 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
      >
        Invite
      </button>
      <ToastContainer />
    </div>
  );
};

export default InviteForm;
