import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerCoxtext } from '../../hocs/PlayerContext';
import { ASSETS_PATH } from '../../helpers/constants';
import { MODAL_TYPES, STORAGE } from '../../types/types';

const {
    lsBoardState,
    lsCurrentTurnMark,
    lsTurnCount,
} = STORAGE;

export const GameModal = ({ type, winnerMark, setShowModal }) => {
    const { setPlayer } = useContext(PlayerCoxtext);
    const navigate = useNavigate();

    const message = {
        title: 'TAKES THE ROUND',
        imgSrc: !winnerMark ? '' : `${ASSETS_PATH}/icon-${winnerMark}.svg`,
        result: '',
        button1: 'QUIT',
        button2: 'NEXT ROUND',
    };

    switch (type) {
        case MODAL_TYPES.restart:
            message.title = 'RESTART GAME?';
            message.button1 = 'NO, CANCEL';
            message.button2 = 'YES, RESTART';
            break;
        case MODAL_TYPES.tied:
            message.title = 'ROUND TIED';
            break;
        case MODAL_TYPES.player_won:
            message.result = 'YOU WON!';
            break;
        case MODAL_TYPES.player_lost:
            message.result = 'OH NO, YOU LOST…';
            break;
        case MODAL_TYPES.player1_won:
            message.result = 'PLAYER 1 WINS!';
            break;
        case MODAL_TYPES.player2_won:
            message.result = 'PLAYER 2 WINS!';
            break;
        default:
            break;      
    }

    const { title, imgSrc, result, button1, button2 } = message;

    const handleClick = ({ target }) => {
        if (target.textContent === 'QUIT') {
            navigate('/new-game', { replace: true });
        }

        if (target.textContent === 'NEXT ROUND' || target.textContent === 'YES, RESTART') {
            localStorage.removeItem(lsBoardState);
            localStorage.setItem(lsCurrentTurnMark, 'X');
            localStorage.setItem(lsTurnCount, '1');

            setPlayer('X');
        }
        
        setShowModal(false);
    };

    return (
        <>
            { result && <p>{ result }</p> }
            <h2>
                { imgSrc && <img src={imgSrc} alt={winnerMark} /> }
                { title }
            </h2>
            <button onClick={ handleClick }>{ button1 }</button>
            <button onClick={ handleClick }>{ button2 }</button>
        </>
    );
};
