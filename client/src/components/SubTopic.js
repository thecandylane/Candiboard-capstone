import { useLocation, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { useContext, useState } from "react";
import UserContext from "../context/UserContext";

function SubTopic({ id, name, selectedId, description, resources}) {
  const [showDescription, setShowDescription] = useState(false)
  const { user } = useUser();
  const { getAuthHeaders } = useContext(UserContext);
  const navigate = useNavigate();
  
  const subTopicBaseClass =
    "bg-blue-500 w-40 h-40 p-3 m-2 text-center rounded-md shadow-md transform transition duration-200 hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50";

  const addSubTopicPreference = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/subtopic-preferences`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ user_id: user.id, subtopic_id: id, priority: 0 }),
      });

      if (response.ok) {
        console.log("Subtopic Preference added");
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error adding subtopic preference: ", error);
    }
  };

  const handleClick = () => {
    addSubTopicPreference();
    navigate("/home", {state: {chosenID: selectedId}});
  };

  const handleLearnMoreClick = () => {
    setShowDescription(!showDescription)
  }

  return (
    <div className="flex flex-col items-center m-4">
      <div className={subTopicBaseClass}>
        <h1 className="text-white font-semibold">{name}</h1>
        <button
          className="bg-white text-blue-500 font-semibold my-1 py-1 px-2 rounded shadow hover:bg-blue-600 hover:text-white"
          onClick={handleLearnMoreClick}
        >
          Learn more!
        </button>
        <button
          className="bg-white text-blue-500 font-semibold py-1 px-2 rounded shadow hover:bg-blue-600 hover:text-white"
          onClick={handleClick}
        >
          I agree
        </button>
      </div>
      {showDescription && (
        <div className="bg-white p-4 mt-2 w-64 rounded-md shadow-md">
          <p className="text-gray-800">{description}</p>
          {resources.map((resource) => (
          <p className="text-base">Resource:
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline inline-block">{resource.title}</a>
          </p>
        ))}
        </div>
      )}
    </div>
  );
}


export default SubTopic;
