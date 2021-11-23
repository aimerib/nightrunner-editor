import React, { useState } from 'react';
import Logo from './Logo';

const SideNav = ({
  data,
  className,
}: {
  data: { name: string; component: React.ReactNode }[];
  className?: string;
}) => {
  const render_side_nav = () => {
    return (
      <div
        className={`full-height flex flex-col text-green-nr bg-nr-900 ${className}`}
      >
        <div className="self-center px-4 pt-6 pb-10">
          <Logo />
        </div>
        {data.map((page, index) => {
          return (
            <button
              className={`${
                currentPage === index
                  ? 'bg-nr-green text-black cursor-default'
                  : ' hover:bg-nr-600 cursor-pointer text-green-nr'
              }
               px-2 py-4 font-logo text-2xl
               `}
              type="button"
              key={page.name}
              onClick={() => setCurrentPage(index)}
            >
              {page.name}
            </button>
          );
        })}
      </div>
    );
  };
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <div style={{ display: 'flex' }}>
      {render_side_nav()}
      <div className="w-full p-8 full-height bg-nr-800">
        {data[currentPage].component}
      </div>
    </div>
  );
};
export default SideNav;
