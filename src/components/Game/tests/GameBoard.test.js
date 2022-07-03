import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    describe('Game is Player vs CPU', () => { 
        let component;

        beforeEach(() => {
            localStorageMock.setItem('playerMark', 'O');
            localStorageMock.setItem('CPUMark', 'X');

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

        test('player made a move and CPU should click other box different to the first one', () => { 
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
    });
});