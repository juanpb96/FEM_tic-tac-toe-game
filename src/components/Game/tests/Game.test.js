import { render, screen, fireEvent } from '@testing-library/react';

import { GameContext } from '../../../hocs/GameContext';
import { Game } from '../Game';

import { getEmptyBoard } from '../../../helpers/getEmptyBoard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const gameState = {
    currentPlayer: 'X',
    board: getEmptyBoard(),
    turnCounter: 1,
    isGameOver: false,
    isCpuFirstMove: true
};

const dispatch = jest.fn();

describe('Test <Game />', () => {
    test('should contain main title', () => { 
        render(
            <GameContext.Provider value={{
                gameState,
                dispatch
            }}>
                <Game />
            </GameContext.Provider>
        );

        expect(
            screen.getByRole('heading', { name: /Tic Tac Toe/i })
        ).toBeInTheDocument();
    });

    describe('modal should', () => { 
        test('open when user clicks on "restart" button and close if "No, cancel" is pressed', () => { 
            const { container } = render(
                <GameContext.Provider value={{
                    gameState,
                    dispatch
                }}>
                    <Game />
                </GameContext.Provider>
            );

            const restartButton = screen.getByRole('button', { name: 'restart' });

            fireEvent.click(restartButton);

            expect(screen.getByText('RESTART GAME?')).toBeInTheDocument();

            const cancelButton = screen.getByRole('button', { name: 'NO, CANCEL' });

            fireEvent.click(cancelButton);

            expect(container).toMatchSnapshot();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});