import React from 'react';
import { TitleBar, SideNav } from './components';
import {
  Rooms,
  Items,
  Subjects,
  Narratives,
  Events,
  GameSettings,
} from './pages';

const data = [
  { name: 'Items', component: <Items /> },
  { name: 'Subjects', component: <Subjects /> },
  { name: 'Narratives', component: <Narratives /> },
  { name: 'Rooms', component: <Rooms /> },
  { name: 'Events', component: <Events /> },
  { name: 'Settings', component: <GameSettings /> },
];

function App() {
  return (
    <>
      <TitleBar title="Nightrunner Editor" />
      <SideNav data={data} />
    </>
  );
}

export default App;
