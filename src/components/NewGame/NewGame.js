import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameContext } from '../../hocs/GameContext';
import { ASSETS_PATH } from '../../helpers/constants';
import { ACTIONS, STORAGE } from '../../types/types';

import './newGame.scss';

const {
    lsPlayerMark,
    lsCpuMark,
    lsP1Mark,
    lsP2Mark,
    lsCurrentTurnMark,
    lsCpuScore,
    lsPlayerScore,
    lsP1Score,
    lsP2Score,
    lsTiedScore,
    lsTurnCount,
} = STORAGE;

export const NewGame = () => {
    const { dispatch } = useContext(GameContext);
    const [isMarkXChecked, setIsMarkXChecked] = useState(false);

    const navigate = useNavigate();

    // TODO: Add animation when toggling marks

    const handleMarkChange = (mark) => {
        if (isMarkXChecked && mark === 'X') {
            return;
        }

        setIsMarkXChecked(mark === 'X');
    };

    const handleNewGame = (isPlayerVsCPU) => {
        localStorage.clear();

        const p1 = isMarkXChecked ? 'X' : 'O';
        const p2 = isMarkXChecked ? 'O' : 'X';

        if (isPlayerVsCPU) {
            localStorage.setItem(lsPlayerMark, p1);
            localStorage.setItem(lsCpuMark, p2);
            localStorage.setItem(lsCpuScore, '0');
            localStorage.setItem(lsPlayerScore, '0');

            dispatch({
                type: ACTIONS.setCpuMoveFirst,
                payload: true
            });
        } else {
            localStorage.setItem(lsP1Mark, p1);
            localStorage.setItem(lsP2Mark, p2);
            localStorage.setItem(lsP1Score, '0');
            localStorage.setItem(lsP2Score, '0');
        }

        localStorage.setItem(lsTiedScore, '0');
        localStorage.setItem(lsCurrentTurnMark, 'X');
        localStorage.setItem(lsTurnCount, '1');

        dispatch({ type: ACTIONS.resetGame });

        navigate('/', { replace: true });
    };

    return (
        <main className='[ flow ][ page-content ]'>
            <h1 className="sr-only">Tic tac toe</h1>
            <img className='logo' src={`${ASSETS_PATH}/logo.svg`} alt=''/>

            <section className='[ pick-player ]' role='radiogroup' aria-labelledby='mark-label'>
                <h2 id='mark-label'>PICK PLAYER 1’S MARK</h2>
                <div>
                    <div 
                        role='radio' 
                        aria-checked={isMarkXChecked} 
                        tabIndex='0'
                        onClick={() => handleMarkChange('X')}
                    >
                        {
                            isMarkXChecked
                            ? <img src={`${ASSETS_PATH}/icon-x.svg`} alt='X'/>  
                            : <img src={`${ASSETS_PATH}/icon-x-outline.svg`} alt='X'/>
                        }
                    </div>
                    <div 
                        role='radio' 
                        aria-checked={!isMarkXChecked} 
                        tabIndex='-1'
                        onClick={() => handleMarkChange('O')}
                    >
                        {
                            !isMarkXChecked
                            ? <img src={`${ASSETS_PATH}/icon-o.svg`} alt='O'/>
                            : <img src={`${ASSETS_PATH}/icon-o-outline.svg`} alt='O'/>
                        }
                    </div>
                </div>
                <p>REMEMBER : X GOES FIRST</p>
            </section>

            <button 
                className='[ button ][ yellow ]'
                data-type='primary'
                onClick={ () => handleNewGame(true) }>New Game (VS CPU)
            </button>
            <button 
                className='[ button ][ blue ]'
                data-type='primary'
                onClick={ () => handleNewGame(false) }>New Game (VS Player)
            </button>
        </main>
    );
};
