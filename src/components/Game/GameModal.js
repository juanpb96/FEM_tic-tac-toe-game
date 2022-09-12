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
                    { imgSrc && <img src={imgSrc} alt={winnerMark} /> }
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
