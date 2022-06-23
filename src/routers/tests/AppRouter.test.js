import { render, screen } from '@testing-library/react';
import { AppRouter } from '../AppRouter';
import { MemoryRouter } from 'react-router-dom';
import { PlayerCoxtext } from '../../hocs/PlayerContext';

const [player, setPlayer] = ['X', jest.fn()];

describe('Test <AppRouter />', () => { 
    test('should render Game route correctly', () => { 
        const { container } = render(
            <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                <MemoryRouter initialEntries={['/']}>
                    <AppRouter />
                </MemoryRouter>
            </PlayerCoxtext.Provider>
        );

        expect(container).toMatchSnapshot();
        expect(screen.getByLabelText('restart')).toBeInTheDocument();
    });

    test('should render NewGame route correctly', () => { 
        const { container } = render(
            <PlayerCoxtext.Provider value={{ player, setPlayer }}>
                <MemoryRouter initialEntries={['/new-game']}>
                    <AppRouter />
                </MemoryRouter>
            </PlayerCoxtext.Provider>
        );

        expect(container).toMatchSnapshot();
        expect(screen.getByText('REMEMBER : X GOES FIRST')).toBeInTheDocument();
    });   
});