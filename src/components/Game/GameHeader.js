import { useContext } from 'react';

import { GameContext } from '../../hocs/GameContext';

import { ASSETS_PATH } from '../../helpers/constants';
import { MODAL_TYPES } from '../../types/types';

export const GameHeader = ({ openModal }) => {
    const { gameState: { currentPlayer } } = useContext(GameContext);

    const handleRestart = () => {
        openModal(MODAL_TYPES.restart);
    };

    return (
        <header className='grid grid-cols-3 align-center gap-5 mb-16 tablet:mb-5'>
            <h1 className='sr-only'>Tic tac toe</h1>
            <img src={`${ASSETS_PATH}/logo.svg`} alt='' />
            <section
                className='[ turn ][ flex gap-2.5 box-navy br-1.5 ]'
                data-type='secondary'
            >
                <img src={`${ASSETS_PATH}/icon-turn-${currentPlayer}.svg`} alt={ currentPlayer } />
                <h2 className='fs-3.5 color-silver tablet:fs-4'>TURN</h2>
            </section>
            <button 
                aria-label='restart'
                className='[ button-restart ][ justify-self-end br-1.5 ]'
                data-type='secondary'
                onClick={ handleRestart }
            >
                <svg width='20' height='20' viewBox='0 0 20 20' fill='currentColor' role='presentation' xmlns="http://www.w3.org/2000/svg">
                    <path d='M19.524 0h-1.88a.476.476 0 0 0-.476.499l.159 3.284A9.81 9.81 0 0 0 9.835.317C4.415.317-.004 4.743 0 10.167.004 15.597 4.406 20 9.835 20a9.796 9.796 0 0 0 6.59-2.536.476.476 0 0 0 .019-.692l-1.348-1.349a.476.476 0 0 0-.65-.022 6.976 6.976 0 0 1-9.85-.63 6.987 6.987 0 0 1 .63-9.857 6.976 6.976 0 0 1 10.403 1.348l-4.027-.193a.476.476 0 0 0-.498.476v1.881c0 .263.213.476.476.476h7.944A.476.476 0 0 0 20 8.426V.476A.476.476 0 0 0 19.524 0Z' fill=''/>
                </svg>
            </button>
        </header>
    );
};
