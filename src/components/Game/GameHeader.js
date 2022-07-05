import { useContext } from 'react';
import { ASSETS_PATH } from '../../helpers/constants';
import { PlayerCoxtext } from '../../hocs/PlayerContext';

export const GameHeader = ({ setModalValues, setShowModal }) => {
    const { player } = useContext(PlayerCoxtext);

    const handleRestart = () => {
        setModalValues(state => ({
            ...state,
            type: 'restart'
        }));
        setShowModal(true);
    };

    return (
        <header>
            <h1>Tic tac toe</h1>
            <img src={`${ASSETS_PATH}/logo.svg`} alt='' />
            <section>
                <img src={`${ASSETS_PATH}/icon-turn-${player}.svg`} alt={ player } />
                <h2>TURN</h2>
            </section>
            <button aria-label='restart' onClick={ handleRestart }>
                <img src={`${ASSETS_PATH}/icon-restart.svg`} alt='' />
            </button>
        </header>
    );
};
