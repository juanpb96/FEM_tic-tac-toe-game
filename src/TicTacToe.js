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
