import { Modal } from './Modal';
import { usePageContext } from '../../../contexts/MainContext';
import { useState } from 'react';
import { useHeaderSnackbar } from '../HeaderSnackbar';
import '../../style.css';

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

    const { showMessage } = useHeaderSnackbar();

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
                            } else if (res.status == 400) {
                                res.json().
                                    then(body => {

                                        const fieldsWithError = body.errors.reduce((acc, error) => {
                                            acc[error.path] = error.msg;
                                            return acc
                                        }, {})

                                        if (fieldsWithError['title']) {
                                            setTitleInputPlaceholder(fieldsWithError['title']);
                                            setTitleValue('');
                                        } else setTitleInputPlaceholder('Title');

                                        if (fieldsWithError['imageUrl']) {
                                            setImageUrlInputPlaceholder(fieldsWithError['imageUrl']);
                                            setImageUrlValue('');
                                        } else setImageUrlInputPlaceholder('Image URL');

                                        if (fieldsWithError['normalPrice']) {
                                            setNormalPriceInputPlaceholder(fieldsWithError['normalPrice']);
                                            setNormalPriceValue('');
                                        } else setNormalPriceInputPlaceholder('Normal Price');

                                        if (fieldsWithError['salePrice']) {
                                            setSalePriceInputPlaceholder(fieldsWithError['salePrice']);
                                            setSalePriceValue('');
                                        } else setSalePriceInputPlaceholder('Current Price');

                                        if (fieldsWithError['storeUrl']) {
                                            setStoreUrlInputPlaceholder(fieldsWithError['storeUrl']);
                                            setStoreUrlValue('');
                                        } else setStoreUrlInputPlaceholder('Store URL');
                                    })
                            } else if (res.status == 429) {
                                onClose();
                                showMessage('Too many requests');
                            }
                        });
                    }}
                >Add Game</button>
            </div>

        </Modal>
    </>

}