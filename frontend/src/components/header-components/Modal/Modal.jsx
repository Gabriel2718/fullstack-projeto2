import '../../style.css';

export function Modal({ isOpen, children }) {
    if(!isOpen) return null;

    return <div className="modal">
        <div className="modal-container" onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
}