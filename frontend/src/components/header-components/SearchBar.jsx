import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import '../style.css';
import { usePageContext } from '../../contexts/MainContext';

export function SearchBar() {
    const { dispatch } = usePageContext();
    const [searchValue, setSearchValue] = useState('');
    const [outline, setOutline] = useState('white');

    function toSearch() {
        if(searchValue == '') {
            setOutline('red');
        } else {
            setOutline('white');
            dispatch({ type: 'SET_TITLE_PARAM', payload: searchValue });
        }
    }

    return <div className='search-bar'>
        <input 
            type="text" 
            className='search-bar' 
            value={searchValue} onChange={(e) => {
                setSearchValue(e.target.value);
                setOutline('white');
            }}
            placeholder={outline == 'red' && 'Enter a valid title'}
            style={{boxShadow: `0 0 0 1px ${outline}`}}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    toSearch();
                }
            }}
        />
        <button  style={{marginLeft: '1rem'}} onClick={() => {
            toSearch();
        }}>
            <SearchIcon />
        </button>
    </div>
}