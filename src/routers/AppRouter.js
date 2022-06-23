import { Routes, Route } from 'react-router-dom';
import { Game } from '../components/Game/Game';
import { NewGame } from '../components/NewGame/NewGame';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Game />} />
            <Route path='/new-game' element={<NewGame />} />
            <Route path='*' element={<Game />} />
        </Routes>
    );
};
