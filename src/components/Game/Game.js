import { useEffect, useState } from 'react';
import { GameBoard } from './GameBoard';
import { GameFooter } from './GameFooter';
import { GameHeader } from './GameHeader';
import { GameModal } from './GameModal';

const modalInitialState = {
    type: '',
    winnerMark: ''
};

export const Game = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalValues, setModalValues] = useState(modalInitialState);

    useEffect(() => {
        if (!showModal) {
            setModalValues(modalInitialState);
        }
    }, [showModal]);

    const { type, winnerMark } = modalValues;
    
    return (
        <>
            <GameHeader
                setModalValues={ setModalValues }
                setShowModal={ setShowModal } />
            {
                showModal &&
                <GameModal
                    type={ type }
                    winnerMark={ winnerMark }
                    setShowModal={ setShowModal }
                />
            }
            <GameBoard
                setModalValues={ setModalValues }
                setShowModal={ setShowModal }
            />
            <GameFooter />
        </>
    );
}
