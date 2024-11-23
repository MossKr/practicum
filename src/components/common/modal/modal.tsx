import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "./modal-overlay";
import styles from "./modal.module.css";

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ title, children, isOpen, onClose }: ModalProps) {
  const modalWindow = document.getElementById("modal-window");

  useEffect(() => {
    function closeOnEsc(event: KeyboardEvent) {
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

  if (!isOpen || !modalWindow) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal} data-testid="modal">
        <div className={styles.header}>
          {title && <h2 className="text text_type_main-large">{title}</h2>}
          <button className={styles.closeButton} onClick={onClose} data-testid="modal-close-button">
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </>,
    modalWindow
  );
}

export default Modal;
