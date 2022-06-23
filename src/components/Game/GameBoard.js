import { useContext } from 'react';
import { PlayerCoxtext } from '../../hocs/PlayerContext';
import { GameBox } from './GameBox';

export const GameBoard = () => {
    const { player, setPlayer } = useContext(PlayerCoxtext);

    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    const updateBoard = (row, col) => {
        board[row][col] = player;
        setPlayer(player === 'X' ? 'O' : 'X');
    };

    return (
        <main>
            {
                board.map(
                    (row, rowIndex) => row.map(
                        (cell, colIndex) => 
                            <GameBox 
                                player={ player }
                                row={ rowIndex }
                                col={ colIndex }
                                updateBoard={ updateBoard }
                                key={`${rowIndex}${colIndex}`} 
                            />
                    )
                )
            }
        </main>
    );
};
