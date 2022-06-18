import { render, screen } from "@testing-library/react";
import { GameBoard } from "../GameBoard";

describe('Test <GameBoard />', () => { 
    test('should have nine boxes', () => { 
        render(<GameBoard />);

        expect(screen.getAllByRole('button')).toHaveLength(9);
    });
});