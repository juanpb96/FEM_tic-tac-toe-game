import { useState } from "react";

export const NewGame = () => {
    const [isMarkXChecked, setIsMarkXChecked] = useState(false);
    const [isMarkOChecked, setIsMarkOChecked] = useState(true);

    // TODO: Add animation when toggling marks

    const handleMarkChange = ({target}) => {
        if (target['aria-checked']) {
            return;
        }

        setIsMarkXChecked(!isMarkXChecked);
        setIsMarkOChecked(!isMarkOChecked);
    };

    return (
        <main>
            <h1 className="sr-only">Tic tac toe</h1>
            <img src={`${process.env.PUBLIC_URL}/assets/logo.svg`} alt=''/>

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
                            ? <img src={`${process.env.PUBLIC_URL}/assets/icon-x-outline.svg`} alt='X'/>  
                            : <img src={`${process.env.PUBLIC_URL}/assets/icon-x.svg`} alt='X'/>
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
                            ? <img src={`${process.env.PUBLIC_URL}/assets/icon-o-outline.svg`} alt='O'/>
                            : <img src={`${process.env.PUBLIC_URL}/assets/icon-o.svg`} alt='O'/>
                        }
                    </div>
                </div>
                <p>REMEMBER : X GOES FIRST</p>
            </section>

            <button>New Game (VS CPU)</button>
            <button>New Game (VS Player)</button>
        </main>
    );
};
