import { render, screen } from "@testing-library/react";
import { PlayerCoxtext } from "../../../hocs/PlayerContext";
import { GameHeader } from "../GameHeader";

describe('Test <GameHeader />', () => { 
    test('should render elements correctly', () => { 
        render(
            <PlayerCoxtext.Provider value={{ player: 'X' }}>
                <GameHeader />
            </PlayerCoxtext.Provider>
        );

        expect(screen.getByRole('heading', { name: 'Tic tac toe' })).toBeInTheDocument();
        expect(screen.getAllByRole('img')[0].getAttribute('src').includes('logo')).toBeTruthy();
        expect(screen.getByText('TURN')).toBeInTheDocument();
        expect(screen.getByLabelText('restart')).toBeInTheDocument();
        expect(screen.getByLabelText('restart').children.item(0).src.includes('restart')).toBeTruthy();
    });

    test('should switch player turn', () => { 
        const { rerender } = render(
            <PlayerCoxtext.Provider value={{ player: 'X' }}>
                <GameHeader />
            </PlayerCoxtext.Provider>
        );

        expect(screen.getByAltText('X')).toBeInTheDocument();
        
        rerender(
            <PlayerCoxtext.Provider value={{ player: 'O' }}>
                <GameHeader />
            </PlayerCoxtext.Provider>
        );
        
        expect(screen.getByAltText('O')).toBeInTheDocument();
    });
});