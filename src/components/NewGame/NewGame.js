import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameContext } from '../../hocs/GameContext';
import { ASSETS_PATH } from '../../helpers/constants';
import { isKeyEnterPressed } from '../../helpers/keyboard';
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

    const handleMarkChange = (mark, key = 'Enter') => {
        if (!isKeyEnterPressed(key) || (isMarkXChecked && mark === 'X')) {
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

            <section className='selection-container' role='radiogroup' aria-labelledby='mark-label'>
                <h2 id='mark-label' className='[ fs-4 color-silver letter-xs mb-6 ]'>PICK PLAYER 1’S MARK</h2>
                <div className='[ flex bg-dark-navy mb-4 px-2 py-2.5 br-2.5 ]'>
                    <div 
                        role='radio' 
                        aria-checked={isMarkXChecked} 
                        aria-labelledby='label-x'
                        tabIndex='0'
                        className='[ pick-mark ][ flex flex-1 flex-center py-3 br-2.5 ]'
                        onClick={() => handleMarkChange('X')}
                        onKeyUp={({ key }) => handleMarkChange('X', key)}
                    >
                        <span id='label-x' className='sr-only'>X</span>
                        <svg role='presentation' width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M31.5569 5.28973L26.7103 0.443061C26.1195 -0.147687 25.1617 -0.147687 24.571 0.443061L16 9.01404L7.42902 0.443061C6.83827 -0.147687 5.88048 -0.147687 5.28973 0.443061L0.443061 5.28973C-0.147687 5.88048 -0.147687 6.83827 0.443061 7.42902L9.01404 16L0.443061 24.571C-0.147687 25.1617 -0.147687 26.1195 0.443061 26.7103L5.28973 31.5569C5.88048 32.1477 6.83827 32.1477 7.42902 31.5569L16 22.986L24.571 31.5569C25.1617 32.1477 26.1195 32.1477 26.7103 31.5569L31.5569 26.7103C32.1477 26.1195 32.1477 25.1617 31.5569 24.571L22.986 16L31.5569 7.42902C32.1477 6.83827 32.1477 5.88048 31.5569 5.28973Z" fill=""/>
                        </svg>
                    </div>
                    <div 
                        role='radio' 
                        aria-checked={!isMarkXChecked} 
                        aria-labelledby='label-o'
                        tabIndex='0'
                        className='[ pick-mark ][ flex flex-1 flex-center py-3 br-2.5 ]'
                        onClick={() => handleMarkChange('O')}
                        onKeyUp={({ key }) => handleMarkChange('O', key)}
                    >
                        <span id='label-o' className='sr-only'>O</span>
                        <svg role='presentation' width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M31.7412 15.8706C31.7412 7.10551 24.6357 0 15.8706 0C7.10551 0 0 7.10551 0 15.8706C0 24.6357 7.10551 31.7412 15.8706 31.7412C24.6357 31.7412 31.7412 24.6357 31.7412 15.8706ZM9.4048 15.8706C9.4048 12.2996 12.2996 9.4048 15.8706 9.4048C19.4416 9.4048 22.3364 12.2996 22.3364 15.8706C22.3364 19.4416 19.4416 22.3364 15.8706 22.3364C12.2996 22.3364 9.4048 19.4416 9.4048 15.8706Z" fill=""/>
                        </svg>
                    </div>
                </div>
                <p className='[ fs-3.5 color-silver opacity ]'>REMEMBER : X GOES FIRST</p>
            </section>

            <div className='[ flex flex-col gap-4 tablet:gap-5 ]'>
                <button 
                    className='[ button ][ yellow ]'
                    data-type='primary'
                    onClick={ () => handleNewGame(true) }
                >
                    New Game (VS CPU)
                </button>
                <button 
                    className='[ button ][ blue ]'
                    data-type='primary'
                    onClick={ () => handleNewGame(false) }
                >
                    New Game (VS Player)
                </button>
            </div>
        </main>
    );
};
