import React from 'react';
import modal from './modal.module.css';
import Button from '../Button';

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className={modal.close_button}
      onClick={() => onClose()}
      id="titlebar-close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 512.001 512.001"
      >
        <path
          d="M512.001 84.853L427.148 0 256.001 171.147 84.853 0 0 84.853 171.148
        256 0 427.148l84.853 84.853 171.148-171.147 171.147 171.147
        84.853-84.853L340.853 256z"
        />
      </svg>
    </div>
  );
};

export default function Modal({
  show,
  children,
  title,
  handle_close,
}: {
  show: boolean;
  children: React.ReactNode;
  title: string;
  handle_close: () => void;
}): JSX.Element {
  if (show === false) {
    return null;
  }
  return (
    <div className={modal.wrapper}>
      <div className={modal.title_bar}>
        <div className="fixed transform -translate-x-1/2 top-3 left-1/2">
          {title}
        </div>
        <div className="">
          <CloseButton onClose={handle_close} />
        </div>
      </div>
      <div className={modal.modal_content}>{children}</div>
      <div className="flex self-end justify-around mb-5 justify-self-center">
        <Button
          className="self-end mb-5 justify-self-center"
          onClick={handle_close}
        >
          Ok
        </Button>
      </div>
    </div>
  );
}
