import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "./modal-overlay";
import styles from "./modal.module.css";

function Modal({ title, children, isOpen, onClose }) {
    const modalWindow = document.getElementById("modal-window");

    useEffect(() => {
        function closeOnEsc(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", closeOnEsc);
        }

        return () => {
            document.removeEventListener("keydown", closeOnEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

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
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modal;
