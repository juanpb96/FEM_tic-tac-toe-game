import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../AppRouter';
import { GameContext } from '../../hocs/GameContext';
import { getEmptyBoard } from '../../helpers/getEmptyBoard';

describe('Test <AppRouter />', () => {
    const gameState = {
        currentPlayer: 'X',
        board: getEmptyBoard(),
        turnCounter: 1,
        isGameOver: false,
        isCpuFirstMove: true
    };

    const dispatch = jest.fn();

    test('should render Game route correctly', () => { 
        const { container } = render(
            <GameContext.Provider value={{ gameState, dispatch }}>
                <MemoryRouter initialEntries={['/']}>
                    <AppRouter />
                </MemoryRouter>
            </GameContext.Provider>
        );

        expect(container).toMatchSnapshot();
        expect(screen.getByLabelText('restart')).toBeInTheDocument();
    });

    test('should render NewGame route correctly', () => { 
        const { container } = render(
            <GameContext.Provider value={{ gameState, dispatch }}>
                <MemoryRouter initialEntries={['/new-game']}>
                    <AppRouter />
                </MemoryRouter>
            </GameContext.Provider>
        );

        expect(container).toMatchSnapshot();
        expect(screen.getByText('REMEMBER : X GOES FIRST')).toBeInTheDocument();
    });   
});