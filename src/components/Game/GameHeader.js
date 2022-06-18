export const GameHeader = () => {
    return (
        <header>
            <h1>Tic tac toe</h1>
            <img src={`${process.env.PUBLIC_URL}/assets/logo.svg`} alt='' />
            <p>TURN</p>
            <button aria-label='restart'>
                <img src={`${process.env.PUBLIC_URL}/assets/icon-restart.svg`} alt='' />
            </button>
        </header>
    );
};
