const EMPTY_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

export const getEmptyBoard = () => EMPTY_BOARD.map(row => row.slice(0));