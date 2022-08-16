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
        <header>
            <h1>Tic tac toe</h1>
            <img src={`${ASSETS_PATH}/logo.svg`} alt='' />
            <section>
                <img src={`${ASSETS_PATH}/icon-turn-${currentPlayer}.svg`} alt={ currentPlayer } />
                <h2>TURN</h2>
            </section>
            <button aria-label='restart' onClick={ handleRestart }>
                <img src={`${ASSETS_PATH}/icon-restart.svg`} alt='' />
            </button>
        </header>
    );
};
