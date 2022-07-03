import { useContext, useEffect, useState } from 'react';
import { PlayerCoxtext } from '../../hocs/PlayerContext';
import { GameBox } from './GameBox';

export const GameBoard = () => {
    const { player, setPlayer } = useContext(PlayerCoxtext);
    const [board, setBoard] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]);

    const cpuMark = localStorage.getItem('CPUMark');
    let p1;

    if (cpuMark) {
        p1 = localStorage.getItem('playerMark');
    }

    const updateBoard = (row, col) => {
        setBoard(() => {
            board[row][col] = player;
            return board;
        });
        setPlayer(player === 'X' ? 'O' : 'X');
    };

    const doCpuMove = () => {
        const buttons = document.getElementsByTagName('button');

        let pos = Math.floor(Math.random() * 9);
        
        while (buttons[pos].hasChildNodes()) {
            pos = Math.floor(Math.random() * 9);
        }

        buttons[pos].click();
    };

    useEffect(() => {
        if (cpuMark === player) {
            doCpuMove();    
        }
    }, [cpuMark, player])
    

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
