import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeDiv, setActiveDiv] = useState(null);
    const [topics, setTopics] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [adminData, setAdminData] = useState([])
    const [bigAdminData, setBigAdminData] = useState([])
    const [loading, setLoading] = useState(false);
    const [showUserList, setShowUserList] = useState(true);
    const { getAuthHeaders, setUser, user } = useContext(UserContext)

    const style = "bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
    useEffect(() => {
        const fetchData = async () => {
            const headers = await getAuthHeaders()
            console.log(headers)
            fetch('/whoami', {
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
                    setUser(data.user)
                    console.log(user)
                })
        }
        fetchData()
    }, [])
    useEffect(() => {
        const getTopics = async () => {
            const headers = await getAuthHeaders()
            fetch('/topics', {
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
                    console.log(data)
                    setTopics(data)
                })
        }
        getTopics()
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
                    setBigAdminData([])
                    setLoading(false);
                    console.log(data)
                })
        } else {
            setLoading(false);
        }
    }
    const handleBigButtonClick = async (divKey) => {
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
                    setBigAdminData(data)
                    setAdminData([])
                    setLoading(false);
                    console.log(data)
                    console.log('Active div rn: ', activeDiv)
                })
        } else {
            setLoading(false);
        }
    }

    const renderSelectedUserTable = () => {

        if (selectedUser) {
            return (
                <>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    onClick={() => {
                        setSelectedUser(null);
                        setShowUserList(true);
                    }}
                >
                    Back to User List
                </button>
                <table className="table-auto border-collapse border border-gray-300 mt-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Topic ID</th>
                            <th className="border border-gray-300 p-2">Subtopics</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map(topic => {
                            const userSubtopics = selectedUser.subtopic_preferences
                                .filter(pref => pref.subtopic.topic_id === topic.id)
                                .map(pref => pref.subtopic_id);
                            return (
                                <tr key={topic.id}>
                                    <td className="border border-gray-300 p-2">{topic.id}</td>
                                    <td className="border border-gray-300 p-2">
                                        {topic.subtopics.map(subtopic => (
                                            <span
                                                key={subtopic.id}
                                                className={`inline-block m-1 p-1 rounded ${
                                                    userSubtopics.includes(subtopic.id)
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                {subtopic.name}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </>
            );
        }
        return null;
    };
    


    return (
        <div className='flex flex-col items-center space-y-4'>
            <h1 className='text-3xl font-bold text-center mb-8'>Candiboard Admin Panel</h1>
            <div className='flex flex-wrap justify-center gap-4'>
                <button className={style} onClick={() => handleBigButtonClick('users')}>
                    Manage Users
                </button>
                <button className={style} onClick={() => handleBigButtonClick('candidates')}>
                    Manage Candidates
                </button>
                <button className={style} onClick={() => handleButtonClick('topics')}>
                    Manage Topics
                </button>
                <button className={style} onClick={() => handleButtonClick('subtopics')}>
                    Manage Subtopics
                </button>
                <button className={style} onClick={() => handleButtonClick('resources')}>
                    Manage Resources
                </button>
                <button className={style} onClick={() => navigate('/home')}>
                    Back to Home
                </button>
            </div>
            {loading && <div>Loading...</div>}
            {(activeDiv === "users" || activeDiv === 'candidates') && !loading && (
                <>
                    {showUserList &&
                    bigAdminData.map(item => {
                        return (
                            <div
                                key={item.id}
                                className="bg-blue-300 p-2 m-2 cursor-pointer"
                                onClick={() => {
                                    setSelectedUser(item)
                                    setShowUserList(false)
                                }}
                            >
                                <p>{activeDiv === 'users' ? item.username : item.name}</p>
                            </div>
                        );
                    })}
                    {renderSelectedUserTable()}
                </>
            )}

            {activeDiv !== null && !loading && (
                <div className="overflow-x-auto w-full mt-8">
                    <table className="w-full table-auto text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                {/* {activeDiv === "users" && (
                                    <></>
                                )}
                                {activeDiv === "candidates" && (
                                    <></>
                                )} */}
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
                </div >
            )}
        </div>
    )
}


export default AdminPage;




// <>
//                                         <th className="border border-gray-300 px-4 py-2">ID</th>
//                                         <th className="border border-gray-300 px-4 py-2">Username</th>
//                                         <th className="border border-gray-300 px-4 py-2">Email</th>
//                                         <th className="border border-gray-300 px-4 py-2">Admin</th>
//                                     </> 
// <>
//                                         <th className="border border-gray-300 px-4 py-2">ID</th>
//                                         <th className="border border-gray-300 px-4 py-2">Name</th>
//                                         <th className="border border-gray-300 px-4 py-2">Subtopics</th>
//                                         <th className="border border-gray-300 px-4 py-2">Image URL</th>
//                                     </>




