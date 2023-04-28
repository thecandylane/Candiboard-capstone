import { useContext, useEffect, useState } from "react"
import useUser from "../hooks/useUser"
import Topic from "./Topic"
import { useNavigate, useLocation } from "react-router-dom"
import UserContext from "../context/UserContext"

const Home = () => {
    const { isLoading, user} = useUser()
    const {getAuthHeaders} = useContext(UserContext)
    const [topics, setTopics] = useState([])
    // const [completedTopics, setCompletedTopics] = useState([])
    const navigate = useNavigate()
    console.log(user)

    const handleFetch = async () => {
        const headers = await getAuthHeaders();
        console.log(headers);
      
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


    const location = useLocation();
    useEffect(() => {
    if (location.pathname === "/home") {
      handleFetch();
    }
    }, [location.pathname]);


    // console.log(topics)
    // console.log(completedTopics)
    const handleClick = (id, data) => {
        navigate(`/topic/${id}`, {state: {topic: data } })
    }


    if (isLoading){
        return <div>Loading...</div>
    }

    const topicsToRender = (
      <div className="grid grid-cols-5 gap-4">
        {topics.map(t => {
          return <Topic  key={t.id} id={t.id} name={t.name}
          onClick={() => handleClick(t.id, t)}
          // completed={completedTopics.includes(t.id, t)}
          />}
      )}

      </div>
    )

    return (
        <div>
            <h1>welcome home {user.username}</h1>
            <ol>
                <li>{user.username}</li>
                <li>{user.email}</li>
                <li>{user.admin}</li>
                {/* <li>{user.subtopics}</li> */}
            </ol>
            <div>
            {topics.length > 0 ? topicsToRender : 'No topics found'}
            </div>
        </div>
    )
}

export default Home
