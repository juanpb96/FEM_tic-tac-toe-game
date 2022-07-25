import { fireEvent, render, screen } from '@testing-library/react';
import { localStorageMock } from '../../../helpers/mocks/localStorage.mock';
import { PlayerCoxtext } from '../../../hocs/PlayerContext';
import { STORAGE } from '../../../types/types';
import { GameBoard } from '../GameBoard';

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
    lsTiedScore,
    lsTurnCount,
} = STORAGE;

describe('Test <GameBoard />', () => { 
    describe('layout', () => { 
        const [player, setPlayer] = ['X', jest.fn()];
        
        beforeEach(() => {
            render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameBoard />
                </PlayerCoxtext.Provider>
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
    
            expect(button.children.item(0).tagName).toBe('IMG');
            expect(button.children.item(0).alt).toBe('X');
            expect(setPlayer).toHaveBeenCalledWith('O');
        });
    });

    describe('Board state', () => { 
        let component;

        beforeEach(() => {
            const [player, setPlayer] = ['X', jest.fn()];
            
            component = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameBoard />
                </PlayerCoxtext.Provider>
            ); 
        });
        
        afterEach(() => {
            component.unmount();
            localStorageMock.clear();
        });

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
            const [playerO, setPlayerO] = ['O', jest.fn()];

            component.rerender(
                <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                    <GameBoard />
                </PlayerCoxtext.Provider>
            );

            const boardState = JSON.parse(localStorageMock.getItem(lsBoardState));

            expect(boardState).toEqual([
                [null, null, null],
                [null, 'X',  null],
                [null, null, null],
            ]);
        });

        test('should get board state from localStorage and display board as expected', () => {
            localStorageMock.setItem(lsBoardState, JSON.stringify([
                ['X', null, null],
                [null, 'X', null],
                ['O', null, 'O'],
            ]));

            const [player, setPlayer] = ['X', jest.fn()];
            
            const { container } = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameBoard />
                </PlayerCoxtext.Provider>
            );

            expect(container.querySelectorAll('img[alt="X"]')).toHaveLength(2);
            expect(container.querySelectorAll('img[alt="O"]')).toHaveLength(2);
        });
    });

    describe('Game is Player vs CPU', () => {
        let component;

        beforeEach(() => {
            localStorageMock.setItem(lsCpuMark, 'X');
            localStorageMock.setItem(lsPlayerMark, 'O');

            const [player, setPlayer] = ['X', jest.fn()];

            component = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameBoard />
                </PlayerCoxtext.Provider>
            );
        });

        afterEach(() => {
            localStorageMock.clear();
        });

        test('if CPU is first, then it should click one box', () => {
            expect(screen.getByAltText('X')).toBeInTheDocument();
        });   

        test('player makes a move and CPU should click other box different to the first one', () => { 
            expect(screen.getAllByAltText('X')).toHaveLength(1);

            const [playerO, setPlayerO] = ['O', jest.fn()];

            component.rerender(
                <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                    <GameBoard />
                </PlayerCoxtext.Provider>
            );

            const buttons = screen.getAllByRole('button');

            let pos = Math.floor(Math.random() * 9);
            
            while (buttons[pos].hasChildNodes()) {
                pos = Math.floor(Math.random() * 9);
            }

            fireEvent.click(buttons[pos]);

            expect(screen.getAllByAltText('O')).toHaveLength(1);

            const [playerX, setPlayerX] = ['X', jest.fn()];

            component.rerender(
                <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                    <GameBoard />
                </PlayerCoxtext.Provider>
            );

            expect(screen.getAllByAltText('X')).toHaveLength(2);
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
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['X', null, 'X'],
                    [null, null, null],
                    ['O', null, null],
                ]));
    
                const [player, setPlayer] = ['O', jest.fn()];
    
                const { container } = render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard />
                    </PlayerCoxtext.Provider>
                );
    
                const buttons = container.getElementsByTagName('button');
                const buttonToBlockWin = buttons[1].children;
    
                expect(buttonToBlockWin).toHaveLength(1);
                expect(buttonToBlockWin.item(0).alt).toBe('O');
            });
    
            test('player makes two vertical moves and needs one to win', () => { 
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    [null, 'X', null],
                    ['O', 'X', null],
                    [null, null, null],
                ]));
    
                const [player, setPlayer] = ['O', jest.fn()];
    
                const { container } = render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const buttonToBlockWin = buttons[7].children;
    
                expect(buttonToBlockWin).toHaveLength(1);
                expect(buttonToBlockWin.item(0).alt).toBe('O');
            });
    
            test('player makes two diagonal moves and needs one to win. CPU should block player win', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    [null, null, null],
                    [null, 'X', null],
                    ['X', null, 'O'],
                ]));
    
                const [player, setPlayer] = ['O', jest.fn()];
    
                const { container } = render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard />
                    </PlayerCoxtext.Provider>
                );
    
                const buttons = container.getElementsByTagName('button');
                const buttonToBlockWin = buttons[2].children;
    
                expect(buttonToBlockWin).toHaveLength(1);
                expect(buttonToBlockWin.item(0).alt).toBe('O');
            });
        });

        describe('CPU win by having three marks in a row', () => {
            const [setShowModal, setModalValues] = [jest.fn(), jest.fn()];
            const [player, setPlayer] = ['X', jest.fn()];

            afterEach(() => {
                jest.clearAllMocks();
                localStorageMock.clear();
            });

            test('CPU select a winner move if it needs one horizontal mark', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    [null, 'O',  'O' ],
                    ['X',  null,  'X'],
                    [null, null, null],
                ]));
    
                const { container } = render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[5].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).alt).toBe('X');
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
            });

            test('CPU select a winner move if it needs one vertical mark', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O',  'X',  null],
                    ['O',  null, null],
                    [null, 'X',  null],
                ]));
    
                const { container } = render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[4].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).alt).toBe('X');
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
            });

            test('CPU select a winner move if it needs one diagonal mark - Top bottom', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    [null, 'O', null],
                    [null, 'X', null],
                    [null, 'O',  'X'],
                ]));
    
                const { container } = render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[0].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).alt).toBe('X');
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
            });

            test('CPU select a winner move if it needs one diagonal mark - Bottom top', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['X', 'O', null],
                    [null, 'X', null],
                    [null, 'O',  null],
                ]));
    
                const { container } = render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');
                const winnerButton = buttons[8].children;

                expect(winnerButton).toHaveLength(1);
                expect(winnerButton.item(0).alt).toBe('X');
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
                expect(localStorageMock.getItem(lsCpuScore)).toBe(1);
            });
        });

        describe('Game is a tie', () => {
            const [setShowModal, setModalValues] = [jest.fn(), jest.fn()];
            const [player, setPlayer] = ['X', jest.fn()];
    
            beforeEach(() => {
                jest.clearAllMocks();
                localStorageMock.clear();
            });
    
            test('Board is full of marks and nobody won', () => {
                localStorageMock.setItem(lsTurnCount, 10);
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O', 'X', 'X'],
                    ['X', 'X', 'O'],
                    ['O', 'O', 'X'],
                ]));
    
                render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );
    
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
                expect(localStorageMock.getItem(lsTiedScore)).toBe(1);
            });
        });
    });

    describe('Game is Player 1 vs Player 2', () => {
        describe('Players click one box and their mark appears in the board', () => {
            test('Player 1 make a move and turn changes', () => {
                localStorageMock.setItem(lsP1Mark, 'X');
                localStorageMock.setItem(lsTurnCount, '0');
                localStorageMock.setItem(lsCurrentTurnMark, 'X');

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[4]);

                expect(screen.getAllByAltText('X')).toHaveLength(1);
                
                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard />
                    </PlayerCoxtext.Provider>
                );

                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    [null, null, null],
                    [null, 'X', null],
                    [null, null, null],
                ]);
                expect(localStorageMock.getItem(lsTurnCount)).toBe(1);
                expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('O');
            });

            test('Player 2 make a move and turn changes', () => {
                localStorageMock.setItem(lsP1Mark, 'O');
                localStorageMock.setItem(lsTurnCount, '1');
                localStorageMock.setItem(lsCurrentTurnMark, 'O');
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    [null, null, null],
                    [null, 'X', null],
                    [null, null, null],
                ]));

                const [playerO, setPlayerO] = ['O', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[8]);

                expect(screen.getAllByAltText('O')).toHaveLength(1);
                
                const [playerX, setPlayerX] = ['X', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard />
                    </PlayerCoxtext.Provider>
                );

                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    [null, null, null],
                    [null, 'X', null],
                    [null, null, 'O'],
                ]);
                expect(localStorageMock.getItem(lsTurnCount)).toBe(2);
                expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('X');
            });
        });

        describe('Player 1 wins by having 3 marks in row', () => {
            const [setShowModal, setModalValues] = [jest.fn(), jest.fn()];

            beforeEach(() => {
                localStorageMock.setItem(lsP1Mark, 'X');
                localStorageMock.setItem(lsP2Mark, 'O');
                localStorageMock.setItem(lsCurrentTurnMark, 'X');
                localStorageMock.setItem(lsP1Score, '0');
            });

            afterEach(() => {
                jest.clearAllMocks();
                localStorageMock.clear();
            });

            test('Player 1 needs one horizontal mark to win', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', null, 'X'],
                ]));

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[7]);

                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(screen.getAllByAltText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', 'X', 'X'],
                ]);
                expect(localStorageMock.getItem(lsP1Score)).toBe(1);
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
            });

            test('Player 1 needs one vertical mark to win', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O', 'X', null],
                    ['O', null, null],
                    [null, 'X', null],
                ]));

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[4]);

                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(screen.getAllByAltText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', 'X', null],
                    ['O', 'X', null],
                    [null, 'X', null],
                ]);
                expect(localStorageMock.getItem(lsP1Score)).toBe(1);
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
            });

            test('Player 1 needs one diagonal mark to win - Top bottom', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', null],
                ]));

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[8]);

                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(screen.getAllByAltText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', 'X'],
                ]);
                expect(localStorageMock.getItem(lsP1Score)).toBe(1);
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
            });

            test('Player 1 needs one diagonal mark to win - Bottom top', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O', null, null],
                    ['O', 'X', null],
                    ['X', null, null],
                ]));

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[2]);

                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(screen.getAllByAltText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', null, 'X'],
                    ['O', 'X', null],
                    ['X', null, null],
                ]);
                expect(localStorageMock.getItem(lsP1Score)).toBe(1);
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
            });
        });

        describe('Player 2 wins by having 3 marks in row', () => {
            const [setShowModal, setModalValues] = [jest.fn(), jest.fn()];

            beforeEach(() => {
                localStorageMock.setItem(lsP1Mark, 'O');
                localStorageMock.setItem(lsP2Mark, 'X');
                localStorageMock.setItem(lsCurrentTurnMark, 'X');
                localStorageMock.setItem(lsP2Score, '0');
            });

            afterEach(() => {
                jest.clearAllMocks();
                localStorageMock.clear();
            });

            test('Player 2 needs one horizontal mark to win', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', null, 'X'],
                ]));

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[7]);

                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(screen.getAllByAltText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', null, null],
                    [null, 'O', null],
                    ['X', 'X', 'X'],
                ]);
                expect(localStorageMock.getItem(lsP2Score)).toBe(1);
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
            });

            test('Player 2 needs one vertical mark to win', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O', 'X', null],
                    ['O', null, null],
                    [null, 'X', null],
                ]));

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[4]);

                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(screen.getAllByAltText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', 'X', null],
                    ['O', 'X', null],
                    [null, 'X', null],
                ]);
                expect(localStorageMock.getItem(lsP2Score)).toBe(1);
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
            });

            test('Player 2 needs one diagonal mark to win - Top bottom', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', null],
                ]));

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[8]);

                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(screen.getAllByAltText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['X', null, null],
                    ['O', 'X', null],
                    [null, 'O', 'X'],
                ]);
                expect(localStorageMock.getItem(lsP2Score)).toBe(1);
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
            });

            test('Player 2 needs one diagonal mark to win - Bottom top', () => {
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O', null, null],
                    ['O', 'X', null],
                    ['X', null, null],
                ]));

                const [playerX, setPlayerX] = ['X', jest.fn()];

                const { container, rerender } = render(
                    <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                const buttons = container.getElementsByTagName('button');

                fireEvent.click(buttons[2]);

                const [playerO, setPlayerO] = ['O', jest.fn()];

                rerender(
                    <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(screen.getAllByAltText('X')).toHaveLength(3);
                expect(JSON.parse(localStorageMock.getItem(lsBoardState))).toEqual([
                    ['O', null, 'X'],
                    ['O', 'X', null],
                    ['X', null, null],
                ]);
                expect(localStorageMock.getItem(lsP2Score)).toBe(1);
                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
            });
        });

        describe('Game is a tie', () => {
            const [setShowModal, setModalValues] = [jest.fn(), jest.fn()];
            const [player, setPlayer] = ['X', jest.fn()];

            beforeEach(() => {
                jest.clearAllMocks();
                localStorageMock.clear();
            });

            test('Board is full of marks and nobody won', () => {
                localStorageMock.setItem(lsP1Mark, 'X');
                localStorageMock.setItem(lsP2Mark, 'O');
                localStorageMock.setItem(lsTurnCount, 10);
                localStorageMock.setItem(lsBoardState, JSON.stringify([
                    ['O', 'X', 'X'],
                    ['X', 'X', 'O'],
                    ['O', 'O', 'X'],
                ]));

                render(
                    <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                        <GameBoard 
                            setShowModal={setShowModal}
                            setModalValues={setModalValues}
                        />
                    </PlayerCoxtext.Provider>
                );

                expect(setShowModal).toHaveBeenCalledWith(true);
                expect(setModalValues).toHaveBeenCalled();
                expect(localStorageMock.getItem(lsTiedScore)).toBe(1);
            });
        });
    });
});