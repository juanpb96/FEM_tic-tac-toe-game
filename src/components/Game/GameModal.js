import { ASSETS_PATH } from '../../helpers/constants';

export const GameModal = ({ type, winnerMark, setShowModal }) => {
    const message = {
        title: 'TAKES THE ROUND',
        imgSrc: !winnerMark ? '' : `${ASSETS_PATH}/icon-${winnerMark}.svg`,
        result: '',
        button1: 'QUIT',
        button2: 'NEXT ROUND',
    };

    switch (type) {
        case 'restart':
            message.title = 'RESTART GAME?';
            message.button1 = 'NO, CANCEL';
            message.button2 = 'YES, RESTART';
            break;
        case 'tied':
            message.title = 'ROUND TIED';
            break;
        case 'player-won':
            message.result = 'YOU WON!';
            break;
        case 'player-lost':
            message.result = 'OH NO, YOU LOST…';
            break;
        case 'player1-won':
            message.result = 'PLAYER 1 WINS!';
            break;
        case 'player2-won':
            message.result = 'PLAYER 2 WINS!';
            break;
        default:
            break;      
    }

    const { title, imgSrc, result, button1, button2 } = message;

    const handleClick = () => {
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
