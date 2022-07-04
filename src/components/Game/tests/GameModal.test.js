import { render, screen } from '@testing-library/react';
import { GameModal } from '../GameModal';

describe('Test <GameModal />', () => { 
    test('should have a title and buttons', () => { 
        render(<GameModal />);

        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    describe('should display a correct structure in case', () => { 
        test('player wants to restart a game', () => { 
            const { container } = render(<GameModal type='restart' />);
    
            expect(screen.getByRole('heading', { name: 'RESTART GAME?' })).toBeInTheDocument();
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('NO, CANCEL');
            expect(buttons[1].textContent).toBe('YES, RESTART');
        });
    
        test('a round ended as tied', () => { 
            const { container } = render(<GameModal type='tied' />);
    
            expect(screen.getByRole('heading', { name: 'ROUND TIED' })).toBeInTheDocument();
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
    
        test('player wins against CPU', () => { 
            const { container } = render(<GameModal type='player-won' winnerMark='X' />);
    
            expect(screen.getByText('YOU WON!')).toBeInTheDocument();
            expect(screen.getByAltText('X')).toBeInTheDocument();
            expect(screen.getByRole('heading').textContent).toBe('TAKES THE ROUND');
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
    
        test('player loses against CPU', () => { 
            const { container } = render(<GameModal type='player-lost' winnerMark='O' />);
    
            expect(screen.getByText('OH NO, YOU LOST…')).toBeInTheDocument();
            expect(screen.getByAltText('O')).toBeInTheDocument();
            expect(screen.getByRole('heading').textContent).toBe('TAKES THE ROUND');
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });

        test('player 1 wins against player 2', () => { 
            const { container } = render(<GameModal type='player1-won' winnerMark='O' />);
    
            expect(screen.getByText('PLAYER 1 WINS!')).toBeInTheDocument();
            expect(screen.getByAltText('O')).toBeInTheDocument();
            expect(screen.getByRole('heading').textContent).toBe('TAKES THE ROUND');
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
        
        test('player 2 wins against player 1', () => { 
            const { container } = render(<GameModal type='player2-won' winnerMark='X' />);
    
            expect(screen.getByText('PLAYER 2 WINS!')).toBeInTheDocument();
            expect(screen.getByAltText('X')).toBeInTheDocument();
            expect(screen.getByRole('heading').textContent).toBe('TAKES THE ROUND');
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
    });
});