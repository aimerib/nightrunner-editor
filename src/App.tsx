import { useContext } from 'react';

import { SideNav, TitleBar } from './components';
import {
  Events,
  Items,
  Narratives,
  Rooms,
  RoomsMap,
  Settings,
  Subjects,
  Verbs} from './pages';
import { store } from './store';
const data = [
  { name: 'Settings', component: <Settings /> },
  { name: 'Verbs', component: <Verbs /> },
  { name: 'Items', component: <Items /> },
  { name: 'Subjects', component: <Subjects /> },
  { name: 'Narratives', component: <Narratives /> },
  { name: 'Rooms', component: <Rooms /> },
  { name: 'Rooms Map', component: <RoomsMap /> },
  { name: 'Events', component: <Events /> },
];

function App() {
  const [currentPage, setCurrentPage] = useContext(store).pages;
  return (
    <>
      <TitleBar title="Nightrunner Editor" />
      <SideNav
        data={data}
        currPage={currentPage}
        setCurrPage={setCurrentPage}
      />
    </>
  );
}

export default App;
