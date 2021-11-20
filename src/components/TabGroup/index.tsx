import React, { useState } from 'react';

export default function TabGroup({
  children,
  className,
}: {
  children: JSX.Element[];
  className?: string;
}) {
  const [selected_tab, set_selected_tab] = useState(0);
  const handle_selected_tab = (tab) => {
    const selected = children.map((c) => c.props.name).indexOf(tab);
    set_selected_tab(selected);
  };
  const num_of_tabs = children.length;
  return (
    <div
      className={`grid grid-cols-nr${num_of_tabs} p-5 -ml-px${
        className ? ` ${className}` : ''
      }`}
    >
      {children.map((child) => {
        return React.cloneElement(child, {
          key: child.props.name,
          selected: children[selected_tab].props.name === child.props.name,
          handle_selected: handle_selected_tab,
        });
      })}
    </div>
  );
}
