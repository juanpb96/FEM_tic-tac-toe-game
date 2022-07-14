import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PlayerCoxtext } from '../../hocs/PlayerContext';
import { GameBox } from './GameBox';


export const GameBoard = () => {
    const { player, setPlayer } = useContext(PlayerCoxtext);

    const emptyBoard = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    let initialBoard = localStorage.getItem('boardState');
    initialBoard = initialBoard && JSON.parse(initialBoard);

    const [board, setBoard] = useState(initialBoard || emptyBoard);

    const boardRef = useRef(null);

    const cpuMark = localStorage.getItem('CPUMark');
    const searchFirstMove = board.some(row => row.some(cell => cell === cpuMark));
    const isCpuFirstMove = useRef(!searchFirstMove);

    let p1Mark;

    if (cpuMark) {
        p1Mark = localStorage.getItem('playerMark');
    }

    const updateBoard = (row, col) => {
        setBoard(() => {
            board[row][col] = player;
            return board;
        });
        setPlayer(player === 'X' ? 'O' : 'X');
    };

    const clickBox = useCallback(
        (x, y) => {
            const buttons = boardRef.current.getElementsByTagName('button');
    
            console.log('Click', {x, y});
    
            switch (x) {
                case 0:
                    buttons[y].click();
                    break;
                case 1:
                    buttons[x + y + 2].click();
                    break;
                case 2:
                    buttons[x + y + 4].click();
                    break;
                default:
                    makeRandomMove();
                    break;
            }
        },
        [],
    );

    const makeCpuMove = useCallback(
        () => {
            let x = 0;
            let y = 0;
    
            // Check rows
            for (const [indexX, row] of board.entries()) {
                let ocurrences = 0;
    
                for (const [indexY, cell] of row.entries()) {
                    if (cell === p1Mark) {
                        ocurrences++;
                    } else if (cell === cpuMark) {
                        ocurrences--;
                    } else {
                        x = indexX;
                        y = indexY;
                    }
                }
    
                if (ocurrences === 2) {
                    clickBox(x, y);
                    return;
                }
            }
    
            // Check columns
            for (let col = 0; col < board.length; col++) {
                let ocurrences = 0;
    
                for (let row = 0; row < board.length; row++) {
                    const cell = board[row][col];
                    if (cell === p1Mark) {
                        ocurrences++;
                    } else if (cell === cpuMark) {
                        ocurrences--;
                    } else {
                        x = row;
                        y = col;
                    }
                }
    
                if (ocurrences === 2) {
                    clickBox(x, y);
                    return;
                }
            }
    
            // Check diagonals
            // Top to bottom
            let topBottomOcurrencies = 0;
    
            for (let i = 0; i < board.length; i++) {
                const cell = board[i][i];
                if (cell === p1Mark) {
                    topBottomOcurrencies++;
                } else if (cell === cpuMark) {
                    topBottomOcurrencies--;
                } else {
                    x = i;
                    y = i;
                }
            }
    
            if (topBottomOcurrencies === 2) {
                clickBox(x, y);
                return;
            }
    
            // Bottom to top
            let bottomTopOcurrencies = 0;
    
            for (let row = 2, col = 0; row >= 0; row--, col++) {
                const cell = board[row][col];
    
                if (cell === p1Mark) {
                    bottomTopOcurrencies++;
                } else if (cell === cpuMark) {
                    bottomTopOcurrencies--;
                } else {
                    x = row;
                    y = col;
                }
            }
    
            if (bottomTopOcurrencies === 2) {
                clickBox(x, y);
                return;
            }
    
            makeRandomMove();
        },
        [board, p1Mark, cpuMark, clickBox],
    );

    const makeRandomMove = () => {
        const buttons = boardRef.current.getElementsByTagName('button');

        let pos = Math.floor(Math.random() * buttons.length);
        
        while (buttons[pos].hasChildNodes()) {
            pos = Math.floor(Math.random() * buttons.length);
        }

        console.log('Random Move', pos);
        buttons[pos].click();
    };

    useEffect(() => {
        if (isCpuFirstMove.current && cpuMark === player) {
            isCpuFirstMove.current = false;
            makeRandomMove();
            return;
        }

        if (cpuMark === player) {
            makeCpuMove();
        }
    }, [cpuMark, player, makeCpuMove]);

    useEffect(() => {
        localStorage.setItem('boardState', JSON.stringify(board));
    }, [board, player]);
    

    return (
        <main
            style={{
                display: 'grid',
                gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)'
            }}
            ref={ boardRef }
        >
            {
                board.map(
                    (row, rowIndex) => row.map(
                        (cell, colIndex) => 
                            <GameBox
                                hasMark={ !!cell }
                                mark={ cell }
                                currentPlayer={ player }
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
