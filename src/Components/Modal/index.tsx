import React from "react";
import "./Modal.scss";
import Close from "../../assets/Icons/x.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const overlayRef = React.useRef(null);
  const handleOverlayClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };
  return isOpen ? (
    <div className="modal">
      <div
        className="modal-overlay"
        ref={overlayRef}
        onClick={handleOverlayClick}
      />
      <div className="modal-box">
        <div className="modal-close-btn" onClick={onClose}>
          <img src={Close} alt="" />
        </div>

        <div className="modal-content">{children}</div>
      </div>
    </div>
  ) : null;
};
