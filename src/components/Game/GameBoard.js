import { useCallback, useContext, useEffect, useRef } from 'react';

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

        console.log({ board, newPlayer: currentPlayer });
    };

    const setGameOver = (winnerUser, messageType, winnerMark = '') => {
        updateScore(winnerUser);
        openModal(messageType, winnerMark);

        dispatch({
            type: ACTIONS.setGameOver,
            payload: true
        });
    }; 

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

        console.log('Random Move', pos);
        buttons[pos].click();
    }, [board, openModal, dispatch]);

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

    const checkCpuDiagonalMove = useCallback(
        ({ playerMarkCount, cpuMarkCount, isCellEmpty, x, y }) => {
            if (isCellEmpty && cpuMarkCount === 2) {
                console.log('CPU win on diagonal');
                setGameOver(USER.cpu, MODAL_TYPES.player_lost, cpuMark);
                clickBox(x, y);

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
        }, [clickBox]
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
            playerMarkCount: 0,
            cpuMarkCount: 0,
            isCellEmpty: false,
        };

        const checkDirection = (type) => {
            for (let row = 0; row < board.length; row++) {
                boardValues.playerMarkCount = 0;
                boardValues.cpuMarkCount = 0;
                boardValues.isCellEmpty = false;
    
                for (let col = 0; col < board.length; col++) {
                    if (type === 'rows') {
                        updateBoardValues(board[row][col], boardValues, row, col);
                        continue;
                    } 
                        
                    updateBoardValues(board[col][row], boardValues, col, row);
                }
    
                const { playerMarkCount, cpuMarkCount, isCellEmpty, x, y } = boardValues;
    
                console.log({ row });

                // Make cpu winner move
                if (isCellEmpty && cpuMarkCount === 2) {
                    console.log('CPU winner move - Sending click from checkDirection');
                    setGameOver(USER.cpu, MODAL_TYPES.player_lost, cpuMark);

                    clickBox(x, y);
    
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
    }, [board, updateBoardValues, clickBox]);

    const sendPlayerVictory = useCallback((p1MarkCount, p2MarkCount) => {
        if (p1MarkCount === 3) {
            console.log('P1 has Won', { p1MarkCount });
            if (cpuMark) {
                setGameOver(USER.player, MODAL_TYPES.player_won, p1Mark);
            } else {
                setGameOver(USER.p1, MODAL_TYPES.player1_won, p1Mark);
            }
        }

        if (p2MarkCount === 3) {
            console.log('P2 has won', { p2MarkCount });
            if (cpuMark) {
                setGameOver(USER.cpu, MODAL_TYPES.player_lost, cpuMark);
            } else {
                setGameOver(USER.p2, MODAL_TYPES.player2_won, p2Mark);
            }
        }
    }, [cpuMark, p1Mark, p2Mark, dispatch, openModal]);

    const checkPlayerHasWon = useCallback(() => {
        let ocurrencesP1 = 0;
        let ocurrencesP2 = 0;

        const player2Mark = cpuMark || p2Mark;

        const checkRowsCols = (type) => {
            for (let row = 0; row < board.length; row++) {       
                ocurrencesP1 = 0;
                ocurrencesP2 = 0;
    
                for (let col = 0; col < board.length; col++) {
                    if (type === 'rows') {
                        ocurrencesP1 += board[row][col] === p1Mark ? 1 : 0;
                        ocurrencesP2 += board[row][col] === player2Mark ? 1 : 0;
                        continue;
                    } 
    
                    ocurrencesP1 += board[col][row] === p1Mark ? 1 : 0;
                    ocurrencesP2 += board[col][row] === player2Mark ? 1 : 0;
                }
    
                if (ocurrencesP1 === 3 || ocurrencesP2 === 3) {
                    return true
                }
            }
    
            return false;
        }

        if (checkRowsCols('rows') || checkRowsCols('cols')) {
            console.log('A player has won!!!');
            sendPlayerVictory(ocurrencesP1, ocurrencesP2);

            return true;
        }

        // Check diagonals
        // Top to bottom
        ocurrencesP1 = 0;
        ocurrencesP2 = 0;

        for (let i = 0; i < board.length; i++) {
            ocurrencesP1 += board[i][i] === p1Mark ? 1 : 0;
            ocurrencesP2 += board[i][i] === player2Mark ? 1 : 0;
        }

        if (ocurrencesP1 === 3 || ocurrencesP2 === 3) {
            sendPlayerVictory(ocurrencesP1, ocurrencesP2);

            return true;
        }

        // Bottom to top
        ocurrencesP1 = 0;
        ocurrencesP2 = 0;

        for (let row = 2, col = 0; row >= 0; row--, col++) {
            ocurrencesP1 += board[row][col] === p1Mark ? 1 : 0;
            ocurrencesP2 += board[row][col] === player2Mark ? 1 : 0;
        }

        if (ocurrencesP1 === 3 || ocurrencesP2 === 3) {
            sendPlayerVictory(ocurrencesP1, ocurrencesP2);

            return true;
        }

        return false;
    }, [board, cpuMark, p1Mark, p2Mark, sendPlayerVictory]);

    // TODO: Fix tests by using things done on refactor
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
                playerMarkCount: 0,
                cpuMarkCount: 0,
                isCellEmpty: false,
            };

            // Top to bottom
            for (let i = 0; i < board.length; i++) {
                updateBoardValues(board[i][i], boardValues, i, i);
            }

            if (checkCpuDiagonalMove(boardValues)) {
                return;
            }
    
            // Bottom to top
            boardValues.playerMarkCount = 0;
            boardValues.cpuMarkCount = 0;
            boardValues.isCellEmpty = false;
    
            for (let row = 2, col = 0; row >= 0; row--, col++) {   
                updateBoardValues(board[row][col], boardValues, row, col);
            }

            if (checkCpuDiagonalMove(boardValues)) {
                return;
            }

            if (blockMoveRef.current.shouldBlock) {
                console.log('Blocking user move');
                clickBox(blockMoveRef.current.x, blockMoveRef.current.y);

                return;
            }
    
            console.log('MakeCPU() random move');
            makeRandomMove();
        },
        [board, checkPlayerHasWon, clickBox, checkCpuRowsColsMove, updateBoardValues, checkCpuDiagonalMove, makeRandomMove],
    );

    useEffect(() => {
        console.log({ isCpuFirstMove, cpuMark, currentPlayer, isGameOver, board });
        let timeoutId;

        if (cpuMark === currentPlayer) {
            if (isCpuFirstMove) {
                dispatch({
                    type: ACTIONS.setCpuMoveFirst,
                    payload: false
                });

                console.log('Sending ramdom move from uE');
    
                timeoutId = setTimeout(() => {
                    makeRandomMove();
                }, 500);
            } else if (!isGameOver) {
                console.log('Sending make cpu move');
                makeCpuMove();
            }
        }

        return () => {
            clearTimeout(timeoutId);
        }
    }, [cpuMark, currentPlayer, isCpuFirstMove, dispatch, makeRandomMove, makeCpuMove]);

    useEffect(() => {
        console.log({ board, currentPlayer });

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
    }, [board, currentPlayer, p2Mark, isGameOver, checkPlayerHasWon]);

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
                                currentPlayer={ currentPlayer }
                                row={ rowIndex }
                                col={ colIndex }
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
