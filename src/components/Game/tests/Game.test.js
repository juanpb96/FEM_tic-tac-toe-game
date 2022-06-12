import { render, screen } from "@testing-library/react";
import { Game } from "../Game";

describe('Test <GameStart />', () => { 
    test('should contain main title', () => { 
        render(<Game />);

        expect(
            screen.getByRole('heading', { name: /Tic Tac Toe/i })
        ).toBeInTheDocument();
    });

    
});