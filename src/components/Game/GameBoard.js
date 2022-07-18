import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PlayerCoxtext } from '../../hocs/PlayerContext';
import { MODAL_TYPES, STORAGE } from '../../types/types';
import { GameBox } from './GameBox';

const {
    lsBoardState,
    lsPlayerMark,
    lsCpuMark,
    lsP1Mark,
    lsP2Mark,
    lsCurrentTurnMark,
    lsCpuScore,
    lsPlayerScore,
    lsP1Score,
    lsP2Score,
} = STORAGE;

export const GameBoard = ({ setModalValues, setShowModal }) => {
    const { player, setPlayer } = useContext(PlayerCoxtext);

    const emptyBoard = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    let initialBoard = localStorage.getItem(lsBoardState);
    initialBoard = initialBoard && JSON.parse(initialBoard);

    const [board, setBoard] = useState(initialBoard || emptyBoard);

    const boardRef = useRef(null);
    const isGameOver = useRef(false);

    const cpuMark = localStorage.getItem(lsCpuMark);
    const searchFirstMove = board.some(row => row.some(cell => cell === cpuMark));
    const isCpuFirstMove = useRef(!searchFirstMove);

    let p1Mark;

    if (cpuMark) {
        p1Mark = localStorage.getItem(lsPlayerMark);
    }

    const updateBoard = (row, col) => {
        setBoard(() => {
            board[row][col] = player;
            return board;
        });
        setPlayer(player === 'X' ? 'O' : 'X');
    };

    const updateCpuScore = () => {
        const cpuCurrentScore = +localStorage.getItem(lsCpuScore);
        
        localStorage.setItem(
            lsCpuScore,
            cpuCurrentScore ? cpuCurrentScore + 1 : 1
        );
    };

    /*
    *   FIXME: Improve logic to avoid too many loops to decide wheter
    *           user has won or cpu
    */
    const checkEndGame = () => {
        let messageType = '';

        board.forEach(row => {
            if (row.every(cell => cell === 'X')) {
                if (cpuMark === 'X') {
                    messageType = MODAL_TYPES.player_lost;
                    updateCpuScore();
                } else if (p1Mark === 'X') {
                    messageType = MODAL_TYPES.player_won;
                }

                setModalValues(prev => ({
                    ...prev,
                    type: messageType,
                    winnerMark: 'X',
                }));
                setShowModal(true);
                isGameOver.current = true;
                return;
            }

            if (row.every(cell => cell === 'O')) {
                if (cpuMark === 'O') {
                    messageType = MODAL_TYPES.player_lost;
                    updateCpuScore();
                } else if (p1Mark === 'O') {
                    messageType = MODAL_TYPES.player_won;
                }

                setModalValues(prev => ({
                    ...prev,
                    type: messageType,
                    winnerMark: 'O',
                }));
                setShowModal(true);
                isGameOver.current = true;
                return;
            }
        });

        let ocurrencesX = 0;
        let ocurrencesO = 0;

        for (let col = 0; col < board.length; col++) {
            ocurrencesX = 0;
            ocurrencesO = 0;

            for (let row = 0; row < board.length; row++) {
                const cell = board[row][col];

                if (cell === 'X') {
                    ocurrencesX++;
                } 

                if (cell === 'O') {
                    ocurrencesO++;
                }
            }

            if (ocurrencesX === 3) {
                if (cpuMark === 'X') {
                    messageType = MODAL_TYPES.player_lost;
                    updateCpuScore();
                } else if (p1Mark === 'X') {
                    messageType = MODAL_TYPES.player_won;
                }

                setModalValues(prev => ({
                    type: messageType,
                    winnerMark: 'X'
                }));
                setShowModal(true);
                isGameOver.current = true;
                return;
            } else if (ocurrencesO === 3) {
                if (cpuMark === 'O') {
                    messageType = MODAL_TYPES.player_lost;
                    updateCpuScore();
                } else if (p1Mark === 'O') {
                    messageType = MODAL_TYPES.player_won;
                }

                setModalValues(prev => ({
                    type: messageType,
                    winnerMark: 'O'
                }));
                setShowModal(true);
                isGameOver.current = true;
                return;
            }
        }

        // TODO: Validate diagonal victory and players marks
        // Top to bottom
        ocurrencesX = 0;
        ocurrencesO = 0;

        for (let i = 0; i < board.length; i++) {
            const cell = board[i][i];
            
            if (cell === 'X') {
                ocurrencesX++;
            } 

            if (cell === 'O') {
                ocurrencesO++;
            }
        }

        if (ocurrencesX === 3) {
            if (cpuMark === 'X') {
                messageType = MODAL_TYPES.player_lost;
                updateCpuScore();
            } else if (p1Mark === 'X') {
                messageType = MODAL_TYPES.player_won;
            }

            setModalValues(prev => ({
                ...prev,
                type: messageType,
                winnerMark: 'X'
            }));
            setShowModal(true);
            isGameOver.current = true;
            return;
        } else if (ocurrencesO === 3) {
            if (cpuMark === 'O') {
                messageType = MODAL_TYPES.player_lost;
                updateCpuScore();
            } else if (p1Mark === 'O') {
                messageType = MODAL_TYPES.player_won;
            }

            setModalValues(prev => ({
                ...prev,
                type: messageType,
                winnerMark: 'O'
            }));
            setShowModal(true);
            isGameOver.current = true;
            return;
        }

        // Bottom to top
        ocurrencesX = 0;
        ocurrencesO = 0;

        for (let i = 2; i > 0; i--) {
            const cell = board[i][i];
            
            if (cell === 'X') {
                ocurrencesX++;
            } 

            if (cell === 'O') {
                ocurrencesO++;
            }
        }

        if (ocurrencesX === 3) {
            if (cpuMark === 'X') {
                messageType = MODAL_TYPES.player_lost;
                updateCpuScore();
            } else if (p1Mark === 'X') {
                messageType = MODAL_TYPES.player_won;
            }

            setModalValues(prev => ({
                ...prev,
                type: messageType,
                winnerMark: 'X'
            }));
            setShowModal(true);
            isGameOver.current = true;
            return;
        } else if (ocurrencesO === 3) {
            if (cpuMark === 'O') {
                messageType = MODAL_TYPES.player_lost;
                updateCpuScore();
            } else if (p1Mark === 'O') {
                messageType = MODAL_TYPES.player_won;
            }

            setModalValues(prev => ({
                ...prev,
                type: messageType,
                winnerMark: 'O'
            }));
            setShowModal(true);
            isGameOver.current = true;
            return;
        }
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

            checkEndGame();
        },
        [],
    );

    const makeCpuMove = useCallback(
        () => {
            const blockMove = {
                x: 0,
                y: 0,
                shouldBlock: false,
            };
            let x = 0;
            let y = 0;
            let playerOcurrences = 0;
            let cpuOcurrences = 0;
    
            // Check rows
            for (const [indexX, row] of board.entries()) {
                playerOcurrences = 0;
                cpuOcurrences = 0;
    
                for (const [indexY, cell] of row.entries()) {
                    if (cell === p1Mark) {
                        playerOcurrences++;
                        cpuOcurrences--;
                    } else if (cell === cpuMark) {
                        playerOcurrences--;
                        cpuOcurrences++;
                    } else {
                        x = indexX;
                        y = indexY;
                    }
                }
    
                if (playerOcurrences === 2) {
                    blockMove.x = x;
                    blockMove.y = y;
                    blockMove.shouldBlock = true;
                }

                if (cpuOcurrences === 2) {
                    clickBox(x, y);
                    return;
                }
            }

            if (blockMove.shouldBlock) {
                clickBox(blockMove.x, blockMove.y);
                return;
            }
            
            // Check columns
            for (let col = 0; col < board.length; col++) {
                playerOcurrences = 0;
                cpuOcurrences = 0;
    
                for (let row = 0; row < board.length; row++) {
                    const cell = board[row][col];

                    if (cell === p1Mark) {
                        playerOcurrences++;
                        cpuOcurrences--;
                    } else if (cell === cpuMark) {
                        playerOcurrences--;
                        cpuOcurrences++;
                    } else {
                        x = row;
                        y = col;
                    }
                }
    
                if (playerOcurrences === 2) {
                    blockMove.x = x;
                    blockMove.y = y;
                    blockMove.shouldBlock = true;
                }

                if (cpuOcurrences === 2) {
                    clickBox(x, y);
                    return;
                }
            }

            if (blockMove.shouldBlock) {
                clickBox(blockMove.x, blockMove.y);
                return;
            }
    
            // Check diagonals
            // Top to bottom
            playerOcurrences = 0;
            cpuOcurrences = 0;

            for (let i = 0; i < board.length; i++) {
                const cell = board[i][i];
                if (cell === p1Mark) {
                    playerOcurrences++;
                    cpuOcurrences--;
                } else if (cell === cpuMark) {
                    playerOcurrences--;
                    cpuOcurrences++;
                } else {
                    x = i;
                    y = i;
                }
            }

            if (cpuOcurrences === 2 || playerOcurrences === 2) {
                clickBox(x, y);
                return;
            }
    
            // Bottom to top
            playerOcurrences = 0;
            cpuOcurrences = 0;
    
            for (let row = 2, col = 0; row >= 0; row--, col++) {
                const cell = board[row][col];
    
                if (cell === p1Mark) {
                    playerOcurrences++;
                    cpuOcurrences--;
                } else if (cell === cpuMark) {
                    playerOcurrences--;
                    cpuOcurrences++;
                } else {
                    x = row;
                    y = col;
                }
            }
    
            if (cpuOcurrences === 2 || playerOcurrences === 2) {
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

        checkEndGame();
    };

    useEffect(() => {
        if (isCpuFirstMove.current && cpuMark === player) {
            isCpuFirstMove.current = false;
            makeRandomMove();
            return;
        }

        if (cpuMark === player && !isGameOver.current) {
            makeCpuMove();
        }
    }, [cpuMark, player, makeCpuMove]);

    useEffect(() => {
        localStorage.setItem(lsBoardState, JSON.stringify(board));
        localStorage.setItem(lsCurrentTurnMark, player);
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
