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

const USER = {
    player: 'player',
    p1: 'p1',
    p2: 'p2,',
    cpu: 'cpu',
};

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

        console.log(board);
    };

    const updateScore = (winner) => {
        switch (winner) {
            case USER.cpu:
                const cpuCurrentScore = +localStorage.getItem(lsCpuScore);
                localStorage.setItem(
                    lsCpuScore,
                    cpuCurrentScore ? cpuCurrentScore + 1 : 1
                );
                return;
            case USER.player:
                const playerCurrentScore = +localStorage.getItem(lsPlayerScore);
        
                localStorage.setItem(
                    lsPlayerScore,
                    playerCurrentScore ? playerCurrentScore + 1 : 1
                );
                return;
            default:
                break;
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
        },
        [],
    );

    const displayModal = (messageType, mark) => {   
        setModalValues(prev => ({
            ...prev,
            type: messageType,
            winnerMark: mark,
        }));
        setShowModal(true);
    };

    const checkWinCondition = (p1Marks, p2Marks, isCellEmpty = false) => {
        // FIXME: Modify this when implementing logic for 2 players

        if (p1Marks < 3 && p2Marks < 3 && !(isCellEmpty && p2Marks === 2)) {
            return false;
        }

        console.log('GAME OVER', { p1Marks, p2Marks, isCellEmpty });

        isGameOver.current = true;

        if (p1Marks === 3) {
            displayModal(MODAL_TYPES.player_won, p1Mark);
            updateScore(USER.player);
        } 
        
        if (p2Marks === 3 || p2Marks === 2) {
            displayModal(MODAL_TYPES.player_lost, cpuMark);
            updateScore(USER.cpu);
        }

        return true;
    };

    const checkBoard = (type) => {
        const blockMove = {
            x: 0,
            y: 0,
            shouldBlock: false,
        };
        let x = 0;
        let y = 0;
        let playerOcurrences = 0;
        let cpuOcurrences = 0;
        let isCellEmpty = false;

        for (let row = 0; row < board.length; row++) {
            playerOcurrences = 0;
            cpuOcurrences = 0;
            isCellEmpty = false;

            for (let col = 0; col < board.length; col++) {
                let cell;

                switch (type) {
                    case 'rows':
                        cell = board[row][col];       
                        break;
                    case 'cols':
                        cell = board[col][row];
                        break;
                    default:
                        break;
                }

                // TODO: Validate if this block could be separated and re used
                switch (cell) {
                    case p1Mark:
                        playerOcurrences++;
                        break;
                    case cpuMark:
                        cpuOcurrences++;
                        break
                    case null:
                        isCellEmpty = true;

                        if (type === 'cols') {
                            x = col;
                            y = row;
                            break;
                        }

                        x = row;
                        y = col;
                        break;
                    default:
                        break;
                }
            }

            if (checkWinCondition(playerOcurrences, cpuOcurrences, isCellEmpty)) {

                if (isCellEmpty && cpuOcurrences === 2) {
                    blockMove.x = x;
                    blockMove.y = y;
                    blockMove.shouldBlock = true;

                    return { ...blockMove };
                }

                return;
            }

            if (isCellEmpty && playerOcurrences === 2) {
                blockMove.x = x;
                blockMove.y = y;
                blockMove.shouldBlock = true;
            }
        }

        return { ...blockMove };
    };

    const makeCpuMove = useCallback(
        () => {
            // Check rows
            const blockRowCell = checkBoard('rows');

            if (blockRowCell?.shouldBlock) {
                clickBox(blockRowCell.x, blockRowCell.y);
                return;
            }

            // Check columns
            const blockColCell = checkBoard('cols');

            if (blockColCell?.shouldBlock) {
                clickBox(blockColCell.x, blockColCell.y);
                return;
            }

            let x = 0;
            let y = 0;
            let playerOcurrences = 0;
            let cpuOcurrences = 0;
            let isCellEmpty = false;

            // Check diagonals
            // Top to bottom
            for (let i = 0; i < board.length; i++) {
                const cell = board[i][i];

                switch (cell) {
                    case p1Mark:
                        playerOcurrences++;
                        break;
                    case cpuMark:
                        cpuOcurrences++;
                        break
                    case null:
                        isCellEmpty = true;
                        x = i;
                        y = i;
                        break;
                    default:
                        break;
                }
            }

            if (checkWinCondition(playerOcurrences, cpuOcurrences, isCellEmpty)) {
                if (isCellEmpty && cpuOcurrences === 2) {
                    clickBox(x, y);
                }

                return;
            }

            if (isCellEmpty && playerOcurrences === 2) {
                clickBox(x, y);
                return;
            }
    
            // Bottom to top
            playerOcurrences = 0;
            cpuOcurrences = 0;
            isCellEmpty = false;
    
            for (let row = 2, col = 0; row >= 0; row--, col++) {
                const cell = board[row][col];
    
                switch (cell) {
                    case p1Mark:
                        playerOcurrences++;
                        break;
                    case cpuMark:
                        cpuOcurrences++;
                        break
                    case null:
                        isCellEmpty = true;
                        x = row;
                        y = col;
                        break;
                    default:
                        break;
                }
            }
    
            if (checkWinCondition(playerOcurrences, cpuOcurrences, isCellEmpty)) {
                if (isCellEmpty && cpuOcurrences === 2) {
                    clickBox(x, y);
                }

                return;
            }

            if (isCellEmpty && playerOcurrences === 2) {
                clickBox(x, y);
                return;
            }
    
            makeRandomMove();
        },
        [board, p1Mark, cpuMark, clickBox],
    );

    // FIXME: There is a 'infinite' loop that appears once the player click the last box available
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

        if (cpuMark === player && !isGameOver.current) {
            makeCpuMove();
        }
    }, [cpuMark, player, makeCpuMove]);

    useEffect(() => {
        localStorage.setItem(lsBoardState, JSON.stringify(board));
        localStorage.setItem(lsCurrentTurnMark, player);
    }, [board, player]);
    

    // TODO: Block user moves when game is over

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
