import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeDiv, setActiveDiv] = useState(null);
    const [topics, setTopics] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [adminData, setAdminData] = useState([])
    const [bigAdminData, setBigAdminData] = useState([])
    const [loading, setLoading] = useState(false);
    const [showUserList, setShowUserList] = useState(true);
    const [showCandidateList, setShowCandidateList] = useState(true)
    const { getAuthHeaders, setUser, user } = useContext(UserContext)
    const [inputValues, setInputValues] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        candidateName: '',
        candidateImage_Url: '',
        topicName: '',
        subtopicName: '',
        subtopicTopicId: '',
        subtopicDescription: '',
        resourceType: '',
        resourceTitle: '',
        resourceUrl: '',
        resourceSubtopicId: ''
    });


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
        const headers = await getAuthHeaders()
        setLoading(true);
        setActiveDiv(activeDiv === divKey ? null : divKey);
        if (activeDiv !== divKey) {
            const endpoint = divKey;

            fetch(`/${endpoint}`, {
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
        const headers = await getAuthHeaders()
        setLoading(true);
        setActiveDiv(activeDiv === divKey ? null : divKey);
        if (activeDiv !== divKey) {
            const endpoint = divKey;

            fetch(`/${endpoint}`, {
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
    /*
    CANDIDATE TABLE SHIT ---------------------------------------------------------------------
    */
    const deleteCandidate = async (id) => {
        const headers = await getAuthHeaders()
        fetch(`/candidates/${id}`, {
            method: "DELETE",
            headers: headers,
        })
            .then(r => {
                if (r.status === 204) {
                    return Promise.resolve()
                } else {
                    return r.json()
                }
            })
            .then(() => {
                setBigAdminData(prevData => prevData.filter(candidate => candidate.id !== id))
            })
            .catch(err => console.error(err))
    }
    const updateCandidateSubtopicWeight = async (candidateId, subtopicId, newWeight) => {
        const headers = await getAuthHeaders()
        try {
            const response = await fetch(`/candidates/${candidateId}/candidate_subtopics/${subtopicId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({ weight: newWeight }),
            });

            if (response.ok) {
                setSelectedCandidate(prevCandidate => ({
                    ...prevCandidate,
                    candidate_subtopics: prevCandidate.candidate_subtopics.map(candSub =>
                        candSub.subtopic_id === subtopicId ? { ...candSub, weight: newWeight } : candSub
                    ),
                }));
            } else {
                console.error('Error updating candidate subtopic weight:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error updating candidate subtopic weight:', error);
        }
    };

    const deleteCandidateSubtopic = async (candidateId, subtopicId) => {
        const headers = await getAuthHeaders();
        try {
            const response = await fetch(`/candidates/${candidateId}/candidate_subtopics/${subtopicId}`, {
                method: 'DELETE',
                headers: headers,
            });

            if (response.ok) {
                setSelectedCandidate(prevCandidate => ({
                    ...prevCandidate,
                    candidate_subtopics: prevCandidate.candidate_subtopics.filter(subtopic => subtopic.subtopic_id !== subtopicId),
                }));
            } else {
                console.error('Error deleting candidate subtopic:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error deleting candidate subtopic:', error);
        }
    };

    const createCandidateSubtopic = async (candidateId, subtopicId) => {
        const headers = await getAuthHeaders();
        console.log(candidateId, subtopicId)
        try {
            const response = await fetch(`/candidates/${candidateId}/candidate_subtopics`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ candidate_id: candidateId, subtopic_id: subtopicId, weight: 0 }),
            });

            if (response.ok) {
                const newSubtopic = await response.json();
                setSelectedCandidate(prevCandidate => ({
                    ...prevCandidate,
                    candidate_subtopics: [...prevCandidate.candidate_subtopics, newSubtopic],
                }));
            } else {
                console.error('Error creating candidate subtopic:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error creating candidate subtopic:', error);
        }
    };
    const renderSelectedCandidateTable = () => {
        if (selectedCandidate) {
            return (
                <>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={() => {
                            setSelectedCandidate(null);
                            setShowCandidateList(true);
                        }}
                    >
                        Back to Candidate List
                    </button>
                    <table className="table-auto border-collapse border border-gray-300 mt-4">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">Topic ID</th>
                                <th className="border border-gray-300 p-2">Subtopics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map((topic) => {
                                const candidateSubtopics = selectedCandidate.candidate_subtopics
                                    .filter((subtopic) => subtopic.subtopic.topic_id === topic.id)
                                    .map((subtopic) => ({
                                        subtopic_id: subtopic.subtopic_id,
                                        weight: subtopic.weight,
                                    }));

                                return (
                                    <tr key={topic.id}>
                                        <td className="border border-gray-300 p-2">{topic.id}</td>
                                        <td className="border border-gray-300 p-2">
                                            <table className="w-full">
                                                {topic.subtopics.map((subtopic) => {
                                                    const candidateSubtopic = candidateSubtopics.find(
                                                        (cs) => cs.subtopic_id === subtopic.id
                                                    );
                                                    return (
                                                        <tr key={subtopic.id}>
                                                            <td
                                                                className={`border border-gray-300 p-2 ${candidateSubtopic
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-gray-200"
                                                                    }`}
                                                                onClick={() => {
                                                                    if (candidateSubtopic) {
                                                                        updateCandidateSubtopicWeight(
                                                                            selectedCandidate.id,
                                                                            subtopic.id,
                                                                            1
                                                                        );
                                                                    } else {
                                                                        const prevSubtopicId =
                                                                            selectedCandidate.candidate_subtopics.find(
                                                                                (subtopic) =>
                                                                                    subtopic.subtopic.topic_id === topic.id
                                                                            )?.subtopic_id;
                                                                        if (prevSubtopicId) {
                                                                            deleteCandidateSubtopic(
                                                                                selectedCandidate.id,
                                                                                prevSubtopicId
                                                                            );
                                                                        }
                                                                        createCandidateSubtopic(
                                                                            selectedCandidate.id,
                                                                            subtopic.id
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {subtopic.name}
                                                                {candidateSubtopic && (
                                                                    <>
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max="10"
                                                                            className="ml-2 w-15 text-black"
                                                                            value={
                                                                                inputValues[subtopic.id] ||
                                                                                candidateSubtopic.weight
                                                                            }
                                                                            onChange={(e) =>
                                                                                setInputValues((prevValues) => ({
                                                                                    ...prevValues,
                                                                                    [subtopic.id]: e.target.value,
                                                                                }))
                                                                            }
                                                                            onBlur={() => {
                                                                                if (inputValues[subtopic.id]) {
                                                                                    updateCandidateSubtopicWeight(
                                                                                        selectedCandidate.id,
                                                                                        subtopic.id,
                                                                                        parseInt(
                                                                                            inputValues[subtopic.id]
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (
                                                                                    e.key === "Enter" &&
                                                                                    inputValues[subtopic.id]
                                                                                ) {
                                                                                    updateCandidateSubtopicWeight(
                                                                                        selectedCandidate.id,
                                                                                        subtopic.id,
                                                                                        parseInt(
                                                                                            inputValues[subtopic.id]
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </table>
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


    /*
    USER SUBTOPIC SHIT ----------------------------------------------------------------
    */

    const updateSubtopicPriority = async (userId, subtopicId, newPriority) => {
        const headers = await getAuthHeaders()
        try {
            const response = await fetch(`/users/${userId}/subtopic_preferences/${subtopicId}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({ priority: newPriority }),
            });

            if (response.ok) {
                setSelectedUser(prevUser => ({
                    ...prevUser,
                    subtopic_preferences: prevUser.subtopic_preferences.map(pref =>
                        pref.subtopic_id === subtopicId ? { ...pref, priority: newPriority } : pref
                    ),
                }));
            } else {
                console.error('Error updating subtopic priority:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error updating subtopic priority:', error);
        }
    };
    const deleteSubtopicPreference = async (userId, subtopicId) => {
        const headers = await getAuthHeaders();
        try {
            const response = await fetch(`/users/${userId}/subtopic_preferences/${subtopicId}`, {
                method: 'DELETE',
                headers: headers,
            });

            if (response.ok) {
                setSelectedUser(prevUser => ({
                    ...prevUser,
                    subtopic_preferences: prevUser.subtopic_preferences.filter(pref => pref.subtopic_id !== subtopicId),
                }));
            } else {
                console.error('Error deleting subtopic preference:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error deleting subtopic preference:', error);
        }
    };

    const createSubtopicPreference = async (userId, subtopicId) => {
        const headers = await getAuthHeaders();
        try {
            const response = await fetch(`/users/${userId}/subtopic_preferences`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ subtopic_id: subtopicId }),
            });

            if (response.ok) {
                const newPref = await response.json();
                setSelectedUser(prevUser => ({
                    ...prevUser,
                    subtopic_preferences: [...prevUser.subtopic_preferences, newPref],
                }));
            } else {
                console.error('Error creating subtopic preference:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error creating subtopic preference:', error);
        }
    };






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
                            {topics.map((topic) => {
                                const userSubtopics = selectedUser.subtopic_preferences
                                    .filter((pref) => pref.subtopic.topic_id === topic.id)
                                    .map((pref) => ({
                                        subtopic_id: pref.subtopic_id,
                                        priority: pref.priority,
                                    }));

                                return (
                                    <tr key={topic.id}>
                                        <td className="border border-gray-300 p-2">{topic.id}</td>
                                        <td className="border border-gray-300 p-2">
                                            <table className="w-full">
                                                {topic.subtopics.map((subtopic) => {
                                                    const userSubtopic = userSubtopics.find(
                                                        (us) => us.subtopic_id === subtopic.id
                                                    );
                                                    return (
                                                        <tr key={subtopic.id}>
                                                            <td
                                                                className={`border border-gray-300 p-2 ${userSubtopic
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-gray-200"
                                                                    }`}
                                                                onClick={() => {
                                                                    if (userSubtopic) {
                                                                        updateSubtopicPriority(
                                                                            selectedUser.id,
                                                                            subtopic.id,
                                                                            1
                                                                        );
                                                                    } else {
                                                                        const prevSubtopicId =
                                                                            selectedUser.subtopic_preferences.find(
                                                                                (pref) =>
                                                                                    pref.subtopic.topic_id === topic.id
                                                                            )?.subtopic_id;
                                                                        if (prevSubtopicId) {
                                                                            deleteSubtopicPreference(
                                                                                selectedUser.id,
                                                                                prevSubtopicId
                                                                            );
                                                                        }
                                                                        createSubtopicPreference(
                                                                            selectedUser.id,
                                                                            subtopic.id
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {subtopic.name}
                                                                {userSubtopic && (
                                                                    <>
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max="10"
                                                                            className="ml-2 w-15 text-black"
                                                                            value={
                                                                                inputValues[subtopic.id] ||
                                                                                userSubtopic.priority
                                                                            }
                                                                            onChange={(e) =>
                                                                                setInputValues((prevValues) => ({
                                                                                    ...prevValues,
                                                                                    [subtopic.id]: e.target.value,
                                                                                }))
                                                                            }
                                                                            onBlur={() => {
                                                                                if (inputValues[subtopic.id]) {
                                                                                    updateSubtopicPriority(
                                                                                        selectedUser.id,
                                                                                        subtopic.id,
                                                                                        parseInt(
                                                                                            inputValues[subtopic.id]
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (
                                                                                    e.key === "Enter" &&
                                                                                    inputValues[subtopic.id]
                                                                                ) {
                                                                                    updateSubtopicPriority(
                                                                                        selectedUser.id,
                                                                                        subtopic.id,
                                                                                        parseInt(
                                                                                            inputValues[subtopic.id]
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </table>
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



    /*
    FUNCTIONALITY FOR CANDIDATES, TOPICS, SUBTOPICS, AND RESOURCES? ------------------------------------------------------
    */
    const addCandidate = async (name, url) => {
        const headers = await getAuthHeaders()
        fetch('/candidates', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ name: name, image_url: url })
        })
            .then(r => {
                if (r.status === 204) {
                    return Promise.resolve()
                } else {
                    return r.json()
                }
            })
            .then((data) => {
                setBigAdminData((prevData) => [...prevData, data])
                setFormData({ ...formData, candidateName: '', candidateImage_Url: '' })
                setShowForm(false)
            })
    }
    const addTopic = async (name) => {
        const headers = await getAuthHeaders()
        fetch('/topics', {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ name: name })
        })
            .then(r => r.json())
            .then(data => {
                console.log(data)
                setAdminData(prevData => [...prevData, data])
                setFormData({ ...formData, topicName: '' })
                setShowForm(false)
            })
    }
    const deleteTopic = async (id) => {
        const headers = await getAuthHeaders()
        fetch(`/topics/${id}`, {
            method: "DELETE",
            headers: headers,
        })
            .then(r => {
                if (r.status === 204) {
                    return Promise.resolve()
                } else {
                    return r.json()
                }
            })
            .then(() => {
                setAdminData(prevData => prevData.filter(topic => topic.id !== id))
            })
            .catch(err => console.error(err))
    }

    const addSubtopic = async (name, topicId, description) => {
        const headers = await getAuthHeaders()
        fetch('/subtopics', {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ name: name, topic_id: topicId, description: description })
        })
            .then(r => r.json())
            .then(data => {
                console.log(data)
                setAdminData(prevData => [...prevData, data])
                setFormData({
                    ...formData,
                    subtopicName: '',
                    subtopicTopicId: '',
                    subtopicDescription: ''
                })
                setShowForm(false)
            })
    }

    const deleteSubtopic = async (id) => {
        const headers = await getAuthHeaders()
        fetch(`/subtopics/${id}`, {
            method: "DELETE",
            headers: headers,
        })
            .then(r => {
                if (r.status === 204) {
                    return Promise.resolve()
                } else {
                    return r.json()
                }
            })
            .then(() => {
                setAdminData(prevData => prevData.filter(subtopic => subtopic.id !== id))
            })
            .catch(err => console.error(err))
    }

    const addResource = async (type, title, url, subtopicId) => {
        const headers = await getAuthHeaders()
        fetch('/resources', {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ type: type, title: title, url: url, subtopic_id: subtopicId })
        })
            .then(r => r.json())
            .then(data => {
                console.log(data)
                setAdminData(prevData => [...prevData, data])
                setFormData({
                    ...formData,
                    resourceType: '',
                    resourceTitle: '',
                    resourceUrl: '',
                    resourceSubtopicId: ''
                })
                setShowForm(false)
            })
    }
    const deleteResource = async (id) => {
        const headers = await getAuthHeaders()
        fetch(`/resources/${id}`, {
            method: "DELETE",
            headers: headers,
        })
            .then(r => {
                if (r.status === 204) {
                    return Promise.resolve()
                } else {
                    return r.json()
                }
            })
            .then(() => {
                setAdminData(prevData => prevData.filter(resource => resource.id !== id))
            })
            .catch(err => console.error(err))
    }

    let sortedAdminData = [...adminData];
    if (activeDiv === "subtopics") {
        sortedAdminData.sort((a, b) => a.topic_id - b.topic_id);
    } else if (activeDiv === "resources") {
        sortedAdminData.sort((a, b) => a.subtopic_id - b.subtopic_id);
    }
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
            {activeDiv !== null &&
                (<button className={style} onClick={() => setShowForm(!showForm)}>
                    Add {activeDiv}
                </button>)}
            {showForm && activeDiv === 'candidates' && (
                <form onSubmit={(e) => {
                    e.preventDefault()
                    addCandidate(formData.candidateName, formData.candidateImage_Url)
                }}>
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                        value={formData.candidateName}
                        placeholder="Enter candidate Name"
                    />
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, candidateImage_Url: e.target.value })}
                        value={formData.candidateImage_Url}
                        placeholder="Enter candidate Image Url"
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            {showForm && activeDiv === 'topics' && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    addTopic(formData.topicName);
                }}>
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                        value={formData.topicName}
                        placeholder="Enter topic name"
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            {showForm && activeDiv === 'subtopics' && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    addSubtopic(formData.subtopicName, formData.subtopicTopicId, formData.subtopicDescription);
                }}>
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, subtopicName: e.target.value })}
                        value={formData.subtopicName}
                        placeholder="Enter subtopic name"
                    />
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, subtopicTopicId: e.target.value })}
                        value={formData.subtopicTopicId}
                        placeholder="Enter topic ID"
                    />
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, subtopicDescription: e.target.value })}
                        value={formData.subtopicDescription}
                        placeholder="Enter description"
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

            {showForm && activeDiv === 'resources' && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    addResource(formData.resourceType, formData.resourceTitle, formData.resourceUrl, formData.resourceSubtopicId);
                }}>
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                        value={formData.resourceType}
                        placeholder="Enter resource type"
                    />
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, resourceTitle: e.target.value })}
                        value={formData.resourceTitle}
                        placeholder="Enter resource title"
                    />
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })}
                        value={formData.resourceUrl}
                        placeholder="Enter resource URL"
                    />
                    <input
                        type="text"
                        onChange={(e) => setFormData({ ...formData, resourceSubtopicId: e.target.value })}
                        value={formData.resourceSubtopicId}
                        placeholder="Enter subtopic ID"
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            {!loading && (
                <>
                    {activeDiv === 'users' && showUserList &&
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
                                    <p>{item.username}</p>
                                </div>
                            );
                        })}
                    {activeDiv === 'users' && renderSelectedUserTable()}

                    {activeDiv === 'candidates' && showCandidateList &&
                        bigAdminData.map(item => {
                            return (
                                <div key={item.id} className="flex items-center bg-blue-300 p-2 m-2 cursor-pointer">
                                    <div
                                        onClick={() => {
                                            setSelectedCandidate(item)
                                            setShowCandidateList(false)
                                        }}
                                    >
                                        <p>{item.name}</p>
                                    </div>
                                    <button
                                        className="bg-red-400 py-2 ml-2 text-white"
                                        onClick={e => {
                                            e.stopPropagation(); // prevent triggering onClick of parent
                                            deleteCandidate(item.id)
                                        }}
                                    >
                                        x
                                    </button>
                                </div>
                            );
                        })
                    }
                    {activeDiv === 'candidates' && renderSelectedCandidateTable()}
                </>
            )}


            {activeDiv !== null && !loading && (
                <div className="overflow-x-auto w-full mt-8">
                    <table className="w-full table-auto text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                {activeDiv === "topics" && (
                                    <>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2"></th>
                                    </>
                                )}
                                {activeDiv === "subtopics" && (
                                    <>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Topic ID</th>
                                        <th className="border border-gray-300 px-4 py-2"></th>
                                    </>
                                )}
                                {activeDiv === "resources" && (
                                    <>
                                        <th className="border border-gray-300 px-4 py-2">ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Type</th>
                                        <th className="border border-gray-300 px-4 py-2">Title</th>
                                        <th className="border border-gray-300 px-4 py-2">URL</th>
                                        <th className="border border-gray-300 px-4 py-2">Subtopic ID</th>
                                        <th className="border border-gray-300 px-4 py-2"></th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAdminData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-200 focus:bg-gray-200">
                                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                                    {activeDiv === "topics" && (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                            <td onClick={() => deleteTopic(item.id)} className="border border-gray-300 bg-red-500 hover:bg-red-700 px-4 py-2">Delete</td>
                                        </>
                                    )}
                                    {activeDiv === "subtopics" && (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.topic_id}</td>
                                            <td onClick={() => deleteSubtopic(item.id)} className="border border-gray-300 bg-red-500 hover:bg-red-700 px-4 py-2">Delete</td>
                                        </>
                                    )}
                                    {activeDiv === "resources" && (
                                        <>
                                            <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.url}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.subtopic_id}</td>
                                            <td onClick={() => deleteResource(item.id)} className="border border-gray-300 bg-red-500 hover:bg-red-700 px-4 py-2">Delete</td>
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