import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "./modal-overlay";
import styles from "./modal.module.css";

function Modal({ title, onClose, children }) {
    const modalWindow = document.getElementById("modal-window");

    function closeOnEsc(event) {
        if (event.key === "Escape") {
            onClose();
        }
    }

    React.useEffect(() => {
        document.addEventListener("keydown", closeOnEsc);

        return function () {
            document.removeEventListener("keydown", closeOnEsc);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <>
            <ModalOverlay onClose={onClose} />
            <div className={styles.modal}>
                <div className={styles.header}>
                    {title && <h2 className="text text_type_main-large">{title}</h2>}
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon type="primary" />
                    </button>
                </div>
                <div className={styles.modalBody}>{children}</div>
            </div>
        </>,
        modalWindow
    );
}

Modal.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;
