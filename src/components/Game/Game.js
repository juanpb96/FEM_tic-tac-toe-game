import { useContext, useEffect, useState } from 'react';

import { GameContext } from '../../hocs/GameContext';
import { GameBoard } from './GameBoard';
import { GameFooter } from './GameFooter';
import { GameHeader } from './GameHeader';
import { GameModal } from './GameModal';

import { ACTIONS, STORAGE } from '../../types/types';

import './game.scss';

const modalInitialState = {
    type: '',
    winnerMark: ''
};

const {
    lsBoardState,
    lsTurnCount,
    lsCpuMark,
    lsCurrentTurnMark,
} = STORAGE;

export const Game = () => {
    const { gameState, dispatch } = useContext(GameContext);

    const {
        currentPlayer,
        board,
        turnCounter,
    } = gameState;

    const [showModal, setShowModal] = useState(false);
    const [modalValues, setModalValues] = useState(modalInitialState);

    const { type, winnerMark } = modalValues;

    const openModal = (type, winnerMark = '') => {
        setModalValues({
            type,
            winnerMark
        });
        setShowModal(true);
    };

    // TODO: Check if player marks (P1, P2) need to be initialized here too
    useEffect(() => {
        if (!board) {
            const initialBoard = localStorage.getItem(lsBoardState);
            
            if (initialBoard) {
                dispatch({
                    type: ACTIONS.setGameBoard,
                    payload: JSON.parse(initialBoard)
                });
            }
        }

        if (!currentPlayer) {
            const currentTurnMark = localStorage.getItem(lsCurrentTurnMark);
    
            if (currentTurnMark) {
                dispatch({
                    type: ACTIONS.setCurrentPlayer,
                    payload: currentTurnMark
                });
            }
        }

        if (!turnCounter) {
            const turnCounter = +localStorage.getItem(lsTurnCount);
    
            if (turnCounter > 0) {
                dispatch({
                    type: ACTIONS.setTurnCounter,
                    payload: turnCounter
                });
            }
        }

        const cpuMark = localStorage.getItem(lsCpuMark);
        const hasCpuMoved = gameState.board.some(row => row.some(cell => cell === cpuMark));

        if (hasCpuMoved) {
            dispatch({
                type: ACTIONS.setCpuMoveFirst,
                payload: false
            });
        }
    }, []);

    useEffect(() => {
        if (!showModal) {
            setModalValues(modalInitialState);
        }
    }, [showModal]);
    
    return (
        <div className='[ page-content align-self-start mt-6 tablet:align-self-center tablet:mt-0 ]'>
            <GameHeader openModal={openModal} />
            {
                showModal &&
                <GameModal
                    type={ type }
                    winnerMark={ winnerMark }
                    setShowModal={ setShowModal }
                />
            }
            <GameBoard openModal={openModal} />
            <GameFooter />
        </div>
    );
}
