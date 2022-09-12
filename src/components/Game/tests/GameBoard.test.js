import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { GameContext } from '../../../hocs/GameContext';
import { GameBoard } from '../GameBoard';

import { getEmptyBoard } from '../../../helpers/getEmptyBoard';
import { localStorageMock } from '../../../helpers/mocks/localStorage.mock';
import { ACTIONS, MODAL_TYPES, STORAGE } from '../../../types/types';

const {
    lsBoardState,
    lsPlayerMark,
    lsCpuMark,
    lsP1Mark,
    lsP2Mark,
    lsCurrentTurnMark,
    lsCpuScore,
    lsP1Score,
    lsP2Score,
    lsTiedScore,
    lsTurnCount,
} = STORAGE;

describe('Test <GameBoard />', () => { 
    describe('layout', () => {
        const gameState = {
            currentPlayer: 'X',
            board: getEmptyBoard(),
            turnCounter: 1,
            isGameOver: false,
            isCpuFirstMove: false
        };

        const dispatch = jest.fn();

        beforeEach(() => {
            render(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameBoard />
                </GameContext.Provider>
            );
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        test('should have nine boxes', () => { 
            expect(screen.getAllByRole('button')).toHaveLength(9);
        });
    
        test('should update a box with the correct player and change turn', () => { 
            const button = screen.getAllByRole('button')[4];
    
            fireEvent.click(button);
    
            expect(button.children.item(0).tagName).toBe('svg');
            expect(button.children.item(0).getAttribute('aria-label')).toBe('X');
            expect(dispatch).toHaveBeenCalledWith({
                type: ACTIONS.setChangeTurn,
                payload: [
                    [null, null, null],
                    [null, 'X', null],
                    [null, null, null],
                ]
            });
        });
    });

    describe('Board state', () => { 
        const gameState = {
            currentPlayer: 'X',
            board: getEmptyBoard(),
            turnCounter: 1,
            isGameOver: false,
            isCpuFirstMove: false
        };

        const dispatch = jest.fn();

        let component;

        beforeEach(() => {
            component = render(
                <GameContext.Provider value={{gameState, dispatch}}>
                    <GameBoard />
                </GameContext.Provider>
            ); 
        });
        
        afterEach(() => {
            gameState.board = getEmptyBoard();
            jest.clearAllMocks();
            localStorageMock.clear();
        });

        // It could be a better option to have test that involves localStorage related values in other file 
        test('should save board state in localStorage for the first time', () => {
            const boardState = JSON.parse(localStorageMock.getItem(lsBoardState));

            expect(boardState).toEqual([
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ]);
        });

        test('should save board state in localStorage when player makes a move', () => { 
            const buttons = component.container.getElementsByTagName('button');
                
            fireEvent.click(buttons[4]);

            // Change player and rerender to trigger useEffect
            const gameState = {
                currentPlayer: 'O',
                board: [
                    [null, null, null],
                    [null, 'X',  null],
                    [null, null, null],
                ],
                turnCounter: 2,
                isGameOver: false,
                isCpuFirstMove: false
            };

            const dispatch = jest.fn();

            component.rerender(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameBoard />
                </GameContext.Provider>
            );

            const boardState = JSON.parse(localStorageMock.getItem(lsBoardState));

            expect(boardState).toEqual([
                [null, null, null],
                [null, 'X',  null],
                [null, null, null],
            ]);
        });
    });

    describe('Game is Player vs CPU', () => {
        describe('Basic behaviour', () => {
            const gameState = {
                currentPlayer: 'X',
                board: getEmptyBoard(),
                turnCounter: 1,
                isGameOver: false,
                isCpuFirstMove: true
            };
    
            const dispatch = jest.fn();
            
            let component;
    
            beforeEach(() => {
                localStorageMock.setItem(lsCpuMark, 'X');
                localStorageMock.setItem(lsPlayerMark, 'O');

                component = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard />
                    </GameContext.Provider>
                );
            });
    
            afterEach(() => {
                component.unmount();
                gameState.currentPlayer = 'X';
                gameState.board = getEmptyBoard();
                gameState.isCpuFirstMove = true;
                gameState.turnCounter = 1;
                localStorageMock.clear();
            });

            test('if CPU is first, then it should click one box', async() => {
                // This is an async expect due to the use of setTimeout
                expect(await screen.findByLabelText('X')).toBeInTheDocument();
            });   
    
            test('player makes a move and CPU should click other box different to the first one', async() => { 
                expect(await screen.findAllByLabelText('X')).toHaveLength(1);

                gameState.currentPlayer = 'O';
                gameState.board = [
                    [null, null, null],
                    [null, null, 'X'],
                    [null, null, null],
                ];
                gameState.turnCounter = 2;
                gameState.isCpuFirstMove = false;
        
                const dispatch = jest.fn();
    
                component.rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard />
                    </GameContext.Provider>
                );
    
                const buttons = screen.getAllByRole('button');
    
                fireEvent.click(buttons[4]);
    
                expect(await screen.findAllByLabelText('O')).toHaveLength(1);

                gameState.currentPlayer = 'X';
                gameState.board = [
                    [null, null, null],
                    [null, 'O', 'X'],
                    [null, null, null],
                ];
                gameState.turnCounter = 3;
    
                component.rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard />
                    </GameContext.Provider>
                );
    
                expect(screen.getAllByLabelText('X')).toHaveLength(2);
            });
        });

        describe('CPU should block player win when', () => {
            beforeEach(() => {
                localStorageMock.setItem(lsCpuMark, 'O');
                localStorageMock.setItem(lsPlayerMark, 'X');
            });
    
            afterEach(() => {
                localStorageMock.clear();
            });

            test('player makes two horizontal moves and needs one to win', () => { 
                const gameState = {
                    currentPlayer: 'O',
                    board: [
                        ['X', null, 'X'],
                        [null, null, null],
                        ['O', null, null],
                    ],
                    turnCounter: 4,
                    isGameOver: false,
                    isCpuFirstMove: false
                };
        
                const dispatch = jest.fn();
    
                const { container } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard />
                    </GameContext.Provider>
                );
    
                const buttons = container.getElementsByTagName('button');
                const buttonToBlockWin = buttons[1].children;
    
                expect(buttonToBlockWin).toHaveLength(1);
                expect(buttonToBlockWin.item(0).getAttribute('aria-label')).toBe('O');
            });
    
            test('player makes two vertical moves and needs one to win', () => { 
                const gameState = {
                    currentPlayer: 'O',
                    board: [
                        [null, 'X', null],
                        ['O', 'X', null],
                        [null, null, null],
                    ],
                    turnCounter: 4,
                    isGameOver: false,
                    isCpuFirstMove: false
                };
        
                const dispatch = jest.fn();
    
                const { container } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const buttonToBlockWin = buttons[7].children;
    
                expect(buttonToBlockWin).toHaveLength(1);
                expect(buttonToBlockWin.item(0).getAttribute('aria-label')).toBe('O');
            });
    
            test('player makes two diagonal moves and needs one to win. CPU should block player win', () => {
                const gameState = {
                    currentPlayer: 'O',
                    board: [
                        [null, null, null],
                        [null, 'X', null],
                        ['X', null, 'O'],
                    ],
                    turnCounter: 4,
                    isGameOver: false,
                    isCpuFirstMove: false
                };
        
                const dispatch = jest.fn();
    
                const { container } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard />
                    </GameContext.Provider>
                );
    
                const buttons = container.getElementsByTagName('button');
                const buttonToBlockWin = buttons[2].children;
    
                expect(buttonToBlockWin).toHaveLength(1);
                expect(buttonToBlockWin.item(0).getAttribute('aria-label')).toBe('O');
            });
        });

        describe('CPU win by having three marks in a row', () => {            
            const cpuMark = 'X';

            const gameState = {
                currentPlayer: 'X',
                board: getEmptyBoard(),
                turnCounter: 5,
                isGameOver: false,
                isCpuFirstMove: false
            };
    
            const dispatch = jest.fn();
            const openModal = jest.fn();

            beforeEach(() => {
                localStorageMock.setItem(lsCpuMark, 'X');
                localStorageMock.setItem(lsPlayerMark, 'O');
            });

            afterEach(() => {
                gameState.currentPlayer = 'X';
                gameState.board = getEmptyBoard();
                gameState.turnCounter = 5;
                gameState.isGameOver = false;
                jest.clearAllMocks();
                localStorageMock.clear();
            });

            test('CPU select a winner move if it needs one horizontal mark', () => {
                gameState.board = [
                    [null, 'O',  'O' ],
                    ['X',  null,  'X'],
                    [null, null, null],
                ];
    
                const { container } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[5].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).getAttribute('aria-label')).toBe('X');
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player_lost, cpuMark);
            });

            test('CPU select a winner move if it needs one vertical mark', () => {
                gameState.board = [
                    ['O',  'X',  null],
                    ['O',  null, null],
                    [null, 'X',  null],
                ];
    
                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[4].children;

                expect(dispatch).toHaveBeenNthCalledWith(1, {
                    type: ACTIONS.setGameOver,
                    payload: true
                });
                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).getAttribute('aria-label')).toBe('X');
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player_lost, cpuMark);
            });

            test('CPU select a winner move if it needs one diagonal mark - Top bottom', () => {
                gameState.board = [
                    [null, 'O', null],
                    [null, 'X', null],
                    [null, 'O',  'X'],
                ];
    
                const { container } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[0].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).getAttribute('aria-label')).toBe('X');
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player_lost, cpuMark);
            });

            test('CPU select a winner move if it needs one diagonal mark - Bottom top', () => {
                gameState.board = [
                    ['X', 'O', null],
                    [null, 'X', null],
                    [null, 'O',  null],
                ];
    
                const { container } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[8].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).getAttribute('aria-label')).toBe('X');
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player_lost, cpuMark);
            });
            
            test('CPU select a winner move if it needs one diagonal mark and board has one box left - Top-Bottom', () => {
                gameState.board = [
                    ['X', 'X', 'O'],
                    ['X', 'X', 'O'],
                    ['O', 'O',  null],
                ];
    
                const { container } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[0].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).getAttribute('aria-label')).toBe('X');
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player_lost, cpuMark);
            });

            test('CPU select a winner move if it needs one diagonal mark and board has one box left - Bottom-Top', () => {
                gameState.board = [
                    ['X', 'O', 'X'],
                    ['O', null, 'X'],
                    ['X', 'O',  'O'],
                ];
    
                const { container } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[4].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).getAttribute('aria-label')).toBe('X');
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player_lost, cpuMark);
            });
        });

        describe('Game is a tie', () => {
            const openModal = jest.fn();
    
            beforeEach(() => {
                jest.clearAllMocks();
                localStorageMock.clear();
            });
    
            test('Board is full of marks and nobody won', async() => {
                const gameState = {
                    currentPlayer: 'X',
                    board: [
                        ['O', 'X', 'X'],
                        ['X', 'X', 'O'],
                        ['O', 'O', 'X'],
                    ],
                    turnCounter: 10,
                    isGameOver: false,
                    isCpuFirstMove: false
                };
        
                const dispatch = jest.fn();
    
                render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );
    
                await waitFor(() => expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.tied, ''));
                expect(localStorageMock.getItem(lsTiedScore)).toBe(1);
            });
        });
    });

    describe('Game is Player 1 vs Player 2', () => {
        describe('Players click one box and their mark appears in the board', () => {
            test('Player 1 make a move and turn changes', () => {
                localStorageMock.setItem(lsP1Mark, 'X');
                localStorageMock.setItem(lsP2Mark, 'O');

                const [setShowModal, setModalValues] = [jest.fn(), jest.fn()];

                const gameState = {
                    currentPlayer: 'X',
                    board: getEmptyBoard(),
                    turnCounter: 1,
                    isGameOver: false,
                    isCpuFirstMove: false
                };
        
                const dispatch = jest.fn();

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[4]);

                expect(screen.getAllByLabelText('X')).toHaveLength(1);
                
                gameState.currentPlayer = 'O';
                gameState.board = [
                    [null, null, null],
                    [null, 'X', null],
                    [null, null, null],
                ];
                gameState.turnCounter = 2;

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </GameContext.Provider>
                );

                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    [null, null, null],
                    [null, 'X', null],
                    [null, null, null],
                ]);
                expect(localStorageMock.getItem(lsTurnCount)).toBe(2);
                expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('O');
            });

            test('Player 2 make a move and turn changes', () => {
                localStorageMock.setItem(lsP1Mark, 'O');
                localStorageMock.setItem(lsP2Mark, 'X');
                localStorageMock.setItem(lsTurnCount, '1');

                const gameStateO = {
                    currentPlayer: 'O',
                    board: [
                        [null, null, null],
                        [null, 'X', null],
                        [null, null, null],
                    ],
                    turnCounter: 2,
                    isGameOver: false,
                    isCpuFirstMove: false
                };

                const dispatch = jest.fn();

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState: gameStateO, dispatch }}>
                        <GameBoard />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[8]);

                expect(screen.getAllByLabelText('O')).toHaveLength(1);
                
                const gameStateX = {
                    currentPlayer: 'X',
                    board: [
                        [null, null, null],
                        [null, 'X', null],
                        [null, null, 'O'],
                    ],
                    turnCounter: 3,
                    isGameOver: false,
                    isCpuFirstMove: false
                };

                rerender(
                    <GameContext.Provider value={{ gameState: gameStateX, dispatch }}>
                        <GameBoard />
                    </GameContext.Provider>
                );

                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    [null, null, null],
                    [null, 'X', null],
                    [null, null, 'O'],
                ]);
                expect(localStorageMock.getItem(lsTurnCount)).toBe(3);
                expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('X');
            });
        });

        describe('Player 1 wins by having 3 marks in row', () => {
            const p1Mark = 'X';
            const openModal = jest.fn();

            const gameState = {
                currentPlayer: 'X',
                board: getEmptyBoard(),
                turnCounter: 5,
                isGameOver: false,
                isCpuFirstMove: false
            };

            const dispatch = jest.fn();

            beforeEach(() => {
                localStorageMock.setItem(lsP1Mark, 'X');
                localStorageMock.setItem(lsP2Mark, 'O');
                localStorageMock.setItem(lsP1Score, '0');
            });

            afterEach(() => {
                gameState.currentPlayer = 'X';
                gameState.board = getEmptyBoard();
                gameState.turnCounter = 5;
                gameState.isGameOver = false;
                gameState.isCpuFirstMove = false;
                jest.clearAllMocks();
                localStorageMock.clear();
            });

            test('Player 1 needs one horizontal mark to win', () => {
                gameState.board = [
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', null, 'X'],
                ];

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[7]);

                gameState.currentPlayer = 'O';
                gameState.board = [
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', 'X', 'X'],
                ];
                gameState.turnCounter = 6;

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                expect(screen.getAllByLabelText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', 'X', 'X'],
                ]);
                expect(localStorageMock.getItem(lsP1Score)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player1_won, p1Mark);
            });

            test('Player 1 needs one vertical mark to win', () => {
                gameState.board = [
                    ['O', 'X', null],
                    ['O', null, null],
                    [null, 'X', null],
                ];

                const dispatch = jest.fn();

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[4]);

                gameState.currentPlayer = 'O';
                gameState.board = [
                    ['O', 'X', null],
                    ['O', 'X', null],
                    [null, 'X', null],
                ];
                gameState.turnCounter = 6;

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                expect(screen.getAllByLabelText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', 'X', null],
                    ['O', 'X', null],
                    [null, 'X', null],
                ]);
                expect(localStorageMock.getItem(lsP1Score)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player1_won, p1Mark);
            });

            test('Player 1 needs one diagonal mark to win - Top bottom', () => {
                gameState.board = [
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', null],
                ];

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[8]);

                gameState.currentPlayer = 'O';
                gameState.board = [
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', 'X'],
                ];
                gameState.turnCounter = 6;

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                expect(screen.getAllByLabelText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', 'X'],
                ]);
                expect(localStorageMock.getItem(lsP1Score)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player1_won, p1Mark);
            });

            test('Player 1 needs one diagonal mark to win - Bottom top', () => {
                gameState.board = [
                    ['O', null, null],
                    ['O', 'X', null],
                    ['X', null, null],
                ];

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[2]);

                gameState.currentPlayer = 'O';
                gameState.board = [
                    ['O', null, 'X'],
                    ['O', 'X', null],
                    ['X', null, null],
                ];
                gameState.turnCounter = 6;

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                expect(screen.getAllByLabelText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', null, 'X'],
                    ['O', 'X', null],
                    ['X', null, null],
                ]);
                expect(localStorageMock.getItem(lsP1Score)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player1_won, p1Mark);
            });
        });

        describe('Player 2 wins by having 3 marks in row', () => {
            const p2Mark = 'X';
            const openModal = jest.fn();

            const gameState = {
                currentPlayer: 'X',
                board: getEmptyBoard(),
                turnCounter: 5,
                isGameOver: false,
                isCpuFirstMove: false
            };

            const dispatch = jest.fn();

            beforeEach(() => {
                localStorageMock.setItem(lsP1Mark, 'O');
                localStorageMock.setItem(lsP2Mark, 'X');
                localStorageMock.setItem(lsP2Score, '0');
            });

            afterEach(() => {
                gameState.currentPlayer = 'X';
                gameState.board = getEmptyBoard();
                gameState.turnCounter = 5;
                gameState.isGameOver = false;
                jest.clearAllMocks();
                localStorageMock.clear();
            });

            test('Player 2 needs one horizontal mark to win', () => {
                gameState.board = [
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', null, 'X'],
                ];

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[7]);

                gameState.board = [
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', 'X', 'X'],
                ];

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                expect(screen.getAllByLabelText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', 'X', 'X'],
                ]);
                expect(localStorageMock.getItem(lsP2Score)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player2_won, p2Mark);
            });

            test('Player 2 needs one vertical mark to win', () => {
                gameState.board = [
                    ['O', 'X', null],
                    ['O', null, null],
                    [null, 'X', null],
                ];

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[4]);

                gameState.board = [
                    ['O', 'X', null],
                    ['O', 'X', null],
                    [null, 'X', null],
                ];

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                expect(screen.getAllByLabelText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', 'X', null],
                    ['O', 'X', null],
                    [null, 'X', null],
                ]);
                expect(localStorageMock.getItem(lsP2Score)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player2_won, p2Mark);
            });

            test('Player 2 needs one diagonal mark to win - Top bottom', () => {
                gameState.board = [
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', null],
                ];

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[8]);

                gameState.board = [
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', 'X'],
                ];

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                expect(screen.getAllByLabelText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', 'X'],
                ]);
                expect(localStorageMock.getItem(lsP2Score)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player2_won, p2Mark);
            });

            test('Player 2 needs one diagonal mark to win - Bottom top', () => {
                gameState.board = [
                    ['O', null, null],
                    ['O', 'X', null],
                    ['X', null, null],
                ];

                const { container, rerender } = render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[2]);

                gameState.board = [
                    ['O', null, 'X'],
                    ['O', 'X', null],
                    ['X', null, null],
                ];

                rerender(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                expect(screen.getAllByLabelText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', null, 'X'],
                    ['O', 'X', null],
                    ['X', null, null],
                ]);
                expect(localStorageMock.getItem(lsP2Score)).toBe(1);
                expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.player2_won, p2Mark);
            });
        });

        describe('Game is a tie', () => {
            const openModal = jest.fn();

            beforeEach(() => {
                jest.clearAllMocks();
                localStorageMock.clear();
            });

            test('Board is full of marks and nobody won', async() => {
                localStorageMock.setItem(lsP1Mark, 'X');
                localStorageMock.setItem(lsP2Mark, 'O');
                localStorageMock.setItem(lsTurnCount, 10);

                const gameState = {
                    currentPlayer: 'X',
                    board: [
                        ['O', 'X', 'X'],
                        ['X', 'X', 'O'],
                        ['O', 'O', 'X'],
                    ],
                    turnCounter: 10,
                    isGameOver: false,
                    isCpuFirstMove: false
                };

                const dispatch = jest.fn();

                render(
                    <GameContext.Provider value={{ gameState, dispatch }}>
                        <GameBoard openModal={openModal} />
                    </GameContext.Provider>
                );

                await waitFor(() => expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.tied, ''));
                expect(localStorageMock.getItem(lsTiedScore)).toBe(1);
            });
        });
    });
});