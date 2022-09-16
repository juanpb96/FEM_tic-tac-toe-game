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
                className='[ turn ][ flex gap-2.5 box-navy br-1.5 tablet:br-2.5 ]'
                data-type='secondary'
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={currentPlayer}>
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d={
                            currentPlayer === 'X'
                            ? "M19.7231 3.30608L16.6939 0.276913C16.3247 -0.0923043 15.7261 -0.0923043 15.3569 0.276913L10 5.63378L4.64314 0.276913C4.27392 -0.0923043 3.6753 -0.0923043 3.30608 0.276913L0.276913 3.30608C-0.0923043 3.6753 -0.0923043 4.27392 0.276913 4.64314L5.63378 10L0.276913 15.3569C-0.0923043 15.7261 -0.0923043 16.3247 0.276913 16.6939L3.30608 19.7231C3.6753 20.0923 4.27392 20.0923 4.64314 19.7231L10 14.3662L15.3569 19.7231C15.7261 20.0923 16.3247 20.0923 16.6939 19.7231L19.7231 16.6939C20.0923 16.3247 20.0923 15.7261 19.7231 15.3569L14.3662 10L19.7231 4.64314C20.0923 4.27392 20.0923 3.6753 19.7231 3.30608Z"
                            : "M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM5.92593 10C5.92593 7.74995 7.74995 5.92593 10 5.92593C12.25 5.92593 14.0741 7.74995 14.0741 10C14.0741 12.25 12.25 14.0741 10 14.0741C7.74995 14.0741 5.92593 12.25 5.92593 10Z"
                        }
                        fill="#A8BFC9"
                    />
                </svg>
                <h2 className='fs-3.5 color-silver tablet:fs-4'>TURN</h2>
            </section>
            <button 
                aria-label='restart'
                className='[ button-restart ][ justify-self-end br-1.5 tablet:br-2.5 ]'
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
