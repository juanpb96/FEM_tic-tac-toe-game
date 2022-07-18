import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS_PATH } from '../../helpers/constants';
import { STORAGE } from '../../types/types';

const {
    playerMark,
    playerScore,
    cpuMark,
    cpuScore,
    p1Mark,
    p1Score,
    p2Mark,
    p2Score,
    currentTurnMark
} = STORAGE;

export const NewGame = () => {
    const [isMarkXChecked, setIsMarkXChecked] = useState(false);

    const p1MarkRef = useRef('O');
    const p2MarkRef = useRef('X');

    const navigate = useNavigate();

    // TODO: Add animation when toggling marks

    const handleMarkChange = (mark) => {
        if (isMarkXChecked && mark === 'X') {
            return;
        }

        p1MarkRef.current = mark;
        p2MarkRef.current = mark === 'X' ? 'O' : 'X';

        setIsMarkXChecked(mark === 'X');
    };

    const handleNewGame = (isPlayerVsCPU) => {
        localStorage.clear();

        if (isPlayerVsCPU) {
            const cpu = p1MarkRef.current === 'X' ? 'O' : 'X';

            localStorage.setItem(playerMark, p1MarkRef.current);
            localStorage.setItem(cpuMark, cpu);
            localStorage.setItem(cpuScore, '0');
            localStorage.setItem(playerScore, '0');
        } else {
            localStorage.setItem(p1Mark, p1MarkRef.current);
            localStorage.setItem(p2Mark, p2MarkRef.current);
            localStorage.setItem(p1Score, '0');
            localStorage.setItem(p2Score, '0');
        }

        localStorage.setItem(currentTurnMark, 'X');
        navigate('/', { replace: true });
    };

    return (
        <main>
            <h1 className="sr-only">Tic tac toe</h1>
            <img src={`${ASSETS_PATH}/logo.svg`} alt=''/>

            <section role='radiogroup' aria-labelledby='mark-label'>
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

            <button onClick={ () => handleNewGame(true) }>New Game (VS CPU)</button>
            <button onClick={ () => handleNewGame(false) }>New Game (VS Player)</button>
        </main>
    );
};
