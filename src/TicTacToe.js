import { useReducer } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRouter } from './routers/AppRouter';
import { GameContext } from './hocs/GameContext';

import { ACTIONS } from './types/types';
import { getEmptyBoard } from './helpers/getEmptyBoard';

const initialState = {
    currentPlayer: 'X',
    board: getEmptyBoard(),
    turnCounter: 1,
    isGameOver: false,
    isCpuFirstMove: true
};

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
    const [gameState, dispatch] = useReducer(gameReducer, initialState);    

    return (
        <GameContext.Provider value={{ gameState, dispatch }}>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </GameContext.Provider>
    );
};
