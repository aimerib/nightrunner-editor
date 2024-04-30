import './ListContainer.css';

import React, { useEffect, useRef, useState } from 'react';

type ListContainerProps = {
  /** @param {React.ReactNode} children - Elements to be rendered in the list */
  children: React.ReactNode;
  /** @param {string} label - The label for the list container */
  label: string;
  /** @param {string} className - Extra class names for the list container */
  className?: string | null;
  /** @param {boolean} scrollable - If the list container should allow overflow and scroll */
  scrollable?: boolean;
  /** @param {boolean} small - If the list container should be small */
  small?: boolean;
};

const ListContainer = ({
  children,
  label,
  small,
  className,
  scrollable = false,
}: ListContainerProps): JSX.Element => {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [height, set_height] = useState(0);
  const [children_count, set_children_count] = useState(0);

  useEffect(() => {
    if (listContainerRef.current) {
      set_height(listContainerRef.current.clientHeight);
    }
  }, [listContainerRef]);
  useEffect(() => {
    if (children && Array.isArray(children)) {
      set_children_count(children.length);
    }
  }, [children]);
  const decide_height = (): string => {
    if (small) {
      return `${height}px`;
    } else if (height) {
      return `${height}px`;
    }
    return 'auto';
  };

  return (
    <div
      style={{ gridTemplateRows: 'min-content' }}
      className={`${children_count > 0 ? '' : 'grid'} ${className ? ` ${className}` : ''
        }`}
    >
      <p className="h-auto pb-2 text-xl font-bold">{label}</p>
      <div
        ref={listContainerRef}
        style={{ height: decide_height() }}
        className={`bg-nr-900 ring-inset ring-gray-900 ring-1 nr-input ${scrollable ? 'scrollable' : ''
          } ${small ? 'small' : ''}`}
      >
        {children ? children : <span>No exits yet</span>}
      </div>
    </div>
  );
};
ListContainer.displayName = 'ListContainer';
export default ListContainer;
