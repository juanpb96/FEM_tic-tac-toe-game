import { fireEvent, render, screen } from "@testing-library/react";

import { GameContext } from "../../../hocs/GameContext";
import { GameHeader } from "../GameHeader";

import { MODAL_TYPES } from "../../../types/types";

describe('Test <GameHeader />', () => { 
    const openModal = jest.fn();

    const gameState = { currentPlayer: 'X' };

    afterEach(() => {
        gameState.currentPlayer = 'X';
        jest.clearAllMocks();
    });

    test('should render elements correctly', () => { 
        render(
            <GameContext.Provider value={{ gameState }}>
                <GameHeader openModal={openModal} />
            </GameContext.Provider>
        );

        expect(screen.getByRole('heading', { name: 'Tic tac toe' })).toBeInTheDocument();
        expect(screen.getAllByRole('img')[0].getAttribute('src').includes('logo')).toBeTruthy();
        expect(screen.getByText('TURN')).toBeInTheDocument();
        expect(screen.getByLabelText('restart')).toBeInTheDocument();
        expect(screen.getByLabelText('restart').children.item(0).src.includes('restart')).toBeTruthy();
    });

    test('should switch player turn', () => { 
        const { rerender } = render(
            <GameContext.Provider value={{ gameState }}>
                <GameHeader openModal={openModal} />
            </GameContext.Provider>
        );

        expect(screen.getByAltText('X')).toBeInTheDocument();
        
        gameState.currentPlayer = 'O';

        rerender(
            <GameContext.Provider value={{ gameState }}>
                <GameHeader openModal={openModal} />
            </GameContext.Provider>
        );
        
        expect(screen.getByAltText('O')).toBeInTheDocument();
    });

    test('should display restart modal', () => {
        render(
            <GameContext.Provider value={{ gameState }}>
                <GameHeader openModal={openModal} />
            </GameContext.Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'restart' }));

        expect(openModal).toHaveBeenCalledWith(MODAL_TYPES.restart);
    });
});