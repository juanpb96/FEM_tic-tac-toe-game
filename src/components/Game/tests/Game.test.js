import { render, screen } from "@testing-library/react";
import { PlayerCoxtext } from "../../../hocs/PlayerContext";
import { Game } from "../Game";

const [player, setPlayer] = ['X', jest.fn()];

describe('Test <GameStart />', () => { 
    beforeEach(() => {
        render(
            <PlayerCoxtext.Provider value={{
                player,
                setPlayer
            }}>
                <Game />
            </PlayerCoxtext.Provider>
        );
    });

    test('should contain main title', () => { 
        expect(
            screen.getByRole('heading', { name: /Tic Tac Toe/i })
        ).toBeInTheDocument();
    });
});