import { STORAGE,USER } from '../types/types';

const {
    lsCpuScore,
    lsPlayerScore,
    lsP1Score,
    lsP2Score,
    lsTiedScore,
} = STORAGE;

const updateStorageScore = (key) => {
    const currentScore = +localStorage.getItem(key);
        
    localStorage.setItem(
        key,
        currentScore ? currentScore + 1 : 1
    );
};

export const updateScore = (winner = '') => {
    switch (winner) {
        case USER.cpu:
            updateStorageScore(lsCpuScore);
            break;
        case USER.player:
            updateStorageScore(lsPlayerScore);
            break;
        case USER.p1:
            updateStorageScore(lsP1Score);
            break;
        case USER.p2:
            updateStorageScore(lsP2Score);
            break;
        default:
            updateStorageScore(lsTiedScore);
            break;
    }
};