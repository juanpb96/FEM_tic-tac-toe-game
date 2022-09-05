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

const ScoreBox = ({ bgColor, title, score }) => (
    <section
        aria-label='score'
        className={`[ score ][ flex flex-center flex-col flex-1 ${bgColor} p-3 br-2.5 ]`}
    >
        <h2 className='[ fs-3 fw-medium uppercase tablet:fs-3.5 ]'>{ title }</h2>
        <p className='[ fs-5 fw-bold letter-s tablet:fs-6 tablet:letter-m ]'>{ score }</p>
    </section>
);

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

    const scores = [
        { bgColor: 'bg-light-blue', title: `X (${ labelPlayerX })`, score: labelScoreX },
        { bgColor: 'bg-silver', title: 'TIES', score: tiedScore },
        { bgColor: 'bg-light-yellow', title: `O (${ labelPlayerO })`, score: labelScoreO },
    ];

    return (
        <footer className='[ flex space-between align-center gap-5 ]'>
            {
                scores.map(score => (
                    <ScoreBox
                        key={score.title}
                        {...score} 
                    />
                ))
            }
        </footer>
    );
};
