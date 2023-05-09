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



    // function calculateMatchPercentage(user, candidate) {
    //     console.log('from inside match function:', candidate)
    //     const maxPriority = 10;
    //     const maxStrength = 5;
    //     let totalMatchScore = 0;
    //     let maxPossibleScore = 0;
    
    //     for (const userPreference of user.subtopic_preferences) {
    //         let userPriority = userPreference.priority;
    //         let subtopicID = userPreference.subtopic_id;
    //         let candidateSubtopic = candidate.candidate_subtopics.find(
    //             cs => cs.subtopic_id === subtopicID
    //         );
    
    //         if (candidateSubtopic) {
    //             let candidateWeight = candidateSubtopic.weight;
    //             let matchScore = userPriority * candidateWeight / (maxPriority * maxStrength);
    //             totalMatchScore += matchScore;
    //         }
    
    //         maxPossibleScore += 1.0;
    //     }
    
    //     let matchPercentage = (totalMatchScore / maxPossibleScore) * 100;
    //     return matchPercentage;
    // }
    
    function calculateMatchPercentage(user, candidate) {
        const maxPriority = 10;
        const maxWeight = 5;
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
                let matchScore = userPriority * candidateWeight / (maxPriority * maxWeight);
                totalMatchScore += matchScore;
                maxPossibleScore += 1.0;
            }
        }
    
        let matchPercentage = (totalMatchScore / user.subtopic_preferences.length) * 100;
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
            <div
            key={candidate.id}
            className="candidate-card bg-white p-4 rounded-md shadow-md mb-4"
          >
            <img src={candidate.image_url} alt={candidate.name}  className="w-full h-60 object-cover mb-4 rounded-md"/>
            <h3 className="text-xl font-semibold mb-2">{candidate.name}</h3>
            <p className="text-gray-800">
              Match Percentage: {candidate.matchPercentage.toFixed(2)}%
            </p>
          </div>
        );
      });

    return (
        <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Your Candidates:</h1>
        <div className="candidate-cards-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {candidateCards}
        </div>
      </div>
    );
}

export default MatchingPage


//other working formula
    // function calculateMatchPercentage(user, candidate) {
    //     console.log('from inside match function:', candidate)
    //     const maxPriority = 10;
    //     const maxStrength = 5;
    //     let totalMatchScore = 0;
    //     let maxPossibleScore = 0;
    
    //     for (const userPreference of user.subtopic_preferences) {
    //         let userPriority = userPreference.priority;
    //         let subtopicID = userPreference.subtopic_id;
    //         let candidateSubtopic = candidate.candidate_subtopics.find(
    //             cs => cs.subtopic_id === subtopicID
    //         );
    
    //         if (candidateSubtopic) {
    //             let candidateWeight = candidateSubtopic.weight;
    //             let matchScore = userPriority * candidateWeight;
    //             totalMatchScore += matchScore;
    //         }
    
    //         let maxScoreForPriority = maxPriority * maxStrength;
    //         maxPossibleScore += maxScoreForPriority;
    //     }
    
    //     let matchPercentage = (totalMatchScore / maxPossibleScore) * 100;
    //     return matchPercentage;
    // }