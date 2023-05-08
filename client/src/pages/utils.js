export const find_closest_candidate = (user_preferences, candidates) => {
    let best_candidate = null;
    let best_candidate_score = -Infinity;

    for (const candidate of candidates) {
        let candidate_score = 0;

        for (const candidate_subtopic of candidate.candidate_subtopics) {
            if (user_preferences.hasOwnProperty(candidate_subtopic.subtopic.name)) {
                const priority = user_preferences[candidate_subtopic.subtopic.name];
                candidate_score += priority;
            }
        }

        if (candidate_score > best_candidate_score) {
            best_candidate_score = candidate_score;
            best_candidate = candidate;
        }
    }

    return best_candidate;
};
