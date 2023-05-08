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
            console.log(data)
    })
  }
  fetchSubs()
  }, [])
  console.log(chosenSubs)

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
    <div>
      <h1>Please choose choose your subtopic preferences {user.username}</h1>
      <ol>
        <li>{user.username}</li>
        <li>{user.email}</li>
        <li>{user.admin}</li>
      </ol>
      <div>
        {topics.length > 0 ? topicsToRender : 'No topics found'}
        {chosenSubs.length >= 4 ? (
        <button
          onClick={handleManageSubtopics}
          className="bg-red-400 flex justify-center"
        >
          Click to manage subtopics
        </button>
      ) : null}
      </div>
    </div>
  )
}

export default Home
