import { useLocation, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { useContext } from "react";
import UserContext from "../context/UserContext";

function SubTopic({ id, name, selectedId}) {
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

  console.log(selectedId)

  return (
    <div className="flex flex-row">
      <div className={subTopicBaseClass}>
        <h1>{name}</h1>
        <button
          className="bg-white text-blue-500 font-semibold py-1 px-2 rounded shadow hover:bg-blue-600 hover:text-white"
          onClick={() => console.log("Learn more clicked")}
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
    </div>
  );
}

export default SubTopic;
