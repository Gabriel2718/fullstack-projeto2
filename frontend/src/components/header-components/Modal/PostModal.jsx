import { Modal } from './Modal';
import { usePageContext } from '../../../contexts/MainContext';
import { useState } from 'react';
import '../../style.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export function PostModal({ isOpen, onClose, onPost, onOpenLoginModal }) {
    const { state, dispatch } = usePageContext();

    const [titleValue, setTitleValue] = useState('');
    const [imageUrlValue, setImageUrlValue] = useState('');
    const [normalPriceValue, setNormalPriceValue] = useState('');
    const [salePriceValue, setSalePriceValue] = useState('');
    const [storeUrlValue, setStoreUrlValue] = useState('');

    const [titleInputPlaceholder, setTitleInputPlaceholder] = useState('Title');
    const [imageUrlInputPlaceholder, setImageUrlInputPlaceholder] = useState('Image URL');
    const [normalPriceInputPlaceholder, setNormalPriceInputPlaceholder] = useState('Normal Price');
    const [salePriceInputPlaceholder, setSalePriceInputPlaceholder] = useState('Current Price');
    const [storeUrlInputPlaceholder, setStoreUrlInputPlaceholder] = useState('Store URL');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const showMessage = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
        setTimeout(() => setSnackbarOpen(false), 3000);
    };

    const resetInput = () => {
        setTitleValue('');
        setImageUrlValue('');
        setNormalPriceValue('');
        setSalePriceValue('');
        setStoreUrlValue('');

        setTitleInputPlaceholder('Title');
        setImageUrlInputPlaceholder('Image URL');
        setNormalPriceInputPlaceholder('Normal Price');
        setSalePriceInputPlaceholder('Current Price');
        setStoreUrlInputPlaceholder('Store URL');
    };

    return <>
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Post</h2>
            <div className="modal-fields">
                <input
                    type='text'
                    placeholder={titleInputPlaceholder}
                    value={titleValue}
                    onChange={(e) => {
                        setTitleValue(e.target.value);
                    }}
                    style={{ boxShadow: `0 0 0 1px ${titleInputPlaceholder != 'Title' ? 'red' : 'white'}` }}
                />

                <input
                    type='text'
                    placeholder={imageUrlInputPlaceholder}
                    value={imageUrlValue}
                    onChange={(e) => {
                        setImageUrlValue(e.target.value);
                    }}
                    style={{ boxShadow: `0 0 0 1px ${imageUrlInputPlaceholder != 'Image URL' ? 'red' : 'white'}` }}
                />

                <input
                    type='text'
                    placeholder={normalPriceInputPlaceholder}
                    value={normalPriceValue}
                    onChange={(e) => {
                        setNormalPriceValue(e.target.value);
                    }}
                    style={{ boxShadow: `0 0 0 1px ${normalPriceInputPlaceholder != 'Normal Price' ? 'red' : 'white'}` }}
                />

                <input
                    type='text'
                    placeholder={salePriceInputPlaceholder}
                    value={salePriceValue}
                    onChange={(e) => {
                        setSalePriceValue(e.target.value);
                    }}
                    style={{ boxShadow: `0 0 0 1px ${salePriceInputPlaceholder != 'Current Price' ? 'red' : 'white'}` }}
                />

                <input
                    type='text'
                    placeholder={storeUrlInputPlaceholder}
                    value={storeUrlValue}
                    onChange={(e) => {
                        setStoreUrlValue(e.target.value);
                    }}
                    style={{ boxShadow: `0 0 0 1px ${storeUrlInputPlaceholder != 'Store URL' ? 'red' : 'white'}` }}
                />
            </div>
            <div className="modal-buttons">
                <a onClick={() => {
                    onClose()
                    resetInput();
                }}
                >Cancel</a>
                <button
                    onClick={() => {
                        console.log(state.token);
                        onPost(
                            {
                                data: {
                                    title: titleValue,
                                    imageUrl: imageUrlValue,
                                    normalPrice: normalPriceValue,
                                    salePrice: salePriceValue,
                                    storeUrl: storeUrlValue
                                },
                                token: state.token
                            }
                        ).then((res) => {
                            if (res.status == 200) {
                                onClose();
                                resetInput();
                                dispatch({ type: 'SET_PAGE', payload: 0 });
                                dispatch({ type: 'SET_TITLE_PARAM', payload: '' });
                                showMessage('Game added successfully');
                            } else if (res.status == 401) {
                                onClose();
                                resetInput();
                                localStorage.removeItem('token');
                                dispatch({ type: 'SET_TOKEN', payload: '' });
                                onOpenLoginModal();
                                showMessage('Session expired');
                            } else if (res.status == 409) {
                                res.json().
                                    then(body => {
                                        if (body.description.title.status != 'Ok') {
                                            setTitleInputPlaceholder(body.description.title.description);
                                            setTitleValue('');
                                        } else setTitleInputPlaceholder('Title');

                                        if (body.description.imageUrl.status != 'Ok') {
                                            setImageUrlInputPlaceholder(body.description.imageUrl.description);
                                            setImageUrlValue('');
                                        } else setImageUrlInputPlaceholder('Image URL');

                                        if (body.description.normalPrice.status != 'Ok') {
                                            setNormalPriceInputPlaceholder(body.description.normalPrice.description);
                                            setNormalPriceValue('');
                                        } else setNormalPriceInputPlaceholder('Normal Price');

                                        if (body.description.salePrice.status != 'Ok') {
                                            setSalePriceInputPlaceholder(body.description.salePrice.description);
                                            setSalePriceValue('');
                                        } else setSalePriceInputPlaceholder('Current Price');

                                        if (body.description.storeUrl.status != 'Ok') {
                                            setStoreUrlInputPlaceholder(body.description.storeUrl.description);
                                            setStoreUrlValue('');
                                        } else setStoreUrlInputPlaceholder('Store URL');
                                    })
                            }
                        });
                    }}
                >Add Game</button>
            </div>

        </Modal>
        <Snackbar
            open={snackbarOpen}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ zIndex: 2000 }}
        >
            <Alert
                severity={snackbarMessage == 'Game added successfully' ? 'success' : 'error'}
            >{snackbarMessage}</Alert>
        </Snackbar>
    </>

}