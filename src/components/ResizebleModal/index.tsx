import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './ResizebleModal.module.scss';

type ResizableModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
};

const ResizableModal = ({
  isOpen,
  onRequestClose,
  children,
}: ResizableModalProps) => {
  const minWidth = 600;
  const minHeight = 600;
  const maxWidth = window.innerWidth - 30;
  const maxHeight = window.innerHeight - 30;

  const [modalWidth, setModalWidth] = useState(minWidth);
  const [modalHeight, setModalHeight] = useState(minHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        setModalWidth((prevWidth) => {
          const newWidth = prevWidth + (e.clientX - mousePosition.x);
          return Math.min(Math.max(newWidth, minWidth), maxWidth);
        });
        setModalHeight((prevHeight) => {
          const newHeight = prevHeight + (e.clientY - mousePosition.y);
          return Math.min(Math.max(newHeight, minHeight), maxHeight);
        });
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, mousePosition, minWidth, minHeight, maxWidth, maxHeight]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(166, 166, 200, 0.2)',
        },
        content: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(166, 166, 200, 0.6)',
          borderRadius: '1rem',
          border: 'none',
          width: `${modalWidth}px`,
          height: `${modalHeight}px`,
          padding: '1rem',
        },
      }}
    >
      {children}
      <div className={styles.resizer} onMouseDown={handleMouseDown}></div>
    </Modal>
  );
};

export default ResizableModal;
