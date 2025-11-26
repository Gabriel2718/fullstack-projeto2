import '../style.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { usePageContext } from '../../contexts/MainContext';

export function HeaderSnackbar() {
    const { state } = usePageContext();

    return <Snackbar
        open={state.headerSnackbar.isOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 2000 }}
    >
        <Alert
            severity={state.headerSnackbar.message.includes('successfuly') ? 'success' : 'error'}
        >{state.headerSnackbar.message}</Alert>
    </Snackbar>
}

export function useHeaderSnackbar() {
    const { dispatch } = usePageContext();

    function showMessage(message) {
        dispatch({ 
            type: 'SET_HEADER_SNACKBAR', 
            payload: {
                isOpen: true,
                message: message
            }
        });
        setTimeout(() => {
            dispatch({
                type: 'SET_HEADER_SNACKBAR',
                payload: { isOpen: false, message: '' }
            });
        }, 3000);
    }
    return { showMessage }
}