import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { PlayerCoxtext } from '../../../hocs/PlayerContext';
import { Game } from '../Game';

const [player, setPlayer] = ['X', jest.fn()];

describe('Test <GameStart />', () => {
    test('should contain main title', () => { 
        render(
            <PlayerCoxtext.Provider value={{
                player,
                setPlayer
            }}>
                <Game />
            </PlayerCoxtext.Provider>
        );

        expect(
            screen.getByRole('heading', { name: /Tic Tac Toe/i })
        ).toBeInTheDocument();
    });

    describe('modal should', () => { 
        test('open when user clicks on "restart" button and close if "No, cancel" is pressed', () => { 
            const { container } = render(
                <PlayerCoxtext.Provider value={{
                    player,
                    setPlayer
                }}>
                    <Game />
                </PlayerCoxtext.Provider>
            );

            const restartButton = screen.getByRole('button', { name: 'restart' });

            fireEvent.click(restartButton);

            expect(screen.getByText('RESTART GAME?')).toBeInTheDocument();

            const cancelButton = screen.getByRole('button', { name: 'NO, CANCEL' });

            fireEvent.click(cancelButton);

            expect(container).toMatchSnapshot();
        });
    });
});