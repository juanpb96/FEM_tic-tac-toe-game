import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { GameContext } from '../../hocs/GameContext';
import { GameBox } from './GameBox';

import { updateScore } from '../../helpers/updateLocalStorageValues';
import { ACTIONS, MODAL_TYPES, STORAGE, USER } from '../../types/types';

const {
    lsBoardState,
    lsTurnCount,
    lsPlayerMark,
    lsCpuMark,
    lsP1Mark,
    lsP2Mark,
    lsCurrentTurnMark,
} = STORAGE;

export const GameBoard = ({ openModal }) => {
    const { gameState, dispatch } = useContext(GameContext);

    const {
        currentPlayer,
        board,
        turnCounter,
        isGameOver,
        isCpuFirstMove,
    } = gameState;

    const [winnerCoords, setWinnerCoords] = useState([]);

    const boardRef = useRef(null);
    const blockMoveRef = useRef(null);

    const cpuMark = localStorage.getItem(lsCpuMark);
    const p1Mark = localStorage.getItem(cpuMark ? lsPlayerMark : lsP1Mark);
    const p2Mark = localStorage.getItem(lsP2Mark);

    const updateBoard = (row, col) => {
        // Deep copy of current board
        const newBoard = board.map(row => row.slice(0));
        newBoard[row][col] = currentPlayer;
        
        dispatch({
            type: ACTIONS.setChangeTurn,
            payload: newBoard
        });
    };

    const setGameOver = useCallback((winnerUser, messageType, winnerMark = '') => {
        updateScore(winnerUser);
        openModal(messageType, winnerMark);

        dispatch({
            type: ACTIONS.setGameOver,
            payload: true
        });
    }, [openModal, dispatch]); 

    const makeRandomMove = useCallback(() => {
        const isBoardFull = board.every(row => row.every(cell => cell === 'X' || cell === 'O'));

        if (isBoardFull) {
            setGameOver('', MODAL_TYPES.tied, '')

            return;
        }

        const buttons = boardRef.current.getElementsByTagName('button');

        let pos = Math.floor(Math.random() * buttons.length);
        
        while (buttons[pos].hasChildNodes()) {
            pos = Math.floor(Math.random() * buttons.length);
        }

        buttons[pos].click();
    }, [board, setGameOver]);

    const clickBox = useCallback((x, y) => {
        const buttons = boardRef.current.getElementsByTagName('button');

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

    const resetBoardValues = (boardValues) => {
        boardValues.xMarkCoords = [];
        boardValues.yMarkCoords = [];
        boardValues.playerMarkCount = 0;
        boardValues.cpuMarkCount = 0;
        boardValues.isCellEmpty = false;
    };

    const fillCoords = (boardValues, mark, row, col) => {
        switch (mark) {
            case 'X':
                boardValues.xMarkCoords.push([row, col]);
                break;
            case 'O':
                boardValues.yMarkCoords.push([row, col]);
                break;
            default:
                break;
        }
    };

    const checkCpuDiagonalMove = useCallback(
        (boardValues) => {
            const { playerMarkCount, cpuMarkCount, isCellEmpty, x, y } = boardValues;

            if (isCellEmpty && cpuMarkCount === 2) {
                setGameOver(USER.cpu, MODAL_TYPES.player_lost, cpuMark);
                fillCoords(boardValues, cpuMark, x, y);

                clickBox(x, y);

                setWinnerCoords(
                    cpuMark === 'X' 
                    ? [...boardValues.xMarkCoords]
                    : [...boardValues.yMarkCoords]
                );

                return true;
            }

            if (isCellEmpty && playerMarkCount === 2) {
                blockMoveRef.current = {
                    x,
                    y,
                    shouldBlock: true
                };
            }

            return false;
        }, [setGameOver, clickBox, cpuMark]
    );

    const updateBoardValues = useCallback((cell, boardValues, x, y) => {
        switch (cell) {
            case p1Mark:
                boardValues.playerMarkCount++;
                break;
            case cpuMark:
                boardValues.cpuMarkCount++;
                break
            case null:
                boardValues.isCellEmpty = true;
                boardValues.x = x;
                boardValues.y = y;
                break;
            default:
                break;
        }
    }, [p1Mark, cpuMark]);

    const checkCpuRowsColsMove = useCallback(() => {
        const boardValues = {
            x: 0,
            y: 0,
            xMarkCoords: [],
            yMarkCoords: [],
            playerMarkCount: 0,
            cpuMarkCount: 0,
            isCellEmpty: false,
        };

        const checkDirection = (type) => {
            for (let row = 0; row < board.length; row++) {
                resetBoardValues(boardValues);
    
                for (let col = 0; col < board.length; col++) {
                    if (type === 'rows') {
                        fillCoords(boardValues, board[row][col], row, col);
                        updateBoardValues(board[row][col], boardValues, row, col);
                        continue;
                    } 
                    
                    fillCoords(boardValues, board[col][row], col, row);
                    updateBoardValues(board[col][row], boardValues, col, row);
                }
    
                const { playerMarkCount, cpuMarkCount, isCellEmpty, x, y } = boardValues;

                // Make cpu winner move
                if (isCellEmpty && cpuMarkCount === 2) {
                    setGameOver(USER.cpu, MODAL_TYPES.player_lost, cpuMark);
                    fillCoords(boardValues, cpuMark, x, y);

                    clickBox(x, y);

                    setWinnerCoords(
                        cpuMark === 'X' 
                        ? [...boardValues.xMarkCoords]
                        : [...boardValues.yMarkCoords]
                    );
    
                    return true;
                }
    
                if (isCellEmpty && playerMarkCount === 2) {
                    blockMoveRef.current = {
                        x,
                        y,
                        shouldBlock: true
                    }
                }
            }

            return false;
        };

        if (checkDirection('rows') || checkDirection('cols')) {
            return true;
        }

        return false;
    }, [board, updateBoardValues, clickBox, setGameOver, cpuMark]);

    const sendPlayerVictory = useCallback((p1MarkCount, p2MarkCount) => {
        if (p1MarkCount === 3) {
            if (cpuMark) {
                setGameOver(USER.player, MODAL_TYPES.player_won, p1Mark);
            } else {
                setGameOver(USER.p1, MODAL_TYPES.player1_won, p1Mark);
            }
        }

        if (p2MarkCount === 3) {
            if (cpuMark) {
                setGameOver(USER.cpu, MODAL_TYPES.player_lost, cpuMark);
            } else {
                setGameOver(USER.p2, MODAL_TYPES.player2_won, p2Mark);
            }
        }
    }, [cpuMark, p1Mark, p2Mark, setGameOver]);


    const checkPlayerHasWon = useCallback(() => {
        let ocurrencesP1 = 0;
        let ocurrencesP2 = 0;

        const boardValues = {
            x: 0,
            y: 0,
            xMarkCoords: [],
            yMarkCoords: [],
            playerMarkCount: 0,
            cpuMarkCount: 0,
            isCellEmpty: false,
        };

        const player2Mark = cpuMark || p2Mark;

        const checkRowsCols = (type) => {
            for (let row = 0; row < board.length; row++) {
                resetBoardValues(boardValues);
                ocurrencesP1 = 0;
                ocurrencesP2 = 0;
    
                for (let col = 0; col < board.length; col++) {
                    if (type === 'rows') {
                        ocurrencesP1 += board[row][col] === p1Mark ? 1 : 0;
                        ocurrencesP2 += board[row][col] === player2Mark ? 1 : 0;
                        fillCoords(boardValues, p1Mark, row, col);
                        fillCoords(boardValues, p2Mark, row, col);
                        
                        continue;
                    } 
                    
                    ocurrencesP1 += board[col][row] === p1Mark ? 1 : 0;
                    ocurrencesP2 += board[col][row] === player2Mark ? 1 : 0;
                    fillCoords(boardValues, p1Mark, col, row);
                    fillCoords(boardValues, p2Mark, col, row);
                }
    
                if (ocurrencesP1 === 3 || ocurrencesP2 === 3) {
                    const winnerMark = ocurrencesP1 === 3 ? p1Mark : p2Mark;

                    setWinnerCoords(
                        winnerMark === 'X' 
                        ? [...boardValues.xMarkCoords]
                        : [...boardValues.yMarkCoords]
                    );

                    return true;
                }
            }
    
            return false;
        }

        if (checkRowsCols('rows') || checkRowsCols('cols')) {
            sendPlayerVictory(ocurrencesP1, ocurrencesP2);

            return true;
        }

        // Check diagonals
        // Top to bottom
        ocurrencesP1 = 0;
        ocurrencesP2 = 0;
        resetBoardValues(boardValues);

        for (let i = 0; i < board.length; i++) {
            ocurrencesP1 += board[i][i] === p1Mark ? 1 : 0;
            ocurrencesP2 += board[i][i] === player2Mark ? 1 : 0;
            fillCoords(boardValues, p1Mark, i, i);
            fillCoords(boardValues, p2Mark, i, i);
        }

        if (ocurrencesP1 === 3 || ocurrencesP2 === 3) {
            sendPlayerVictory(ocurrencesP1, ocurrencesP2);

            const winnerMark = ocurrencesP1 === 3 ? p1Mark : p2Mark;

            setWinnerCoords(
                winnerMark === 'X' 
                ? [...boardValues.xMarkCoords]
                : [...boardValues.yMarkCoords]
            );

            return true;
        }

        // Bottom to top
        ocurrencesP1 = 0;
        ocurrencesP2 = 0;
        resetBoardValues(boardValues);

        for (let row = 2, col = 0; row >= 0; row--, col++) {
            ocurrencesP1 += board[row][col] === p1Mark ? 1 : 0;
            ocurrencesP2 += board[row][col] === player2Mark ? 1 : 0;
            fillCoords(boardValues, p1Mark, row, col);
            fillCoords(boardValues, p2Mark, row, col);
        }

        if (ocurrencesP1 === 3 || ocurrencesP2 === 3) {
            sendPlayerVictory(ocurrencesP1, ocurrencesP2);

            const winnerMark = ocurrencesP1 === 3 ? p1Mark : p2Mark;

            setWinnerCoords(
                winnerMark === 'X' 
                ? [...boardValues.xMarkCoords]
                : [...boardValues.yMarkCoords]
            );

            return true;
        }

        return false;
    }, [board, cpuMark, p1Mark, p2Mark, sendPlayerVictory]);

    const makeCpuMove = useCallback(
        () => {
            if (checkPlayerHasWon()) {
                return;
            }

            blockMoveRef.current = {
                x: 0,
                y: 0,
                shouldBlock: false,
            };

            // Check both rows and cols
            if (checkCpuRowsColsMove()) {
                return;
            }

            // Check diagonals
            const boardValues = {
                x: 0,
                y: 0,
                xMarkCoords: [],
                yMarkCoords: [],
                playerMarkCount: 0,
                cpuMarkCount: 0,
                isCellEmpty: false,
            };

            // Top to bottom
            for (let i = 0; i < board.length; i++) {
                fillCoords(boardValues, board[i][i], i, i);
                updateBoardValues(board[i][i], boardValues, i, i);
            }

            if (checkCpuDiagonalMove(boardValues)) {
                return;
            }
    
            // Bottom to top
            resetBoardValues(boardValues);
    
            for (let row = 2, col = 0; row >= 0; row--, col++) {
                fillCoords(boardValues, board[row][col], row, col);
                updateBoardValues(board[row][col], boardValues, row, col);
            }

            if (checkCpuDiagonalMove(boardValues)) {
                return;
            }

            if (blockMoveRef.current.shouldBlock) {
                clickBox(blockMoveRef.current.x, blockMoveRef.current.y);

                return;
            }
    
            makeRandomMove();
        },
        [board, checkPlayerHasWon, clickBox, checkCpuRowsColsMove, updateBoardValues, checkCpuDiagonalMove, makeRandomMove],
    );

    useEffect(() => {
        if (isGameOver) {
            // Reset winner coords without a re render
            winnerCoords.length = 0;
        }
    }, [isGameOver, winnerCoords]);    

    useEffect(() => {
        let timeoutId;

        if (cpuMark === currentPlayer) {
            if (isCpuFirstMove) {
                dispatch({
                    type: ACTIONS.setCpuMoveFirst,
                    payload: false
                });
    
                timeoutId = setTimeout(() => {
                    makeRandomMove();
                }, 500);
            } else if (!isGameOver) {
                makeCpuMove();
            }
        }

        return () => {
            clearTimeout(timeoutId);
        }
    }, [cpuMark, currentPlayer, isCpuFirstMove, isGameOver, dispatch, makeRandomMove, makeCpuMove]);

    useEffect(() => {
        localStorage.setItem(lsBoardState, JSON.stringify(board));
        localStorage.setItem(lsCurrentTurnMark, currentPlayer);
        localStorage.setItem(lsTurnCount, turnCounter);

        const timeoutId = setTimeout(() => {
            if (turnCounter === 10 && !isGameOver) {
                setGameOver('', MODAL_TYPES.tied, '');
            }
        }, 200);

        if (p2Mark && turnCounter >= 4 && !isGameOver) {
            checkPlayerHasWon();
        }

        return () => {
            clearTimeout(timeoutId);
        }
    }, [board, currentPlayer, p2Mark, isGameOver, turnCounter, setGameOver, checkPlayerHasWon]);

    return (
        <main
            className='[ board ][ mb-5 ]'
            ref={ boardRef }
        >
            {
                board.map(
                    (row, rowIndex) => row.map(
                        (cell, colIndex) => 
                            <GameBox
                                hasMark={ !!cell }
                                mark={ cell }
                                currentPlayer={ currentPlayer }
                                row={ rowIndex }
                                col={ colIndex }
                                isWinnerBox={ 
                                    isGameOver
                                    ? !!winnerCoords.find(([ row, col ]) => (row === rowIndex && col === colIndex))
                                    : false
                                }
                                updateBoard={ updateBoard }
                                isGameOver={isGameOver}
                                key={`${rowIndex}${colIndex}`} 
                            />
                    )
                )
            }
        </main>
    );
};
