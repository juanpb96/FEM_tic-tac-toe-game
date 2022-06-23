import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS_PATH } from '../../helpers/constants';


export const NewGame = () => {
    const [isMarkXChecked, setIsMarkXChecked] = useState(false);
    const [isMarkOChecked, setIsMarkOChecked] = useState(true);

    const navigate = useNavigate();

    // TODO: Add animation when toggling marks

    const handleMarkChange = ({target}) => {
        if (target['aria-checked']) {
            return;
        }

        setIsMarkXChecked(!isMarkXChecked);
        setIsMarkOChecked(!isMarkOChecked);
    };

    const handleNewGame = (isPlayerVsCPU) => {
        localStorage.clear();

        const p1Mark = isMarkXChecked ? 'X' : 'O';
        const p2Mark = isMarkXChecked ? 'O' : 'X';

        if (isPlayerVsCPU) {
            localStorage.setItem('playerMark', p1Mark);
            localStorage.setItem('CPUMark', p2Mark);
        } else {
            localStorage.setItem('p1Mark', p1Mark);
            localStorage.setItem('p2Mark', p2Mark);
        }

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
                        onClick={handleMarkChange}
                    >
                        {
                            isMarkXChecked
                            ? <img src={`${ASSETS_PATH}/icon-x-outline.svg`} alt='X'/>  
                            : <img src={`${ASSETS_PATH}/icon-x.svg`} alt='X'/>
                        }
                    </div>
                    <div 
                        role='radio' 
                        aria-checked={isMarkOChecked} 
                        tabIndex='-1'
                        onClick={handleMarkChange}
                    >
                        {
                            isMarkOChecked
                            ? <img src={`${ASSETS_PATH}/icon-o-outline.svg`} alt='O'/>
                            : <img src={`${ASSETS_PATH}/icon-o.svg`} alt='O'/>
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
