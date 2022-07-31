import { fireEvent, render, screen } from '@testing-library/react';
import { localStorageMock } from '../../../helpers/mocks/localStorage.mock';
import { PlayerCoxtext } from '../../../hocs/PlayerContext';
import { MODAL_TYPES, STORAGE } from '../../../types/types';
import { GameModal } from '../GameModal';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));


const {
    lsBoardState,
    lsCurrentTurnMark,
    lsTurnCount,
} = STORAGE;

const [player, setPlayer] = ['X', jest.fn()];

describe('Test <GameModal />', () => { 
    test('should have a title and buttons', () => { 
        render(
            <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                <GameModal />
            </PlayerCoxtext.Provider>
        );

        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    describe('should display a correct structure in case', () => { 
        test('player wants to restart a game', () => { 
            const { container } = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal type='restart' />
                </PlayerCoxtext.Provider>
            );
    
            expect(screen.getByRole('heading', { name: 'RESTART GAME?' })).toBeInTheDocument();
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('NO, CANCEL');
            expect(buttons[1].textContent).toBe('YES, RESTART');
        });
    
        test('a round ended as tied', () => { 
            const { container } = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal type='tied' />
                </PlayerCoxtext.Provider>
            );
    
            expect(screen.getByRole('heading', { name: 'ROUND TIED' })).toBeInTheDocument();
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
    
        test('player wins against CPU', () => { 
            const { container } = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal
                        type={MODAL_TYPES.player_won}
                        winnerMark='X'
                    />
                </PlayerCoxtext.Provider>
            );
    
            expect(screen.getByText('YOU WON!')).toBeInTheDocument();
            expect(screen.getByAltText('X')).toBeInTheDocument();
            expect(screen.getByRole('heading').textContent).toBe('TAKES THE ROUND');
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
    
        test('player loses against CPU', () => { 
            const { container } = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal
                        type={MODAL_TYPES.player_lost}
                        winnerMark='O'
                    />
                </PlayerCoxtext.Provider>
            );
    
            expect(screen.getByText('OH NO, YOU LOST…')).toBeInTheDocument();
            expect(screen.getByAltText('O')).toBeInTheDocument();
            expect(screen.getByRole('heading').textContent).toBe('TAKES THE ROUND');
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });

        test('player 1 wins against player 2', () => { 
            const { container } = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal
                        type={MODAL_TYPES.player1_won}
                        winnerMark='O'
                    />
                </PlayerCoxtext.Provider>
            );
    
            expect(screen.getByText('PLAYER 1 WINS!')).toBeInTheDocument();
            expect(screen.getByAltText('O')).toBeInTheDocument();
            expect(screen.getByRole('heading').textContent).toBe('TAKES THE ROUND');
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
        
        test('player 2 wins against player 1', () => { 
            const { container } = render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal
                        type={MODAL_TYPES.player2_won}
                        winnerMark='X'
                    />
                </PlayerCoxtext.Provider>
            );
    
            expect(screen.getByText('PLAYER 2 WINS!')).toBeInTheDocument();
            expect(screen.getByAltText('X')).toBeInTheDocument();
            expect(screen.getByRole('heading').textContent).toBe('TAKES THE ROUND');
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
    });

    describe('should execute click actions correctly', () => {
        const setShowModal = jest.fn();

        afterEach(() => {
            jest.clearAllMocks();
            localStorageMock.clear();
        });

        test('should send player to "New Game" screen if player clicks on "Quit"', () => {
            render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal
                        type={MODAL_TYPES.tied}
                        setShowModal={setShowModal}
                    />
                </PlayerCoxtext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'QUIT' }));

            expect(mockNavigate).toHaveBeenCalledWith('/new-game', { replace: true });
            expect(setShowModal).toHaveBeenCalledWith(false);
        });

        test('should reset the board, current mark and turn count when player clicks on "NEXT ROUND"', () => {
            localStorageMock.setItem(lsBoardState, JSON.stringify([
                ['O', 'X', 'X'],
                ['X', 'X', 'O'],
                ['O', 'O', 'X'],
            ]));
            localStorageMock.setItem(lsCurrentTurnMark, 'O');
            localStorageMock.setItem(lsTurnCount, '10');

            render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal
                        type={MODAL_TYPES.tied}
                        setShowModal={setShowModal}
                    />
                </PlayerCoxtext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'NEXT ROUND' }));

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(localStorageMock.getItem(lsBoardState)).toEqual(undefined);
            expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('X')
            expect(localStorageMock.getItem(lsTurnCount)).toBe('1');
            expect(setPlayer).toHaveBeenCalledWith('X');
            expect(setShowModal).toHaveBeenCalledWith(false);
        });

        test('should close the modal when player clicks on "NO, CANCEL"', () => {
            render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal
                        type={MODAL_TYPES.restart}
                        setShowModal={setShowModal}
                    />
                </PlayerCoxtext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'NO, CANCEL' }));

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(setShowModal).toHaveBeenCalledWith(false);
        });

        test('should reset the board, current mark and turn count when player clicks on "YES, RESTART"', () => {
            localStorageMock.setItem(lsBoardState, JSON.stringify([
                ['O', 'X', 'X'],
                ['X', 'X', 'O'],
                ['O', 'O', 'X'],
            ]));
            localStorageMock.setItem(lsCurrentTurnMark, 'O');
            localStorageMock.setItem(lsTurnCount, '10');

            render(
                <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                    <GameModal
                        type={MODAL_TYPES.restart}
                        setShowModal={setShowModal}
                    />
                </PlayerCoxtext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'YES, RESTART' }));

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(localStorageMock.getItem(lsBoardState)).toEqual(undefined);
            expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('X')
            expect(localStorageMock.getItem(lsTurnCount)).toBe('1');
            expect(setPlayer).toHaveBeenCalledWith('X');
            expect(setShowModal).toHaveBeenCalledWith(false);
        });
    });
});