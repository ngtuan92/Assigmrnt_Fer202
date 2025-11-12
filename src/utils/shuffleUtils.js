// Simple shuffle function
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Shuffle groups và reassign question numbers
export const shuffleGroups = (questions) => {
    // Group theo groupId
    const groups = {};
    questions.forEach(q => {
        const groupKey = q.groupId || `single_${q.id}`;
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(q);
    });

    // Shuffle thứ tự groups
    const groupKeys = Object.keys(groups);
    const shuffledKeys = shuffleArray(groupKeys);

    // Rebuild với số thứ tự mới
    let displayId = 1;
    const result = [];

    shuffledKeys.forEach(key => {
        groups[key].forEach(q => {
            result.push({
                ...q,
                displayId: displayId++
            });
        });
    });

    return result;
};

// Simple shuffle với probability
export const shouldShuffle = (probability = 0.5) => {
    return Math.random() < probability;
};

// Shuffle với URL param control
export const checkShuffleMode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('shuffle') === 'true';
};