import { useEffect, useReducer } from 'react';
import { HashRouter } from 'react-router-dom';

import { AppRouter } from './routers/AppRouter';
import { GameContext } from './hocs/GameContext';

import { ACTIONS, STORAGE } from './types/types';
import { getEmptyBoard } from './helpers/getEmptyBoard';

const {
    lsBoardState,
    lsTurnCount,
    lsIsGameOver,
    lsCpuMark,
    lsCpuScore,
    lsCurrentTurnMark,
    lsPlayerMark,
    lsPlayerScore,
    lsP2Mark,
    lsTiedScore,
} = STORAGE;

const init = () => {
    const currentPlayer = localStorage.getItem(lsCurrentTurnMark);
    const board = JSON.parse(localStorage.getItem(lsBoardState));
    const turnCounter = +localStorage.getItem(lsTurnCount);
    const cpuMark = localStorage.getItem(lsCpuMark);
    const hasCpuMoved = board && board.some(row => row.some(cell => cell === cpuMark));
    const isGameOver = !!localStorage.getItem(lsIsGameOver);
    
    return {
        currentPlayer: currentPlayer || 'X',
        board: board || getEmptyBoard(),
        turnCounter: turnCounter || 1,
        isGameOver,
        isCpuFirstMove: hasCpuMoved || true
    };
};


const initialState = {};

const gameReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.setChangeTurn:
            return {
                ...state,
                board: [...action.payload],
                currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
                turnCounter: state.turnCounter + 1,
            };
        case ACTIONS.setCurrentPlayer:
            return {
                ...state,
                currentPlayer: action.payload
            };
        case ACTIONS.setGameBoard:
            return {
                ...state,
                board: [...action.payload]
            };
        case ACTIONS.resetGameBoard:
            return {
                ...state,
                board: getEmptyBoard()
            };
        case ACTIONS.setTurnCounter:
            return {
                ...state,
                turnCounter: action.payload
            };
        case ACTIONS.resetTurnCounter:
            return {
                ...state,
                turnCounter: 1
            };
        case ACTIONS.setGameOver:
            return {
                ...state,
                isGameOver: action.payload
            };
        case ACTIONS.setCpuMoveFirst:
            return {
                ...state,
                isCpuFirstMove: action.payload
            };
        case ACTIONS.resetGame:
            return {
                ...state,
                currentPlayer: 'X',
                board: getEmptyBoard(),
                turnCounter: 1,
                isGameOver: false,
            };
        default:
            return state;
    }
};

export const TicTacToe = () => {  
    const [gameState, dispatch] = useReducer(gameReducer, initialState, init);

    const { isGameOver } = gameState;

    // Make the screen look as the expected design 
    useEffect(() => {
        if (!localStorage.getItem(lsPlayerMark) && !localStorage.getItem(lsP2Mark)) {
            localStorage.setItem(lsPlayerMark, 'X');
            localStorage.setItem(lsPlayerScore, '0');
            localStorage.setItem(lsCpuMark, 'O');
            localStorage.setItem(lsCpuScore, '0');
            localStorage.setItem(lsTiedScore, '0');

            dispatch({
                type: ACTIONS.setCpuMoveFirst,
                payload: true
            });
        }
    }, []);
    
    useEffect(() => {
        const checkGameOver = () => {
            if (isGameOver) {
                dispatch({ type: ACTIONS.resetGame });
                localStorage.setItem(lsIsGameOver, '');
            }
        }

        window.addEventListener('load', checkGameOver);

        return () => {
            window.removeEventListener('load', checkGameOver);
        }
    }, [isGameOver]);
    

    return (
        <GameContext.Provider value={{ gameState, dispatch }}>
            <HashRouter>
                <AppRouter />
            </HashRouter>
        </GameContext.Provider>
    );
};
