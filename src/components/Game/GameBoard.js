import { GameBox } from "./GameBox";

export const GameBoard = () => {
    const board = [0,1,2,3,4,5,6,7,8];

    return (
        <main>
            {
                board.map(box => <GameBox key={box} />)
            }
        </main>
    );
};
