import { fireEvent, render, screen } from '@testing-library/react';
import { localStorageMock } from '../../../helpers/mocks/localStorage.mock';
import { PlayerCoxtext } from '../../../hocs/PlayerContext';
import { GameBoard } from '../GameBoard';


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
            localStorageMock.clear();
            const [player, setPlayer] = ['X', jest.fn()];
    
            component = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameBoard />
                </PlayerCoxtext.Provider>
            ); 
        });

        test('should save board state in localStorage for the first time', () => {
            const boardState = JSON.parse(localStorageMock.getItem('boardState'));

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

            const boardState = JSON.parse(localStorageMock.getItem('boardState'));

            expect(boardState).toEqual([
                [null, null, null],
                [null, 'X',  null],
                [null, null, null],
            ]);
        });

        test('should get board state from localStorage and display board as expected', () => {
            localStorageMock.setItem('boardState', JSON.stringify([
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

    test.todo('CPU can win if it needs one move');
    // describe('Game is Player vs CPU', () => { 
    //     // FIXME: Update test based on board state
    //     let component;

    //     beforeEach(() => {
    //         localStorageMock.setItem('CPUMark', 'X');
    //         localStorageMock.setItem('playerMark', 'O');

    //         const [player, setPlayer] = ['X', jest.fn()];

    //         component = render(
    //             <PlayerCoxtext.Provider value={{ player, setPlayer }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );
    //     });

    //     afterEach(() => {
    //         localStorageMock.clear();
    //     });

    //     test('if CPU is first, then it should click one box', () => { 
    //         expect(screen.getByAltText('X')).toBeInTheDocument();
    //     });   

    //     test('player makes a move and CPU should click other box different to the first one', () => { 
    //         expect(screen.getAllByAltText('X')).toHaveLength(1);

    //         const [playerO, setPlayerO] = ['O', jest.fn()];

    //         component.rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerO, setPlayer: setPlayerO }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const buttons = screen.getAllByRole('button');
    //         let pos = Math.floor(Math.random() * 9);
            
    //         while (buttons[pos].hasChildNodes()) {
    //             pos = Math.floor(Math.random() * 9);
    //         }

    //         fireEvent.click(buttons[pos]);

    //         expect(screen.getAllByAltText('O')).toHaveLength(1);

    //         const [playerX, setPlayerX] = ['X', jest.fn()];

    //         component.rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerX, setPlayer: setPlayerX }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         expect(screen.getAllByAltText('X')).toHaveLength(2);
    //     });

    //     test('player makes two horizontal moves and needs one to win. CPU should block player win', () => { 
    //         localStorageMock.clear();
    //         localStorageMock.setItem('playerMark', 'X');
    //         localStorageMock.setItem('CPUMark', 'O');

    //         const [playerX1, setPlayerX1] = ['X', jest.fn()];

    //         const { container, rerender } = render(
    //             <PlayerCoxtext.Provider value={{ player: playerX1, setPlayer: setPlayerX1 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const buttons = container.getElementsByTagName('button');
    //         fireEvent.click(buttons[0]);

    //         const [playerO1, setPlayerO1] = ['O', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerO1, setPlayer: setPlayerO1 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const [playerX2, setPlayerX2] = ['X', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerX2, setPlayer: setPlayerX2 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         fireEvent.click(buttons[2]);

    //         const [playerO2, setPlayerO2] = ['O', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerO2, setPlayer: setPlayerO2 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const buttonToBlockWin = buttons[1].children;

    //         expect(buttonToBlockWin).toHaveLength(1);
    //         expect(buttonToBlockWin.item(0).alt).toBe('O');
    //     });

    //     test('player makes two vertical moves and needs one to win. CPU should block player win', () => { 
    //         localStorageMock.clear();
    //         localStorageMock.setItem('playerMark', 'X');
    //         localStorageMock.setItem('CPUMark', 'O');

    //         const [playerX1, setPlayerX1] = ['X', jest.fn()];

    //         const { container, rerender } = render(
    //             <PlayerCoxtext.Provider value={{ player: playerX1, setPlayer: setPlayerX1 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const buttons = container.getElementsByTagName('button');
    //         fireEvent.click(buttons[1]);

    //         const [playerO1, setPlayerO1] = ['O', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerO1, setPlayer: setPlayerO1 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const [playerX2, setPlayerX2] = ['X', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerX2, setPlayer: setPlayerX2 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         fireEvent.click(buttons[4]);

    //         const [playerO2, setPlayerO2] = ['O', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerO2, setPlayer: setPlayerO2 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const buttonToBlockWin = buttons[7].children;

    //         expect(buttonToBlockWin).toHaveLength(1);
    //         expect(buttonToBlockWin.item(0).alt).toBe('O');
    //     });

    //     test('player makes two diagonal moves and needs one to win. CPU should block player win', () => { 
    //         // TODO: Update test to take game state from localStorage
    //         localStorageMock.clear();
    //         localStorageMock.setItem('playerMark', 'X');
    //         localStorageMock.setItem('CPUMark', 'O');

    //         const [playerX1, setPlayerX1] = ['X', jest.fn()];

    //         const { container, rerender } = render(
    //             <PlayerCoxtext.Provider value={{ player: playerX1, setPlayer: setPlayerX1 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const buttons = container.getElementsByTagName('button');
    //         fireEvent.click(buttons[4]);

    //         const [playerO1, setPlayerO1] = ['O', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerO1, setPlayer: setPlayerO1 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const [playerX2, setPlayerX2] = ['X', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerX2, setPlayer: setPlayerX2 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         fireEvent.click(buttons[6]);

    //         const [playerO2, setPlayerO2] = ['O', jest.fn()];

    //         rerender(
    //             <PlayerCoxtext.Provider value={{ player: playerO2, setPlayer: setPlayerO2 }}>
    //                 <GameBoard />
    //             </PlayerCoxtext.Provider>
    //         );

    //         const buttonToBlockWin = buttons[2].children;

    //         expect(buttonToBlockWin).toHaveLength(1);
    //         expect(buttonToBlockWin.item(0).alt).toBe('O');
    //     });

    // });
});