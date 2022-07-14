import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PlayerCoxtext } from './hocs/PlayerContext';
import { AppRouter } from './routers/AppRouter';

export const TicTacToe = () => {
    const currentPlayer = localStorage.getItem('currentTurnMark');
    const [player, setPlayer] = useState(currentPlayer || 'X');

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
