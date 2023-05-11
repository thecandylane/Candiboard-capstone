import { useContext, useEffect, useState } from "react"
import UserContext from "../context/UserContext"
import { useNavigate } from "react-router-dom";


const SCard = ({ id, name, description, length, resources }) => {
  const [priority, setPriority] = useState(0)
  const { getAuthHeaders, user } = useContext(UserContext)
  const navigate = useNavigate()

  const handlePriorityPatch = async (id, newPriority) => {
    const headers = await getAuthHeaders()
    fetch(`users/${user.id}/subtopic_preferences/${id}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ 'priority': newPriority })
    })
      .then(r => r.json())
      .then(data => console.log('data returned from priority patch: ', data))
  }

  const handlePriorityChange = (e) => {
    const newPriority = parseInt(e.target.value);
    // console.log('new Priority: ', newPriority)
    setPriority(newPriority);
    handlePriorityPatch(id, newPriority);
  };



  useEffect(() => {
    const handleFetch = async () => {
      const headers = await getAuthHeaders()
      fetch(`/users/${user.id}/subtopic_preferences/${id}`, {
        headers: headers
      })
        .then(r => r.json())
        .then(data => {
          // console.log('data from og fetch: ', data)
          // console.log('data.priority from og fetch: ', data.priority)
          // console.log('--------------------------------')
          setPriority(data.priority)
        })

    }
    handleFetch()
  }, [])

  console.log(id)
  console.log(resources)

  //need to add route that incorporates the user id as well as the subtopic_id ^^ because im not the only one that may have chosen that subtopic yfm
  //patch request will be to route : /users/${user_id}/subtopic_preferences/${subtopic_id}
  return (
    <div className="flex justify-center">
      <div className=" w-1/4 flex flex-col space-y-4 bg-blue-100 border-2 border-blue-300 rounded-lg shadow-md p-4 my-2">
        <h1 className="text-xl font-bold">Subtopic Name: {name}</h1>
        <p className="text-base">Description: {description}</p>
        {resources.map((resource) => (
          <p className="text-base">Resource:
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline inline-block">{resource.title}</a>
          </p>
        ))}
        <div>
          <label htmlFor={`priority-${id}`} className="text-base">
            Priority: {priority}
          </label>
          <input
            type="range"
            id={`priority-${id}`}
            name={`priority-${id}`}
            min="1"
            max={length}
            value={priority}
            onChange={handlePriorityChange}
            className="w-full mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SCard