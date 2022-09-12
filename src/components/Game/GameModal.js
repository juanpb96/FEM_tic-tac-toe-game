import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameContext } from '../../hocs/GameContext';
import { ASSETS_PATH } from '../../helpers/constants';
import { ACTIONS, MODAL_TYPES, STORAGE } from '../../types/types';
import { useAnimationOnUnmount } from '../../hooks/useAnimationOnUnmount';

const {
    lsBoardState,
    lsCurrentTurnMark,
    lsCpuMark,
    lsTurnCount,
} = STORAGE;

const TITLE_COLORS = {
    silver: 'color-silver',
    lightBlue: 'color-light-blue', 
    lightYellow: 'color-light-yellow', 
};

const WinnerMark = ({ mark }) => (
    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={mark}>
        {
            mark === 'X'
            ? (
                <path 
                    d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z" 
                    fill="#31C3BD" 
                    fillRule="evenodd"
                />
            )
            : <path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" fill="#F2B137"/>
        }
    </svg>                    
);

export const GameModal = ({ type, winnerMark, setShowModal }) => {
    const { dispatch } = useContext(GameContext);
    const navigate = useNavigate();
    const { setComponentToUnmount } = useAnimationOnUnmount(setShowModal);

    const contentRef = useRef(null);
    const resultRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        resultRef.current
            ? resultRef.current.focus()
            : titleRef.current.focus();
    }, []);

    const message = {
        title: 'TAKES THE ROUND',
        titleColor: '',
        imgSrc: !winnerMark ? '' : `${ASSETS_PATH}/icon-${winnerMark}.svg`,
        result: '',
        button1: 'QUIT',
        button2: 'NEXT ROUND',
    };

    if (winnerMark) {
        message.titleColor = (winnerMark === 'X') 
            ? TITLE_COLORS.lightBlue
            : TITLE_COLORS.lightYellow;
    }

    switch (type) {
        case MODAL_TYPES.restart:
            message.title = 'RESTART GAME?';
            message.titleColor = TITLE_COLORS.silver;
            message.button1 = 'NO, CANCEL';
            message.button2 = 'YES, RESTART';
            break;
        case MODAL_TYPES.tied:
            message.title = 'ROUND TIED';
            message.titleColor = TITLE_COLORS.silver;
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

    const { title, titleColor, imgSrc, result, button1, button2 } = message;

    const handleClick = ({ target }) => {
        if (target.textContent === 'QUIT') {
            navigate('/new-game', { replace: true });
        }

        if (target.textContent === 'NEXT ROUND' || target.textContent === 'YES, RESTART') {
            localStorage.removeItem(lsBoardState);
            localStorage.setItem(lsCurrentTurnMark, 'X');
            localStorage.setItem(lsTurnCount, '1');
            
            dispatch({ type: ACTIONS.resetGame });

            if (localStorage.getItem(lsCpuMark)) {
                dispatch({
                    type: ACTIONS.setCpuMoveFirst,
                    payload: true
                });
            }
        }

        contentRef.current.setAttribute('data-animation', 'modal-closing');
        setComponentToUnmount(contentRef.current);
    };

    const isRestartOrTied = [MODAL_TYPES.restart, MODAL_TYPES.tied].includes(type);

    return (
        <div ref={contentRef} className='[ modal-container ][ flex flex-center ]'>
            <div className='[ modal ][ flex flex-center flex-col ]'>
                { result && <p ref={resultRef} tabIndex='0' className='[ result ][ mb-4 color-silver fs-4 fw-bold ]'>{ result }</p> }
                <h2 ref={titleRef} className={`[ title ][ flex flex-center gap-2.5 mb-6 fw-bold ${ titleColor } letter-m tablet:gap-6 tablet:letter-l ${ isRestartOrTied ? 'tablet:mb-8' : '' } ]`}>
                    { winnerMark && <WinnerMark mark={winnerMark} /> }
                    { title }
                </h2>
                <div className='[ flex gap-4 ]'>
                    <button
                        className='[ button ][ silver ]'
                        data-type='secondary'
                        onClick={ handleClick }
                    >
                        { button1 }
                    </button>
                    <button
                        className='[ button ][ yellow ]'
                        data-type='secondary'
                        onClick={ handleClick }
                    >
                        { button2 }
                    </button>
                </div>
            </div>
        </div>
    );
};
