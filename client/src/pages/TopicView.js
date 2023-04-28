import { useLocation, useNavigate } from "react-router-dom"
import SubTopic from "../components/SubTopic"
import { useState, useEffect } from "react"

const TopicView = () => {
    // const { chosen, setChosen } = useState(false)
    

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!location.state || !location.state.topic) {
          navigate("/home");
        }
      }, [location.state, navigate]);
    
      // Check if the data is available before using it
      const data = location.state?.topic;
    //   const setCompletedTopics = location.state?.setCompletedTopic;

    // const data = location.state.topic
    // const setCompletedTopics = location.state.setCompletedTopics
    console.log(data)
    const subtopicsToRender = data ? 
     data.subtopics.map((st) => {
        return (
          <SubTopic
            key={st.id}
            id={st.id}
            name={st.name}
            // setChosen={() => {
            //   setChosen(true);
            //   setCompletedTopics((prev) => {
            //     if (!prev.includes(data.id)) {
            //       return [...prev, data.id];
            //     }
            //     return prev;
            //   });
            // }}
          />
        );
      })
      :
      null
      ;
    
    const navigateToHome = () => {
        navigate('/home')
    }


    return (
        <div>
            <h1>Selected Topic: {data.name}</h1>
            <button className=" text-blue-500" onClick={navigateToHome}>Back to Home</button>
            <h2>
                Choose a subtopic: 
            </h2>
            {subtopicsToRender}
        </div>
    )
}

export default TopicView