import { useContext } from 'react';

import { GameContext } from '../../hocs/GameContext';

import { ASSETS_PATH } from '../../helpers/constants';
import { MODAL_TYPES } from '../../types/types';

export const GameHeader = ({ openModal }) => {
    const { gameState: { currentPlayer } } = useContext(GameContext);

    const handleRestart = () => {
        openModal(MODAL_TYPES.restart);
    };

    return (
        <header className='flex space-between align-center mb-16'>
            <h1 className='sr-only'>Tic tac toe</h1>
            <img src={`${ASSETS_PATH}/logo.svg`} alt='' />
            <section
                className='[ turn ][ flex gap-2.5 box-navy br-1.5 ]'
                data-type='secondary'
            >
                <img src={`${ASSETS_PATH}/icon-turn-${currentPlayer}.svg`} alt={ currentPlayer } />
                <h2 className='fs-3.5 color-silver'>TURN</h2>
            </section>
            <button 
                aria-label='restart'
                className='[ button-restart ][ br-1.5 ]'
                data-type='secondary'
                onClick={ handleRestart }
            >
                <img src={`${ASSETS_PATH}/icon-restart.svg`} alt='' />
            </button>
        </header>
    );
};
