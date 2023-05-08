import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import SCard from "../components/SCard"
import UserContext from "../context/UserContext"


const SubtopicGrading = () => {
    const navigate = useNavigate()
    // const location = useLocation()
    const { getAuthHeaders, user } = useContext(UserContext)
    const [subtopics, setSubtopics] = useState([])
    const [length, setLength] = useState(0)
    // const user = location.state?.user
    useEffect(() => {
        const fetchSubs = async () => {
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
                    setSubtopics(data)
                    setLength(data.length)
                    // console.log(data)
                })
        }
        fetchSubs()
    }, [])


    const handleHome = () => {
        navigate('/home')
    }

        const gradingSubs = subtopics.map((s) => {
            console.log(s)

            return (
                <SCard key={s.id} id={s.id} length={length} name={s.name} description={s.description}/>
            )
        })

        return (
            <div>
                <h1>Grade your Subtopics:</h1>
                <button className=" bg-blue-400" onClick={handleHome}>Go back to Topics</button>
                {gradingSubs}
                <button onClick={() => navigate('/matching-page')}>Calculate which candidates are for you</button>

            </div>
        )
    }

    export default SubtopicGrading