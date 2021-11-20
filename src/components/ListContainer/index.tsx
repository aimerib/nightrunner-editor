import React from 'react';
import { Expand } from '../../utils/expandTypes';
import './ListContainer.css';

type ListContainerProps = Expand<{
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
}>;

const ListContainer = ({
  children,
  label,
  small,
  className,
  scrollable = false,
}: ListContainerProps): JSX.Element => {
  return (
    <div
      style={{ gridTemplateRows: 'min-content' }}
      className={`grid${className ? ` ${className}` : ''}`}
    >
      <p className="h-auto pb-2 text-xl font-bold">{label}</p>
      <div
        className={`h-full bg-nr-900 ring-inset ring-gray-900 ring-1 nr-input${
          scrollable ? ' scrollable' : ''
        } ${small ? 'small' : ''} main_container`}
      >
        {children ? children : <span>No exits yet</span>}
      </div>
    </div>
  );
};
export default ListContainer;
