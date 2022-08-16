export const MODAL_TYPES = {
    restart: 'restart',
    tied: 'tied',
    player_won: 'player_won',
    player_lost: 'player_lost',
    player1_won: 'player1_won',
    player2_won: 'player2_won',
};

export const STORAGE = {
    lsBoardState: 'BOARD_STATE',
    lsTurnCount: 'TURN_COUNT',

    lsPlayerMark: 'PLAYER_MARK',
    lsCpuMark: 'CPU_MARK',
    lsP1Mark: 'P1_MARK',
    lsP2Mark: 'P2_MARK',
    lsCurrentTurnMark: 'CURRENT_TURN_MARK',

    lsCpuScore: 'CPU_SCORE',
    lsPlayerScore: 'PLAYER_SCORE',
    lsP1Score: 'P1_SCORE',
    lsP2Score: 'P2_SCORE',
    lsTiedScore: 'TIED_SCORE',
};

export const USER = {
    player: 'player',
    p1: 'p1',
    p2: 'p2,',
    cpu: 'cpu',
};

export const ACTIONS = {
    setChangeTurn: 'setChangeTurn',
    setCurrentPlayer: 'setCurrentPlayer',
    setGameBoard: 'setGameBoard',
    resetGameBoard: 'resetGameBoard',
    setTurnCounter: 'setTurnCounter',
    resetTurnCounter: 'resetTurnCounter',
    setGameOver: 'setGameOver',
    setCpuMoveFirst: 'setCpuMoveFirst',
    resetGame: 'resetGame',
};