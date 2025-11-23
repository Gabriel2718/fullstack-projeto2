import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { usePageContext } from '../../contexts/MainContext';
import '../style.css';

export function PageNavigator() {
    const { state, dispatch } = usePageContext();
    
    return <div className="page-navigator">
        <button onClick={() => {
            if(state.page > 0) dispatch({ type: 'SET_PAGE', payload: state.page - 1});
        }}><ArrowBackIosIcon /></button>
        <h2>{state.page+1}</h2>
        <button onClick={() => {
            if(state.games.length == 9) dispatch({ type: 'SET_PAGE', payload: state.page + 1});
        }}><ArrowForwardIosIcon /></button>
    </div>
}