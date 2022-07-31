import { STORAGE } from '../../types/types';

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

export const GameFooter = () => {
    const cpuMark = localStorage.getItem(lsCpuMark);
    const cpuScore = localStorage.getItem(lsCpuScore);
    const p1Mark = localStorage.getItem(cpuMark ? lsPlayerMark : lsP1Mark);
    const p1Score = localStorage.getItem(cpuMark ? lsPlayerScore : lsP1Score);
    const p2Mark = localStorage.getItem(lsP2Mark);
    const p2Score = localStorage.getItem(lsP2Score);
    const tiedScore = localStorage.getItem(lsTiedScore);

    let labelPlayerX = '';
    let labelPlayerO = '';
    let labelScoreX = 0;
    let labelScoreO = 0;
    
    switch ('X') {
        case cpuMark:
            labelPlayerX = 'CPU';
            labelPlayerO = 'YOU';
            labelScoreX = cpuScore;
            labelScoreO = p1Score;
            break;
        case p1Mark:
            labelPlayerX = cpuMark ? 'YOU' : 'P1';
            labelPlayerO = cpuMark ? 'CPU' : 'P2';
            labelScoreX = p1Score;
            labelScoreO = cpuScore;
            break;
        case p2Mark:
            labelPlayerX = 'P2';
            labelPlayerO = 'P1';
            labelScoreX = p2Score;
            labelScoreO = p1Score;
            break;
        default:
            break;
    }

    return (
        <footer>
            <section aria-label='score'>
                <h2>X { `(${labelPlayerX})` }</h2>
                <p>{ labelScoreX }</p>
            </section>
            <section aria-label='score'>
                <h2>TIES</h2>
                <p>{ tiedScore }</p>
            </section>
            <section aria-label='score'>
                <h2>O {`(${labelPlayerO})`}</h2>
                <p>{ labelScoreO }</p>
            </section>
        </footer>
    );
};
