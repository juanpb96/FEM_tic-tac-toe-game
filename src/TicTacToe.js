import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PlayerCoxtext } from './hocs/PlayerContext';
import { AppRouter } from './routers/AppRouter';

export const TicTacToe = () => {
    const [player, setPlayer] = useState('X');

    return (
        <PlayerCoxtext.Provider value={{
            player,
            setPlayer
        }}>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </PlayerCoxtext.Provider>
    );
};


//  {/* <!-- New game menu start --> */}

//  Pick player 1's mark
//  Remember: X goes first

//  New Game (vs CPU)
//  New Game (vs player)

//  {/* <!-- New game menu end --> */}

//  {/* <!-- Game board start --> */}

//  {/* <!-- x/o icon --> turn */}

//  {/* X (You) <!-- Your score --> */}
//  {/* Ties <!-- Ties score --> */}
//  {/* X (CPU) <!-- CPU score --> */}

//  Oh no, you lost
//  You won!
//  {/* Player <!-- 1/2 --> wins! */}

//  {/* <!-- x/o icon --> takes the round */}
//  Round tied
//  Restart game?

//  Quit
//  Next round
//  No, cancel
//  Yes, restart

//  {/* <!-- Game board end --> */}