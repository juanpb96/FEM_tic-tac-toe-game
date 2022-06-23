import { useContext } from 'react';
import { ASSETS_PATH } from '../../helpers/constants';
import { PlayerCoxtext } from '../../hocs/PlayerContext';

export const GameHeader = () => {
    const { player } = useContext(PlayerCoxtext);

    return (
        <header>
            <h1>Tic tac toe</h1>
            <img src={`${ASSETS_PATH}/logo.svg`} alt='' />
            <section>
                <img src={`${ASSETS_PATH}/icon-turn-${player}.svg`} alt={ player } />
                <h2>TURN</h2>
            </section>
            <button aria-label='restart'>
                <img src={`${ASSETS_PATH}/icon-restart.svg`} alt='' />
            </button>
        </header>
    );
};
