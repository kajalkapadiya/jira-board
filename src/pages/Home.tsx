import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { database } from "../firebaseConfig";
import { ref, get, set } from "firebase/database";

const Home = () => {
  const { loginWithRedirect, user } = useAuth0();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storeUserInFirebase = async () => {
      console.log(user);
      if (user) {
        const userName = user.email;
        const userNameKey = userName?.replace(/[.#$[\]]/g, "");
        try {
          const userRef = ref(database, `users/${userNameKey}`);
          const snapshot = await get(userRef);
          if (!snapshot.exists()) {
            await set(userRef, {
              username: userName,
            });
          }
        } catch (error) {
          console.error("Error storing user in Firebase:", error);
        }
      }
    };

    storeUserInFirebase();
  }, [user]);

  const handleLogin = () => {
    loginWithRedirect();
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  if (token) {
    return (
      <div className="flex p-10 justify-center items-center h-screen">
        <div className="w-1/2 flex flex-col items-start justify-center">
          <h1 className="text-4xl text-blue-900 font-bold mb-4 ">
            Welcome to Our Website
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Welcome to our project management tool! We're thrilled to have you
            on board. With our platform, you can streamline your project
            workflows, collaborate effortlessly with your team, and stay
            organized every step of the way. Whether you're a seasoned project
            manager or just getting started, we're here to support you on your
            journey to success. Let's create, collaborate, and achieve great
            things together!
          </p>
          <button className="bg-blue-900 text-gray-100 hover:bg-gray-100 hover:text-blue-900 border hover:border-blue-900 p-3 rounded-lg shadow-md transition duration-300 ease-in-out hover:scale-105">
            <Link to="create">Create new project</Link>
          </button>
        </div>
        <div className="w-1/2 mr-3">
          <img src="homePageImg.jpeg" alt="HomePageImage" className="w-full" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex p-10 justify-center items-center h-screen">
        <div className="w-1/2 flex flex-col items-start justify-center">
          <h1 className="text-4xl text-blue-900 font-bold mb-4 ">
            Welcome to Our Website
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Our app is designed to help you manage projects efficiently and
            collaborate with your team effortlessly.To get started and unlock
            all the features, please log in.
          </p>
          <button
            onClick={handleLogin}
            className="hover:bg-gray-100 bg-blue-900 text-gray-100 border hover:border-blue-900 hover:text-blue-900 font-bold py-2 px-4 rounded focus:outline-none"
          >
            Log In
          </button>
        </div>
        <div className="w-1/2 mr-3">
          <img src="homePageImg.jpeg" alt="HomePageImage" className="w-full" />
        </div>
      </div>
    );
  }
};

export default Home;
