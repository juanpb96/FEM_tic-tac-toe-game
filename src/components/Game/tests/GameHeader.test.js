import { render, screen } from "@testing-library/react";
import { GameHeader } from "../GameHeader";

describe('Test <GameHeader />', () => { 
    test('should render elements correctly', () => { 
        render(<GameHeader />);

        expect(screen.getByRole('heading', { name: 'Tic tac toe' })).toBeInTheDocument();
        expect(screen.getAllByRole('img')[0].getAttribute('src').includes('logo')).toBeTruthy();
        expect(screen.getByText('TURN')).toBeInTheDocument();
        expect(screen.getByLabelText('restart')).toBeInTheDocument();
        expect(screen.getAllByRole('img')[1].getAttribute('src').includes('restart')).toBeTruthy();
    });   
});