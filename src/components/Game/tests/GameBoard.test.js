import { fireEvent, render, screen } from '@testing-library/react';
import { PlayerCoxtext } from '../../../hocs/PlayerContext';
import { GameBoard } from '../GameBoard';

const [player, setPlayer] = ['X', jest.fn()];

describe('Test <GameBoard />', () => { 
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