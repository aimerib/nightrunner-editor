/*eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Tab({ children, selected, name, handle_selected }) {
  // state
  const [window_height, set_window_height] = useState(0);
  const [window_width, set_window_width] = useState(0);
  const [content_height, set_content_height] = useState(0);

  // setup
  const contentRef = useRef(null);

  // utility functions
  const getWindowSize = () => {
    return {
      height:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
    };
  };

  // component behavior
  window.addEventListener('resize', () => {
    if (window_height !== getWindowSize().height) {
      set_window_height(getWindowSize().height);
    }
    if (window_width !== getWindowSize().width) {
      set_window_width(getWindowSize().width);
    }
  });

  const calculate_content_height = () => {
    const distance_from_top =
      contentRef.current &&
      contentRef.current.parentElement.getBoundingClientRect().top;
    return window_height - distance_from_top - 70;
  };

  useEffect(() => {
    const new_content_height = calculate_content_height();
    set_window_height(getWindowSize().height);
    set_window_width(getWindowSize().width);
    set_content_height(new_content_height);
  }, [window_height, window_width]);

  // layout
  const render_tab_header = () => {
    return (
      <div
        tabIndex={0}
        onClick={() => handle_selected(name)}
        className={`${
          selected
            ? 'bg-nr-800 border-green-nr border-t-2 border-solid'
            : 'bg-nr-700 hover:bg-nr-600 mr-px '
        }
         px-3 py-4 -mb-1 inline-block text-green-nr cursor-pointer font-logo 
         `}
      >
        {name}
      </div>
    );
  };

  const render_tab_content = (tab_children) => {
    const content = (
      <div style={{ height: content_height }} className="p-3 mr-px">
        {tab_children}
      </div>
    );

    return (
      <div
        ref={contentRef}
        className={`${selected ? 'bg-nr-800 absolute left-5' : 'bg-nr-700'}`}
        style={{
          width: selected
            ? window_width - 40
            : contentRef.current
            ? contentRef.current.width
            : 0,
        }}
      >
        {selected ? content : <></>}
      </div>
    );
  };

  // render component
  return (
    <div>
      {/* Tab header  - always visible*/}
      {render_tab_header()}
      {/* Tab content - only visible when tab is selected */}
      {render_tab_content(children)}
    </div>
  );
}

Tab.defaultProps = {
  selected: false,
  handle_selected: () => null,
};

Tab.propTypes = {
  children: PropTypes.element.isRequired,
  selected: PropTypes.bool,
  name: PropTypes.string.isRequired,
  handle_selected: PropTypes.func,
};
