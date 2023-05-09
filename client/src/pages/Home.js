import { useContext, useEffect, useState, useMemo } from "react"
import useUser from "../hooks/useUser"
import Topic from "./Topic"
import { useNavigate, useLocation } from "react-router-dom"
import UserContext from "../context/UserContext"

const Home = () => {
  const { isLoading, user } = useUser()
  const { getAuthHeaders } = useContext(UserContext)
  const [topics, setTopics] = useState([])
  const [chosenSubs, setChosenSubs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSubs = async() => {
    const headers = await getAuthHeaders()
    fetch(`/users/${user.id}/subtopic_preferences`, {
      headers: headers
    })
    .then(r => {
      if (r.ok) {
        return r.json()
        } else {
          console.error('sum hapn')
          }
          })
          .then(data => {
            setChosenSubs(data)
            // console.log(data)
    })
  }
  fetchSubs()
  }, [])
  // console.log(chosenSubs)

  const isTopicChosen = useMemo(() => {
    return (topicId) => {
      return chosenSubs.some((sub) => sub.topic_id === topicId);
    };
  }, [chosenSubs]);

  const handleFetch = async () => {
    const headers = await getAuthHeaders();

    fetch('/topics', {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        setTopics(data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  useEffect(() => {
    handleFetch()
  }, [])

  const handleManageSubtopics = () => {
    navigate('/grading', {state: {user:user}})
  }


  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/home") {
      handleFetch();
    }
  }, [location.pathname]);


  const handleClick = (id, data) => {

    navigate(`/topic/${id}`, { state: { topic: data } })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const topicsToRender = (
    <div className="grid grid-cols-5 gap-4">
      {topics.map(t => {
        return <Topic key={t.id} id={t.id} name={t.name}
          onClick={() => handleClick(t.id, t)}
          chosen={isTopicChosen(t.id)}
        />
      }
      )}

    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6">
    <h1 className="text-3xl font-bold mb-4">
      Please choose your subtopic preferences, {user.username}
    </h1>
    <div className="bg-white p-4 rounded-md shadow-md mb-6">
      <ol className="list-decimal list-inside">
        <li className="text-gray-800">Username: {user.username}</li>
        <li className="text-gray-800">Email: {user.email}</li>
        <li className="text-gray-800">Admin: {user.admin ? 'Yes' : 'No'}</li>
      </ol>
    </div>
    <div>
      {topics.length > 0 ? (
        <div className="mb-4">{topicsToRender}</div>
      ) : (
        <p className="text-gray-600">No topics found</p>
      )}
      {chosenSubs.length >= 4 ? (
        <button
          onClick={handleManageSubtopics}
          className="bg-red-400 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
        >
          Click to manage subtopics
        </button>
      ) : null}
    </div>
  </div>
);
}

export default Home





