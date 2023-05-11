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
      console.log(st)
        return (
          <div className="flex flex-row">

            <SubTopic
              selectedId={data.id}
              key={st.id}
              id={st.id}
              name={st.name}
              description={st.description}
              // selected={selected}
              resources={st.resources}
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
      <div className="bg-gray-300 container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">
        Selected Topic: {data ? data.name : "Loading..."}
      </h1>
      <button
        className="bg-white text-blue-500 font-semibold my-1 py-1 px-2 rounded shadow hover:bg-blue-600 hover:text-white"
        onClick={navigateToHome}
      >
        Back to Home
      </button>
      <h2 className="text-2xl font-semibold mb-4">Choose a subtopic:</h2>
      <div className="flex flex-wrap justify-center">{subtopicsToRender}</div>
    </div>
  );
};

export default TopicView