import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PlayerCoxtext } from '../../hocs/PlayerContext';
import { MODAL_TYPES, STORAGE } from '../../types/types';
import { GameBox } from './GameBox';

const {
    lsBoardState,
    lsTurnCount,
    lsPlayerMark,
    lsCpuMark,
    lsP1Mark,
    lsP2Mark,
    lsCurrentTurnMark,
    lsCpuScore,
    lsPlayerScore,
    lsP1Score,
    lsP2Score,
    lsTiedScore,
} = STORAGE;

const USER = {
    player: 'player',
    p1: 'p1',
    p2: 'p2,',
    cpu: 'cpu',
};

export const GameBoard = ({ setModalValues, setShowModal }) => {
    const { player, setPlayer } = useContext(PlayerCoxtext);

    // TODO: When match ends and player leaves.
    //       Display an empty board when player returns

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
    const turnCounter = useRef(+localStorage.getItem(lsTurnCount) || 0);

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
        turnCounter.current += 1;

        console.log(board);
    };

    const updateScore = (winner = '') => {
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
                const tieCurrentScore = +localStorage.getItem(lsTiedScore);
        
                localStorage.setItem(
                    lsTiedScore,
                    tieCurrentScore ? tieCurrentScore + 1 : 1
                );
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

    const makeCpuDiagonalMove = ({ playerOcurrences, cpuOcurrences, isCellEmpty, x, y }) => {
        if (checkWinCondition(playerOcurrences, cpuOcurrences, isCellEmpty)) {
            if (isCellEmpty && cpuOcurrences === 2) {
                clickBox(x, y);
            }

            return true;
        }

        if (isCellEmpty && playerOcurrences === 2) {
            clickBox(x, y);
            return true;
        }

        return false;
    };

    const updateBoardValues = (cell, boardValues, x, y) => {
        switch (cell) {
            case p1Mark:
                boardValues.playerOcurrences++;
                break;
            case cpuMark:
                boardValues.cpuOcurrences++;
                break
            case null:
                boardValues.isCellEmpty = true;
                boardValues.x = x;
                boardValues.y = y;
                break;
            default:
                break;
        }
    };

    const checkBoardRowsCols = (type) => {
        const blockMove = {
            x: 0,
            y: 0,
            shouldBlock: false,
        };

        const boardValues = {
            x: 0,
            y: 0,
            playerOcurrences: 0,
            cpuOcurrences: 0,
            isCellEmpty: false,
        };

        for (let row = 0; row < board.length; row++) {
            boardValues.playerOcurrences = 0;
            boardValues.cpuOcurrences = 0;
            boardValues.isCellEmpty = false;

            for (let col = 0; col < board.length; col++) {
                if (type === 'rows') {
                    updateBoardValues(board[row][col], boardValues, row, col);
                    continue;
                } 
                    
                updateBoardValues(board[col][row], boardValues, col, row);
            }

            const { playerOcurrences, cpuOcurrences, isCellEmpty, x, y } = boardValues;

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
            const blockRowCell = checkBoardRowsCols('rows');

            if (blockRowCell?.shouldBlock) {
                clickBox(blockRowCell.x, blockRowCell.y);
                return;
            }

            // Check columns
            const blockColCell = checkBoardRowsCols('cols');

            if (blockColCell?.shouldBlock) {
                clickBox(blockColCell.x, blockColCell.y);
                return;
            }

            const boardValues = {
                x: 0,
                y: 0,
                playerOcurrences: 0,
                cpuOcurrences: 0,
                isCellEmpty: false,
            };

            // Check diagonals
            // Top to bottom
            for (let i = 0; i < board.length; i++) {
                updateBoardValues(board[i][i], boardValues, i, i);
            }

            if (makeCpuDiagonalMove(boardValues)) {
                return;
            }
    
            // Bottom to top
            boardValues.playerOcurrences = 0;
            boardValues.cpuOcurrences = 0;
            boardValues.isCellEmpty = false;
    
            for (let row = 2, col = 0; row >= 0; row--, col++) {   
                updateBoardValues(board[row][col], boardValues, row, col);
            }

            if (makeCpuDiagonalMove(boardValues)) {
                return;
            }
    
            makeRandomMove();
        },
        [board, p1Mark, cpuMark, clickBox],
    );

    const makeRandomMove = () => {
        const isBoardFull = board.every(row => row.every(cell => cell === 'X' || cell === 'O'));

        if (isBoardFull) {
            displayModal(MODAL_TYPES.tied, '');
            updateScore();
            isGameOver.current = true;
            return;
        }

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
        localStorage.setItem(lsTurnCount, turnCounter.current);

        if (turnCounter.current === 10 && !isGameOver.current) {
            displayModal(MODAL_TYPES.tied, '');
            updateScore();
            isGameOver.current = true;
        }
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
