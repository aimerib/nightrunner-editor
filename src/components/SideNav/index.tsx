import React, { useState } from 'react';
import Logo from './Logo';
interface ISideNav {
  className?: string;
  data: { name: string; component: React.ReactNode }[];
  currPage?: number | null;
  setCurrPage?: (page: number) => void | undefined;
}

const SideNav = ({ data, className, currPage, setCurrPage }: ISideNav) => {
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
                currentPage() === index
                  ? 'bg-nr-green text-black '
                  : ' hover:bg-nr-600 text-green-nr'
              }
               px-2 py-4 font-logo text-2xl
               `}
              type="button"
              key={page.name}
              onClick={() => handleSetCurrentPage(index)}
            >
              {page.name}
            </button>
          );
        })}
      </div>
    );
  };
  const [localCurrentPage, setLocalCurrentPage] = useState(currPage ?? 0);
  const handleSetCurrentPage = (index: number) => {
    if (setCurrPage) {
      setCurrPage(index);
    } else {
      setLocalCurrentPage(index);
    }
  };
  const currentPage = () => {
    if (currPage) {
      return currPage;
    }
    return localCurrentPage;
  };
  return (
    <div style={{ display: 'flex' }}>
      {render_side_nav()}
      <div className="w-full p-8 full-height bg-nr-800">
        {data[currentPage()].component}
      </div>
    </div>
  );
};
export default SideNav;
