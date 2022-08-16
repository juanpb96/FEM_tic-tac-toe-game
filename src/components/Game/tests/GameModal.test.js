import { fireEvent, render, screen } from '@testing-library/react';

import { GameContext } from '../../../hocs/GameContext';
import { GameModal } from '../GameModal';

import { getEmptyBoard } from '../../../helpers/getEmptyBoard';
import { localStorageMock } from '../../../helpers/mocks/localStorage.mock';
import { ACTIONS, MODAL_TYPES, STORAGE } from '../../../types/types';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));


const {
    lsBoardState,
    lsCurrentTurnMark,
    lsTurnCount,
    lsCpuMark,
} = STORAGE;

const gameState = {
    turnCounter: 1
};

const dispatch = jest.fn();

describe('Test <GameModal />', () => {
    afterEach(() => {
        gameState.board = getEmptyBoard();
        gameState.currentMark = 'X';
        gameState.turnCounter = 1;
        jest.clearAllMocks();
    });

    test('should have a title and buttons', () => { 
        render(
            <GameContext.Provider value={{ gameState, dispatch }}>
                <GameModal />
            </GameContext.Provider>
        );

        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    describe('should display a correct structure in case', () => { 
        test('player wants to restart a game', () => { 
            const { container } = render(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal type='restart' />
                </GameContext.Provider>
            );
    
            expect(screen.getByRole('heading', { name: 'RESTART GAME?' })).toBeInTheDocument();
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('NO, CANCEL');
            expect(buttons[1].textContent).toBe('YES, RESTART');
        });
    
        test('a round ended as tied', () => { 
            const { container } = render(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal type='tied' />
                </GameContext.Provider>
            );
    
            expect(screen.getByRole('heading', { name: 'ROUND TIED' })).toBeInTheDocument();
            
            const buttons = container.getElementsByTagName('button');
    
            expect(buttons[0].textContent).toBe('QUIT');
            expect(buttons[1].textContent).toBe('NEXT ROUND');
        });
    
        test('player wins against CPU', () => { 
            const { container } = render(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.player_won}
                        winnerMark='X'
                    />
                </GameContext.Provider>
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
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.player_lost}
                        winnerMark='O'
                    />
                </GameContext.Provider>
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
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.player1_won}
                        winnerMark='O'
                    />
                </GameContext.Provider>
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
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.player2_won}
                        winnerMark='X'
                    />
                </GameContext.Provider>
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
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.tied}
                        setShowModal={setShowModal}
                    />
                </GameContext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'QUIT' }));

            expect(mockNavigate).toHaveBeenCalledWith('/new-game', { replace: true });
            expect(setShowModal).toHaveBeenCalledWith(false);
        });

        test('should reset the board, current mark and turn count when player clicks on "NEXT ROUND"', () => {
            gameState.board = [
                ['O', 'X', 'X'],
                ['X', 'X', 'O'],
                ['O', 'O', 'X'],
            ];
            gameState.currentMark = 'O';
            gameState.turnCounter = 10;

            render(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.tied}
                        setShowModal={setShowModal}
                    />
                </GameContext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'NEXT ROUND' }));

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(localStorageMock.getItem(lsBoardState)).toEqual(undefined);
            expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('X')
            expect(localStorageMock.getItem(lsTurnCount)).toBe('1');
            expect(dispatch).toHaveBeenCalledWith({ type: ACTIONS.resetGame });
            expect(setShowModal).toHaveBeenCalledWith(false);
        });

        test('should reset the game. If game is Player vs CPU, it should make CPU move first', () => {
            localStorageMock.setItem(lsCpuMark, 'O');
            
            gameState.board = [
                ['O', 'X', 'X'],
                ['X', 'X', 'O'],
                ['O', 'O', 'X'],
            ];
            gameState.currentMark = 'O';
            gameState.turnCounter = 10;

            render(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.tied}
                        setShowModal={setShowModal}
                    />
                </GameContext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'NEXT ROUND' }));

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(localStorageMock.getItem(lsBoardState)).toEqual(undefined);
            expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('X')
            expect(localStorageMock.getItem(lsTurnCount)).toBe('1');
            expect(dispatch).toHaveBeenCalledWith({
                type: ACTIONS.setCpuMoveFirst,
                payload: true
            });
            expect(dispatch).toHaveBeenCalledWith({ type: ACTIONS.resetGame });
            expect(setShowModal).toHaveBeenCalledWith(false);
        });

        test('should close the modal when player clicks on "NO, CANCEL"', () => {
            render(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.restart}
                        setShowModal={setShowModal}
                    />
                </GameContext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'NO, CANCEL' }));

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(setShowModal).toHaveBeenCalledWith(false);
        });

        test('should reset the board, current mark and turn count when player clicks on "YES, RESTART"', () => {
            gameState.board = [
                ['O', 'X', 'X'],
                ['X', 'X', 'O'],
                ['O', 'O', 'X'],
            ];
            gameState.currentMark = 'O';
            gameState.turnCounter = 10;

            render(
                <GameContext.Provider value={{ gameState, dispatch }}>
                    <GameModal
                        type={MODAL_TYPES.restart}
                        setShowModal={setShowModal}
                    />
                </GameContext.Provider>
            );

            fireEvent.click(screen.getByRole('button', { name: 'YES, RESTART' }));

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(localStorageMock.getItem(lsBoardState)).toEqual(undefined);
            expect(localStorageMock.getItem(lsCurrentTurnMark)).toBe('X')
            expect(localStorageMock.getItem(lsTurnCount)).toBe('1');
            expect(dispatch).toHaveBeenCalledWith({ type: ACTIONS.resetGame });
            expect(setShowModal).toHaveBeenCalledWith(false);
        });
    });
});