import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeDiv, setActiveDiv] = useState(null);
    const [adminData, setAdminData] = useState([])
    const {getAuthHeaders} = useContext(UserContext)


    const style = "bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
    console.log(activeDiv)
    const handleButtonClick = async (divKey) => {
        setActiveDiv(activeDiv === divKey ? null : divKey);
        const headers = await getAuthHeaders()
        if (activeDiv !== divKey) {
            const endpoint = divKey;
            
            fetch(`/${endpoint}`,{
                headers:headers
            })
            .then(r => {
                if (r.ok){
                    return r.json() 
                }else{
                    console.error('sum hapn')
                }
            })
            .then(data => {
                setAdminData(data)
                console.log(data)
            })
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
            {activeDiv === "users" && (
                 <div>
                 <table>
                     <thead>
                         <tr>
                             <th>ID</th>
                             <th>Username</th>
                             <th>Email</th>
                             <th>Admin</th>
                         </tr>
                     </thead>
                     <tbody>
                         {adminData.map((user) => (
                             <tr key={user.id}>
                                 <td>{user.id}</td>
                                 <td>{user.username}</td>
                                 <td>{user.email}</td>
                                 <td>{user.admin ? "Yes" : "No"}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
            )}
            {activeDiv === "candidates" && (
                <div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Image URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminData.map((candidate) => (
                            <tr key={candidate.id}>
                                <td>{candidate.id}</td>
                                <td>{candidate.name}</td>
                                <td>{candidate.image_url}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
            {activeDiv === "topics" && (
                 <div>
                 <table>
                     <thead>
                         <tr>
                             <th>ID</th>
                             <th>Name</th>
                         </tr>
                     </thead>
                     <tbody>
                         {adminData.map((topic) => (
                             <tr key={topic.id}>
                                 <td>{topic.id}</td>
                                 <td>{topic.name}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
            )}
            {activeDiv === "subtopics" && (
                <div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Topic ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminData.map((subtopic) => (
                            <tr key={subtopic.id}>
                                <td>{subtopic.id}</td>
                                <td>{subtopic.name}</td>
                                <td>{subtopic.topic_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
            {activeDiv === "resources" && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Title</th>
                                <th>URL</th>
                                <th>Subtopic ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminData.map((resource) => (
                                <tr key={resource.id}>
                                    <td>{resource.type}</td>
                                    <td>{resource.title}</td>
                                    <td>{resource.url}</td>
                                    <td>{resource.subtopic_id}</td>
                                </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminPage;
