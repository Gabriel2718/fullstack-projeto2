import '../style.css';
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { usePageContext } from '../../contexts/MainContext';
import { LoginModal } from './Modal/LoginModal';
import { PostModal } from './Modal/PostModal';
import { HeaderSnackbar } from './HeaderSnackbar';
import logo from '../../assets/logo.png';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';

async function _login(name, password) {
    return await fetch(
        `https://localhost:3001/login?name`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password })
        }
    );
}

async function _post({ data, token }) {
    return await fetch(
        'https://localhost:3001/games',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );
}

export function Header() {
    const { state } = usePageContext();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);

    return <div className='header'>

        {state.token.length === 0
            ? <Button
                variant="outlined"
                className="login-button"
                onClick={() => setShowLoginModal(true)}
            >Login</Button>
            : <Button
                variant="outlined"
                className="add-button"
                onClick={() => setShowPostModal(true)}
            ><UploadIcon></UploadIcon></Button>
        }

        <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={_login}
        />

        <PostModal
            isOpen={showPostModal}
            onClose={() => setShowPostModal(false)}
            onPost={_post}
            onOpenLoginModal={() => setShowLoginModal(true)}
        />

        <div className="search-bar">
            <a href="index.html">
                <img src={logo} alt="logo" />
            </a>
            <SearchBar />
        </div>

        <HeaderSnackbar />
    </div>
}