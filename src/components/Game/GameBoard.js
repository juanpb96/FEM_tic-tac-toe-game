import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PlayerCoxtext } from '../../hocs/PlayerContext';
import { updateScore } from '../../helpers/updateLocalStorageValues';
import { MODAL_TYPES, STORAGE, USER } from '../../types/types';
import { GameBox } from './GameBox';

const {
    lsBoardState,
    lsTurnCount,
    lsPlayerMark,
    lsCpuMark,
    lsP1Mark,
    lsP2Mark,
    lsCurrentTurnMark,
} = STORAGE;

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

    console.log({ initialBoard });

    const [board, setBoard] = useState(initialBoard || emptyBoard);

    const boardRef = useRef(null);
    const isGameOver = useRef(false);
    const turnCounter = useRef(+localStorage.getItem(lsTurnCount) || 0);

    const cpuMark = localStorage.getItem(lsCpuMark);
    const searchFirstMove = board.some(row => row.some(cell => cell === cpuMark));
    const isCpuFirstMove = useRef(!searchFirstMove);

    const p1Mark = localStorage.getItem(cpuMark ? lsPlayerMark : lsP1Mark);
    const p2Mark = localStorage.getItem(lsP2Mark);

    const updateBoard = (row, col) => {
        setBoard((prevBoard) => {
            console.log({prevBoard, board});
            prevBoard[row][col] = player;
            return prevBoard;
        });
        setPlayer(player === 'X' ? 'O' : 'X');
        turnCounter.current += 1;

        console.log(board);
    };

    const displayModal = useCallback((messageType, mark) => {   
        setModalValues(prev => ({
            ...prev,
            type: messageType,
            winnerMark: mark,
        }));
        setShowModal(true);
    }, [setModalValues, setShowModal]);

    const makeRandomMove = useCallback(() => {
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
    }, [board, displayModal]);

    const clickBox = useCallback((x, y) => {
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
    }, [makeRandomMove]);

    const checkWinCondition = useCallback(
        (p1Marks, p2Marks, isCellEmpty = false) => {
            if (p1Marks < 3 && p2Marks < 3 && !(isCellEmpty && p2Marks === 2 && cpuMark)) {
                return false;
            }

            console.log('GAME OVER', { p1Marks, p2Marks, isCellEmpty, p1Mark, p2Mark, cpuMark });

            isGameOver.current = true;

            if (p1Marks === 3) {
                if (p2Mark) {
                    displayModal(MODAL_TYPES.player1_won, p1Mark);
                    updateScore(USER.p1);
                } else {
                    displayModal(MODAL_TYPES.player_won, p1Mark);
                    updateScore(USER.player);
                }
            } 
            
            if (p2Marks === 3 || p2Marks === 2) {
                if (p2Mark && p2Marks === 3) {
                    displayModal(MODAL_TYPES.player2_won, p2Mark);
                    updateScore(USER.p2);
                } else {
                    displayModal(MODAL_TYPES.player_lost, cpuMark);
                    updateScore(USER.cpu);
                }
            }

            return true;
        }, [cpuMark, p1Mark, p2Mark, displayModal]
    );

    const makeCpuDiagonalMove = useCallback(
        ({ playerOcurrences, p2Ocurrences, isCellEmpty, x, y }) => {
            if (checkWinCondition(playerOcurrences, p2Ocurrences, isCellEmpty)) {
                if (isCellEmpty && p2Ocurrences === 2) {
                    clickBox(x, y);
                }

                return true;
            }

            if (isCellEmpty && playerOcurrences === 2) {
                clickBox(x, y);
                return true;
            }

            return false;
        }, [checkWinCondition, clickBox]
    );

    const updateBoardValues = useCallback((cell, boardValues, x, y) => {
        const player2Mark = cpuMark || p2Mark;

        switch (cell) {
            case p1Mark:
                boardValues.playerOcurrences++;
                break;
            case player2Mark:
                boardValues.p2Ocurrences++;
                break
            case null:
                boardValues.isCellEmpty = true;
                boardValues.x = x;
                boardValues.y = y;
                break;
            default:
                break;
        }
    }, [cpuMark, p1Mark, p2Mark]);

    const checkBoardRowsCols = useCallback((type) => {
        const blockMove = {
            x: 0,
            y: 0,
            shouldBlock: false,
        };

        const boardValues = {
            x: 0,
            y: 0,
            playerOcurrences: 0,
            p2Ocurrences: 0,
            isCellEmpty: false,
        };

        for (let row = 0; row < board.length; row++) {
            boardValues.playerOcurrences = 0;
            boardValues.p2Ocurrences = 0;
            boardValues.isCellEmpty = false;

            for (let col = 0; col < board.length; col++) {
                if (type === 'rows') {
                    updateBoardValues(board[row][col], boardValues, row, col);
                    continue;
                } 
                    
                updateBoardValues(board[col][row], boardValues, col, row);
            }

            const { playerOcurrences, p2Ocurrences, isCellEmpty, x, y } = boardValues;

            if (checkWinCondition(playerOcurrences, p2Ocurrences, isCellEmpty)) {

                if (isCellEmpty && p2Ocurrences === 2) {
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
    }, [board, updateBoardValues, checkWinCondition]);

    const checkBoardStatePlayerVsPlayer = useCallback(() => {
        checkBoardRowsCols('rows');

        if (isGameOver.current) {
            return;
        }

        checkBoardRowsCols('cols');

        if (isGameOver.current) {
            return;
        }

        // Check diagonals
        const boardValues = {
            x: 0,
            y: 0,
            playerOcurrences: 0,
            p2Ocurrences: 0,
            isCellEmpty: false,
        };

        // Top to bottom
        for (let i = 0; i < board.length; i++) {
            updateBoardValues(board[i][i], boardValues, i, i);
        }

        if (checkWinCondition(boardValues.playerOcurrences, boardValues.p2Ocurrences)) {
            return;
        }

        // Bottom to top
        boardValues.playerOcurrences = 0;
        boardValues.p2Ocurrences = 0;

        for (let row = 2, col = 0; row >= 0; row--, col++) {   
            updateBoardValues(board[row][col], boardValues, row, col);
        }

        checkWinCondition(boardValues.playerOcurrences, boardValues.p2Ocurrences);
    }, [board, checkBoardRowsCols, updateBoardValues, checkWinCondition]);

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
                p2Ocurrences: 0,
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
            boardValues.p2Ocurrences = 0;
            boardValues.isCellEmpty = false;
    
            for (let row = 2, col = 0; row >= 0; row--, col++) {   
                updateBoardValues(board[row][col], boardValues, row, col);
            }

            if (makeCpuDiagonalMove(boardValues)) {
                return;
            }
    
            makeRandomMove();
        },
        [board, clickBox, checkBoardRowsCols, updateBoardValues, makeCpuDiagonalMove, makeRandomMove],
    );

    useEffect(() => {
        if (isCpuFirstMove.current && cpuMark === player) {
            isCpuFirstMove.current = false;
            makeRandomMove();
            return;
        }

        if (cpuMark === player && !isGameOver.current) {
            makeCpuMove();
        }
    }, [cpuMark, player, makeRandomMove, makeCpuMove]);

    useEffect(() => {
        localStorage.setItem(lsBoardState, JSON.stringify(board));
        localStorage.setItem(lsCurrentTurnMark, player);
        localStorage.setItem(lsTurnCount, turnCounter.current);

        if (turnCounter.current === 10 && !isGameOver.current) {
            displayModal(MODAL_TYPES.tied, '');
            updateScore();
            isGameOver.current = true;
        }

        if (p2Mark) {
            checkBoardStatePlayerVsPlayer();
        }
    }, [board, player, p2Mark, displayModal, checkBoardStatePlayerVsPlayer]);

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
                                isGameOver={isGameOver.current}
                                key={`${rowIndex}${colIndex}`} 
                            />
                    )
                )
            }
        </main>
    );
};
