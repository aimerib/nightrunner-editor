import React from 'react';
import PropTypes from 'prop-types';
import styles from './addmodal.module.css';
import Button from '../Button';

const CloseButton = ({ onClose }) => {
  return (
    <div
      className={styles.close_button}
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

export default function AddModal({
  show,
  children,
  handle_save,
  title,
  handle_close,
}) {
  if (show === false) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.title_bar}>
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

AddModal.defaultProps = {
  handle_save: () => null,
  title: '',
};

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
};

AddModal.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  handle_save: PropTypes.func,
  handle_close: PropTypes.func.isRequired,
  title: PropTypes.string,
};
