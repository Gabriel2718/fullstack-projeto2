import { useState } from 'react';
import { Modal } from './Modal';
import '../../style.css';
import { usePageContext } from '../../../contexts/MainContext';
import { useHeaderSnackbar } from '../HeaderSnackbar';

export function LoginModal({ isOpen, onClose, onLogin }) {
    const { dispatch } = usePageContext();
    const [nameValue, setNameValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [failMessage, setFailMessage] = useState('');

    const { showMessage } = useHeaderSnackbar();

    return <Modal isOpen={isOpen}>
        <h2>Login</h2>
        <div className="modal-fields">
            <input
                type='text'
                placeholder='User Name'
                value={nameValue}
                onChange={(e) => {
                    setNameValue(e.target.value);
                }}
            />
            <input
                type='password'
                placeholder='Password'
                value={passValue}
                onChange={(e) => {
                    setPassValue(e.target.value)
                }}
            />
        </div>
        {failMessage != '' && <p className='fail-message'>{failMessage}</p>}
        <div className="modal-buttons">
            <a onClick={() => {
                onClose();
                setFailMessage('');
                setNameValue('');
                setPassValue('');
            }}>Cancel</a>
            <button
                onClick={() => {
                    onLogin(nameValue, passValue).
                        then(res => {
                            if (res.status == 200) {
                                res.json()
                                    .then(body => {
                                        dispatch({ type: 'SET_TOKEN', payload: body.token });
                                        localStorage.setItem('token', body.token);
                                    });
                                onClose();
                                setFailMessage('');
                                setNameValue('');
                                setPassValue('');
                                showMessage('Loged successfuly');
                            } else {
                                res.json()
                                    .then(body => setFailMessage(body.description)

                                    )


                            }
                        })
                }}
            > Login</button>
        </div>
    </Modal >
}