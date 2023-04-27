import { useNavigate } from "react-router-dom"
import useUser from "../hooks/useUser"
import { useContext } from "react"
import UserContext from "../context/UserContext"


function SubTopic({id, name}){
    const {user} = useUser()
    const { getAuthHeaders } = useContext(UserContext)
    const navigate = useNavigate()
    console.log(name)

    const addSubTopicPreference = async () => {
        try {
            const headers = await getAuthHeaders()
            const response = await fetch(`/subtopic-preferences`, {
                method:"POST",
                headers: headers,
                body: JSON.stringify({ user_id: user.id, subtopic_id : id , priority: 0}),
            });

            if (response.ok) {
                console.log("Subtopic Preference added")
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch(error){
            console.error("Error adding subtopic preference: ", error)
        }
    }

    const handleClick = () => {
        addSubTopicPreference();
        // navigate('/subtopic-view') // dont need this yet but will probably add later for sources n shit
        navigate('/home')
    }



    return (
        <div>
            <h1 onClick={handleClick} >{name}</h1>
        </div>
    )
}

export default SubTopic