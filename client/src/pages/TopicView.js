import { useLocation, useNavigate } from "react-router-dom"
import SubTopic from "../components/SubTopic"
import { useState, useEffect } from "react"

const TopicView = ({}) => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!location.state || !location.state.topic) {
          navigate("/home");
        }
      }, [location.state, navigate]);
    
    const data = location.state?.topic;
    console.log(data)
    
    const subtopicsToRender = data ? 
     data.subtopics.map((st) => {
        return (
          <div className="flex flex-row">

            <SubTopic
              selectedId={data.id}
              key={st.id}
              id={st.id}
              name={st.name}
              // selected={selected}
            />
          </div>
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
            <h1>Selected Topic: {data ? data.name : "Loading..."}</h1>
            <button className=" text-blue-500" onClick={navigateToHome}>Back to Home</button>
            <h2>
                Choose a subtopic: 
            </h2>
            <div className="flex flex-wrap justify-center">
              {subtopicsToRender}
            </div>
        </div>
    )
}

export default TopicView