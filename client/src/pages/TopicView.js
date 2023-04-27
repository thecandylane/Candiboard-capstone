import { useLocation, useNavigate } from "react-router-dom"
import SubTopic from "../components/SubTopic"

const TopicView = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const data = location.state.topic
    console.log(data)
    const subtopicsToRender = data.subtopics.map((st) => {

        return <SubTopic
            key={st.id}
            id={st.id}
            name={st.name}
            />
    })
    
    const navigateToHome = () => {
        navigate('/home')
    }


    return (
        <div>
            <h1>{data.name}</h1>
            <button onClick={navigateToHome}>Back to Home</button>
            {subtopicsToRender}
        </div>
    )
}

export default TopicView