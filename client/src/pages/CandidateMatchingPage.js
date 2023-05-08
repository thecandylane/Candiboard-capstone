import { useContext, useEffect, useState } from "react"
import UserContext from "../context/UserContext"
import { find_closest_candidate } from "./utils"

const MatchingPage = () => {
    const { getAuthHeaders, user, setUser } = useContext(UserContext);
    // const [userSubtopicPreferences, setUserSubtopicPreferences] = useState([]);
    const [candidates, setCandidates] = useState([]);
    useEffect(() => {
        const get = async() => {
            const headers = await getAuthHeaders()
            fetch('/whoami', {
            headers:headers
        })
        .then(response => response.json())
        .then(data => {
            console.log('data from /whoami', data)
            setUser(data.user)
        })
    }
    get()
    },[])

    useEffect(() => {
        const fetchCandidates = async () => {
            const headers = await getAuthHeaders();
            fetch("/candidates", {
                headers: headers,
            })
                .then((r) => {
                    if (r.ok) {
                        return r.json();
                    } else {
                        console.error("sum hapn");
                    }
                })
                .then((data) => {
                    setCandidates(data)
                    console.log("Fetched candidates:", data);

                });
        };

        // fetchUserSubtopicPreferences();
        fetchCandidates();
    }, []);


    function calculateMatchPercentage(user, candidate) {
        console.log('from inside match function:', candidate)
        const maxPriority = 10;
        const maxStrength = 5;
        let totalMatchScore = 0;
        let maxPossibleScore = 0;
    
        for (const userPreference of user.subtopic_preferences) {
            let userPriority = userPreference.priority;
            let subtopicID = userPreference.subtopic_id;
            let candidateSubtopic = candidate.candidate_subtopics.find(
                cs => cs.subtopic_id === subtopicID
            );
    
            if (candidateSubtopic) {
                let candidateWeight = candidateSubtopic.weight;
                let matchScore = userPriority * candidateWeight;
                totalMatchScore += matchScore;
            }
    
            let maxScoreForPriority = maxPriority * maxStrength;
            maxPossibleScore += maxScoreForPriority;
        }
    
        let matchPercentage = (totalMatchScore / maxPossibleScore) * 100;
        return matchPercentage;
    }
    
    

    console.log(candidates)

    const candidatesWithMatchPercentages = candidates.map((candidate) => {
        const matchPercentage = calculateMatchPercentage(user, candidate);
        return { ...candidate, matchPercentage };
    });
    

    const sortedCandidates = candidatesWithMatchPercentages.sort(
        (a, b) => b.matchPercentage - a.matchPercentage
    );

    const candidateCards = sortedCandidates.map((candidate) => {
        return (
            <div key={candidate.id} className="candidate-card">
                {/* <img src={candidate.image_url} alt={candidate.name} /> */}
                <h3>{candidate.name}</h3>
                <p>Match Percentage: {candidate.matchPercentage.toFixed(2)}%</p>
            </div>
        );
    });

    return (
        <div>
            <h1>Your Candidates:</h1>
            <div className="candidate-cards-container">{candidateCards}</div>
        </div>
    );
}

export default MatchingPage