import { useEffect, useState } from 'react';

import { GameBoard } from './GameBoard';
import { GameFooter } from './GameFooter';
import { GameHeader } from './GameHeader';
import { GameModal } from './GameModal';

import './game.scss';

const modalInitialState = {
    type: '',
    winnerMark: ''
};

export const Game = () => {
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
