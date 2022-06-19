import { render, screen } from "@testing-library/react";
import { GameFooter } from "../GameFooter";

describe('Test <GameFooter />', () => { 
    test('should contain scores', () => { 
        render(<GameFooter />);
        
        const scores = screen.getAllByLabelText(/score/i);

        expect(scores).toHaveLength(3);
    
        scores.forEach(score => {
            expect(score.children.item(0).tagName).toBe('H2');
            expect(score.children.item(1).tagName).toBe('P');
        });
    });   
});