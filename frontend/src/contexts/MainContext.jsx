import { useReducer, useContext, useEffect, createContext } from 'react';

const initialState = {
    games: [],
    page: 0,
    titleParam: '',
    token: ''
}

function reducer(state, action) {
    switch (action.type) {
        case 'SET_GAMES':
            return { ...state, games: action.payload };
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'SET_TITLE_PARAM':
            return { ...state, titleParam: action.payload, page: 0 };
        case 'SET_TOKEN':
            return { ...state, token: action.payload };
        default:
            return state;
    }
}

const PageContext = createContext()

export function PageProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        async function getGames() {
            //fetch(`http://localhost:3000/games?pageNumber=${state.page}${state.titleParam}`).
            fetch(`http://localhost:3000/games?pageNumber=${state.page}&title=${state.titleParam}`).
                then((res) => res.json()).
                then((res) => {
                    dispatch({ type: 'SET_GAMES', payload: res });
                });
        }
        getGames();

        window.scrollTo(0, 0);

        const savedToken = localStorage.getItem('token');
        if(savedToken) dispatch({ type: 'SET_TOKEN', payload: savedToken});
        
    }, [state.page, state.titleParam]);

    return (
        <PageContext.Provider value={{ state, dispatch }}>
            {children}
        </PageContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePageContext = () => useContext(PageContext);