import { fireEvent, render, screen } from "@testing-library/react";
import { NewGame } from "../NewGame";

describe('Test <NewGame />', () => { 
    beforeEach(() => {
        render(<NewGame />);
    });

    describe('should contain >', () => {
        test('page title', () => { 
            expect(
                screen.getByRole('heading', { name: /Tic tac toe/i })
            ).toBeInTheDocument();
        });
    
        test('player mark options', async() => { 
            expect(
                screen.getByRole('heading', { name: /PICK PLAYER 1’S MARK/i })
                ).toBeInTheDocument();    
            expect(
                screen.getByText('REMEMBER : X GOES FIRST')
            ).toBeInTheDocument();

            const radioElements = await screen.findAllByRole('radio');
            const images = await screen.findAllByAltText(/X|O/i);

            expect(radioElements).toHaveLength(2);
            expect(images).toHaveLength(2);
        });
    
        test('new game buttons', async() => { 
            const [ vsCPUButton, vsPlayerButton ] = await screen.findAllByRole('button');
    
            expect(vsCPUButton.textContent).toBe('New Game (VS CPU)');
            expect(vsPlayerButton.textContent).toBe('New Game (VS Player)');
        });
    });

    describe('should check events', () => { 
        const ariaAttribute = 'aria-checked';

        test('toggle player 1\'s mark', () => { 
            let [ markX, markO ] = screen.getAllByRole('radio');
            
            expect(markX.getAttribute(ariaAttribute)).toBe('false');
            expect(markO.getAttribute(ariaAttribute)).toBe('true');

            fireEvent.click(markX, { target: { 'aria-checked': false } });
            
            expect(markX.getAttribute(ariaAttribute)).toBe('true');
            expect(markO.getAttribute(ariaAttribute)).toBe('false');
        }); 
        
        test('not toggle player 1\'s mark if the one selected is clicked', () => {
            let [ markX, markO ] = screen.getAllByRole('radio');

            fireEvent.click(markO, { target: { 'aria-checked': true } });
            
            expect(markX.getAttribute(ariaAttribute)).toBe('false');
            expect(markO.getAttribute(ariaAttribute)).toBe('true');
        });
    });
});