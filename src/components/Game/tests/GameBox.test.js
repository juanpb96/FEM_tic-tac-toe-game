import { fireEvent, render, screen } from '@testing-library/react';
import { GameBox } from '../GameBox';

const mockUpdateBoard = jest.fn();

describe('Test <GameBox />', () => {
    const imageTag = 'svg';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render an empty box', () => { 
        render(<GameBox />);

        const box = screen.getByRole('button');

        expect(box).toBeInTheDocument();
        expect(box.children).toHaveLength(0);
    });

    test('should render an "X" if player "X" has clicked the box', () => {
        const currentPlayer = 'X';

        render(
            <GameBox
                hasMark={false}
                mark={null}
                currentPlayer={currentPlayer} 
                row={ 0 }
                col={ 1 }
                updateBoard={ mockUpdateBoard }
            />
        );

        const box = screen.getByRole('button');

        fireEvent.click(box);

        expect(mockUpdateBoard).toHaveBeenCalledWith(0, 1);

        const image = box.children[0];

        expect(image.tagName).toBe(imageTag);
        expect(image.getAttribute('aria-label')).toBe(currentPlayer);
    });

    test('should render an "X" if player "X" has marked the box from a saved game', () => {
        const currentPlayer = 'O'
        
        render(
            <GameBox
                hasMark={true}
                mark={'X'}
                currentPlayer={currentPlayer} 
                row={ 0 }
                col={ 1 }
                updateBoard={ mockUpdateBoard }
            />
        );

        expect(mockUpdateBoard).not.toHaveBeenCalled();

        const box = screen.getByRole('button');
        const image = box.children[0];

        expect(image.tagName).toBe(imageTag);
        expect(image.getAttribute('aria-label')).toBe('X');
    });

    test('should not replace the current mark if the other player ("O") has clicked the box', () => {
        const { rerender } = render(
            <GameBox
                hasMark={false}
                mark={null}
                currentPlayer={'X'} 
                row={ 1 }
                col={ 0 }
                updateBoard={ mockUpdateBoard }
            />
        );

        fireEvent.click(screen.getByRole('button'));

        expect(mockUpdateBoard).toHaveBeenCalledWith(1, 0);

        rerender(<GameBox currentPlayer={'O'} />);

        fireEvent.click(screen.getByRole('button'));

        const image = screen.getByRole('img');

        expect(image.getAttribute('aria-label')).toBe('X');
    });

    test('should not mark the box if game is over', () => { 
        render(
            <GameBox
                hasMark={false}
                mark={null}
                currentPlayer={'X'} 
                row={ 1 }
                col={ 0 }
                updateBoard={ mockUpdateBoard }
                isGameOver={true}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByRole('button').children).toHaveLength(0);
    });
});