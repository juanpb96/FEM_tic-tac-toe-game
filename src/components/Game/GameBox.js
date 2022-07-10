import { useState } from 'react';
import { ASSETS_PATH } from '../../helpers/constants';

export const GameBox = ({ 
    hasMark,
    mark: cellMark,
    currentPlayer,
    row,
    col,
    updateBoard
}) => {
    const [isEmpty, setIsEmpty] = useState(!hasMark);

    const [mark, setMark] = useState({
        icon: hasMark ? `${ASSETS_PATH}/icon-${cellMark.toLowerCase()}.svg` : '',
        player: hasMark ? cellMark : ''
    });
    
    const handlePlayerClick = () => {
        if (!isEmpty) {
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
