import { useState } from 'react';

export const GameBox = ({ player }) => {
    const [isEmpty, setIsEmpty] = useState(true);
    const [mark, setMark] = useState({
        icon: '',
        player: ''
    });
    
    const handlePlayerClick = () => {
        if (!isEmpty) {
            return;
        }

        setIsEmpty(false);

        const icon = player === 'X'
            ? `${process.env.PUBLIC_URL}/assets/icon-x.svg`
            : `${process.env.PUBLIC_URL}/assets/icon-o.svg`;

        setMark({ 
            icon,
            player
        });
    };

    return (
        <button onClick={ handlePlayerClick }>
            { !isEmpty && <img src={ mark.icon } alt={ mark.player } /> }
        </button>
    );
};
