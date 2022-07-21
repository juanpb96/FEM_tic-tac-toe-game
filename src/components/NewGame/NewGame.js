import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS_PATH } from '../../helpers/constants';
import { PlayerCoxtext } from '../../hocs/PlayerContext';
import { STORAGE } from '../../types/types';

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
} = STORAGE;

export const NewGame = () => {
    const { setPlayer } = useContext(PlayerCoxtext);
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
        } else {
            localStorage.setItem(lsP1Mark, p1);
            localStorage.setItem(lsP2Mark, p2);
            localStorage.setItem(lsP1Score, '0');
            localStorage.setItem(lsP2Score, '0');
        }

        localStorage.setItem(lsCurrentTurnMark, 'X');
        setPlayer('X');

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
