import { render, screen } from '@testing-library/react';
import { localStorageMock } from '../../../helpers/mocks/localStorage.mock';
import { STORAGE } from '../../../types/types';
import { GameFooter } from '../GameFooter';

const {
    lsCpuMark,
    lsCpuScore,
    lsPlayerMark,
    lsPlayerScore,
    lsP1Mark,
    lsP1Score,
    lsP2Mark,
    lsP2Score,
    lsTiedScore,
} = STORAGE;

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

    describe('should contain titles and scores respectively when game is', () => {
        afterEach(() => {
            localStorageMock.clear();
        });

        test('Player vs CPU', () => {
            localStorageMock.setItem(lsPlayerMark, 'X');
            localStorageMock.setItem(lsPlayerScore, '5');
            localStorageMock.setItem(lsTiedScore, '2');
            localStorageMock.setItem(lsCpuMark, 'O');
            localStorageMock.setItem(lsCpuScore, '11');
    
            render(<GameFooter />);
    
            const scores = screen.getAllByLabelText(/score/i);
    
            expect(scores[0].children.item(0).textContent).toBe('X (YOU)');
            expect(scores[0].children.item(1).textContent).toBe('5');
            expect(scores[1].children.item(0).textContent).toBe('TIES');
            expect(scores[1].children.item(1).textContent).toBe('2');
            expect(scores[2].children.item(0).textContent).toBe('O (CPU)');
            expect(scores[2].children.item(1).textContent).toBe('11');
        });
    
        test('Player vs Player', () => {
            localStorageMock.setItem(lsP1Mark, 'O');
            localStorageMock.setItem(lsP1Score, '11');
            localStorageMock.setItem(lsTiedScore, '32');
            localStorageMock.setItem(lsP2Mark, 'X');
            localStorageMock.setItem(lsP2Score, '14');
    
            render(<GameFooter />);
    
            const scores = screen.getAllByLabelText(/score/i);
    
            expect(scores[0].children.item(0).textContent).toBe('X (P2)');
            expect(scores[0].children.item(1).textContent).toBe('14');
            expect(scores[1].children.item(0).textContent).toBe('TIES');
            expect(scores[1].children.item(1).textContent).toBe('32');
            expect(scores[2].children.item(0).textContent).toBe('O (P1)');
            expect(scores[2].children.item(1).textContent).toBe('11');
        });
    });

});