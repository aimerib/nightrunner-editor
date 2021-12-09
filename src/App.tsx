import React from 'react';
import { TitleBar, SideNav } from './components';
import {
  Rooms,
  Items,
  Subjects,
  Narratives,
  Events,
  Settings,
  Verbs,
} from './pages';

const data = [
  { name: 'Verbs', component: <Verbs /> },
  { name: 'Items', component: <Items /> },
  { name: 'Subjects', component: <Subjects /> },
  { name: 'Narratives', component: <Narratives /> },
  { name: 'Rooms', component: <Rooms /> },
  { name: 'Events', component: <Events /> },
  { name: 'Settings', component: <Settings /> },
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
