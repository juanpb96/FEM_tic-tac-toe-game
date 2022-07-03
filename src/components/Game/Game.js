import { GameBoard } from './GameBoard';
import { GameFooter } from './GameFooter';
import { GameHeader } from './GameHeader';

export const Game = () => {
    return (
        <>
            <GameHeader />
            <GameBoard />
            <GameFooter />
        </>
    );
}
