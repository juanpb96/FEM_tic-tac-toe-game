import { fireEvent, render, screen } from '@testing-library/react';
import { GameBox } from '../GameBox';

describe('Test <GameBox />', () => {
    test('should render an empty box', () => { 
        render(<GameBox />);

        const box = screen.getByRole('button');

        expect(box).toBeInTheDocument();
        expect(box.children).toHaveLength(0);
    });

    test('should render an "X" if player "X" has clicked the box', () => {
        render(<GameBox player={'X'} />);

        const box = screen.getByRole('button');

        fireEvent.click(box);

        const image = box.children[0];

        expect(image.tagName).toBe('IMG');
        expect(image.src.includes('icon-x.svg')).toBeTruthy();
        expect(image.alt).toBe('X');
    });

    test('should not replace the current mark if the other player ("O") has clicked the box', () => {
        const { rerender } = render(<GameBox player={'X'} />);

        fireEvent.click(screen.getByRole('button'));

        rerender(<GameBox player={'O'} />);

        fireEvent.click(screen.getByRole('button'));

        const image = screen.getByRole('img');

        expect(image.src.includes('icon-x.svg')).toBeTruthy();
        expect(image.alt).toBe('X');
    });
});