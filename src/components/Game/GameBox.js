import { useEffect, useState } from 'react';
import { ASSETS_PATH } from '../../helpers/constants';

export const GameBox = ({ 
    hasMark,
    mark: cellMark,
    currentPlayer,
    row,
    col,
    updateBoard,
    isGameOver = false,
}) => {
    const [isEmpty, setIsEmpty] = useState(!hasMark);

    const [mark, setMark] = useState({
        icon: hasMark ? `${ASSETS_PATH}/icon-${cellMark.toLowerCase()}.svg` : '',
        player: hasMark ? cellMark : ''
    });

    useEffect(() => {
        if (hasMark === false) {
            setIsEmpty(true);
            setMark({
                icon: '',
                player: ''
            });
        }
    }, [hasMark]);
    
    
    const handlePlayerClick = () => {
        if (!isEmpty || isGameOver) {
            return;
        }

        setIsEmpty(false);

        const icon = `${ASSETS_PATH}/icon-${currentPlayer.toLowerCase()}.svg`;

        setMark({ 
            icon,
            player: currentPlayer
        });

        updateBoard(row, col);
    };

    return (
        <button onClick={ handlePlayerClick }>
            { !isEmpty && <img src={ mark.icon } alt={ mark.player } /> }
        </button>
    );
};
