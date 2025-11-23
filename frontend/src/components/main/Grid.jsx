import { usePageContext } from '../../contexts/MainContext';
import { GameCard } from './GameCard';
import '../style.css';

export function Grid() {
    const { state } = usePageContext();

    return <div className='main-content'>
        {state.games.length === 0 && <h2>Fim da visualização...</h2>}
        {state.games.map((game) => (
            <GameCard
                title={game.title} 
                imageUrl={game.imageUrl}
                normalPrice={game.normalPrice}
                salePrice={game.salePrice}
                storeUrl={game.storeUrl}
            />
        ))}
    </div>
}