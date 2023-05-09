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
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold mb-4">Grade your Subtopics:</h1>
              <button
                className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 mb-4"
                onClick={handleHome}
              >
                Go back to Topics
              </button>
              <div className="mb-4">{gradingSubs}</div>
              <button
                className="bg-green-400 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
                onClick={() => navigate('/matching-page')}
              >
                Calculate which candidates are for you
              </button>
            </div>
          );
    }

    export default SubtopicGrading