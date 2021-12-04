import React from 'react';
import './AddModal.css';
import Button from '../Button';

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="close_button" onClick={() => onClose()} id="titlebar-close">
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

export default function AddModal({
  show,
  children,
  handle_save,
  title,
  handle_close,
}: {
  show: boolean;
  children: React.ReactNode;
  handle_save: () => void;
  title: string;
  handle_close: () => void;
}): JSX.Element {
  if (show === false) {
    return null;
  }
  return (
    <div className="wrapper">
      <div className="title_bar">
        <div className="fixed top-3 justify-self-center"> {title}</div>
        <div className="">
          <CloseButton onClose={handle_close} />
        </div>
      </div>
      <div className="flex flex-col px-5 pt-10 ">{children}</div>
      <Button
        className="self-end mb-5 justify-self-center"
        onClick={handle_save}
      >
        Add
      </Button>
    </div>
  );
}
