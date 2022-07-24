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
    })
});