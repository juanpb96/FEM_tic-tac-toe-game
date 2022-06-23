import { fireEvent, render, screen } from '@testing-library/react';
import { NewGame } from '../NewGame';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

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

    describe('should navigate to Game and save data in localStorage', () => { 
        Storage.prototype.clear = jest.fn();
        Storage.prototype.setItem = jest.fn();

        test('when user clicks on New Game VS CPU', () => { 

            fireEvent.click(screen.getByRole('button', { name: 'New Game (VS CPU)' }));

            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
            expect(localStorage.clear).toHaveBeenCalledTimes(1);
            expect(localStorage.setItem).toHaveBeenCalledWith('playerMark', 'O');
            expect(localStorage.setItem).toHaveBeenCalledWith('CPUMark', 'X');
        });
        
        test('when user clicks on New Game VS Player', () => {           
            fireEvent.click(screen.getByRole('button', { name: 'New Game (VS Player)' }));
            
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
            expect(localStorage.clear).toHaveBeenCalledTimes(1);
            expect(localStorage.setItem).toHaveBeenCalledWith('p1Mark', 'O');
            expect(localStorage.setItem).toHaveBeenCalledWith('p2Mark', 'X');
        });
    });
});