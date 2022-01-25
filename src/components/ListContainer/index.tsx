import React, { useRef, useState, useEffect } from 'react';
import list_container from './list_container.module.css';

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
  const [height, set_height] = useState(null);

  useEffect(() => {
    if (listContainerRef.current) {
      set_height(listContainerRef.current.clientHeight);
    }
  }, [listContainerRef]);
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
      className={`grid${className ? ` ${className}` : ''}`}
    >
      <p className="h-auto pb-2 text-xl font-bold">{label}</p>
      <div
        ref={listContainerRef}
        style={{ height: decide_height() }}
        className={`bg-nr-900 ring-inset ring-gray-900 ring-1 nr-input${
          scrollable ? list_container.listscrollable : ''
        } ${small ? list_container.small : ''}`}
      >
        {children ? children : <span>No exits yet</span>}
      </div>
    </div>
  );
};
ListContainer.displayName = 'ListContainer';
export default ListContainer;
