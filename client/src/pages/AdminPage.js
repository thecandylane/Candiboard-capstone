import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeDiv, setActiveDiv] = useState(null);
    const [adminData, setAdminData] = useState([])
    const [loading, setLoading] = useState(false);
    const { getAuthHeaders, setUser, user } = useContext(UserContext)

    const style = "bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
    useEffect(() => {
        const fetchData = async() => {
            const headers = await getAuthHeaders()
            console.log(headers)
            fetch('/whoami', {
                headers:headers
            })
            .then(r => {
                if (r.ok) {
                    return r.json()
                } else {
                    console.error('sum hapn')
                }
            })
            .then(data => {
                setUser(data.user)
                console.log(user)
            })
        }
        fetchData()
    }, [])


    console.log(activeDiv)
    const handleButtonClick = async (divKey) => {
        const headers = getAuthHeaders()
        setLoading(true);
        setActiveDiv(activeDiv === divKey ? null : divKey);
        if (activeDiv !== divKey) {
            const endpoint = divKey;

            fetch(`/${endpoint}`, {
                headers: await headers
            })
                .then(r => {
                    if (r.ok) {
                        return r.json()
                    } else {
                        console.error('sum hapn')
                    }
                })
                .then(data => {
                    setAdminData(data)
                    setLoading(false);
                    console.log(data)
                })
        } else {
            setLoading(false);
        }
    }



    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl font-bold text-center mb-8">
                Candiboard Admin Panel
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    className={style}
                    onClick={() => handleButtonClick("users")}
                >
                    Manage Users
                </button>
                <button
                    className={style}
                    onClick={() => handleButtonClick("candidates")}
                >
                    Manage Candidates
                </button>
                <button
                    className={style}
                    onClick={() => handleButtonClick("topics")}
                >
                    Manage Topics
                </button>
                <button
                    className={style}
                    onClick={() => handleButtonClick("subtopics")}
                >
                    Manage Subtopics
                </button>
                <button
                    className={style}
                    onClick={() => handleButtonClick("resources")}
                >
                    Manage Resources
                </button>
                <button
                    className={style}
                    onClick={() => navigate("/home")}
                >
                    Back to Home
                </button>
            </div>
            {loading && <div>Loading...</div>}
            {activeDiv !== null && !loading && (
                <div className="overflow-x-auto w-full mt-8">
                    <table className="w-full table-auto text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                {activeDiv === "users" && (
                                    <>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Username</th>
                                        <th className="border border-gray-300 px-4 py-2">Email</th>
                                        <th className="border border-gray-300 px-4 py-2">Admin</th>
                                    </>
                                )}
                                {activeDiv === "candidates" && (
                                    <>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Image URL</th>
                                    </>
                                )}
                                {activeDiv === "topics" && (
                                    <>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                    </>
                                )}
                                {activeDiv === "subtopics" && (
                                    <>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Topic ID</th>
                                    </>
                                )}
                                {activeDiv === "resources" && (
                                    <>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Type</th>
                                        <th className="border border-gray-300 px-4 py-2">Title</th>
                                        <th className="border border-gray-300 px-4 py-2">URL</th>
                                        <th className="border border-gray-300 px-4 py-2">Subtopic ID</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {adminData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-200 focus:bg-gray-200">
                                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                                    {activeDiv === "users" && (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2">{item.username}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.admin ? "Yes" : "No"}</td>
                                        </>
                                    )}
                                    {activeDiv === "candidates" && (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.image_url}</td>
                                        </>
                                    )}
                                    {activeDiv === "topics" && (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                        </>
                                    )}
                                    {activeDiv === "subtopics" && (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.topic_id}</td>
                                        </>
                                    )}
                                    {activeDiv === "resources" && (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.url}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.subtopic_id}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )

}

export default AdminPage;