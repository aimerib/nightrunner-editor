import React from 'react';
import { TabGroup, Tab, TitleBar } from './components';
import {
  Rooms,
  Items,
  Subjects,
  Narratives,
  Events,
  GameSettings,
} from './pages';

function App() {
  return (
    <>
      <TitleBar title="Nightrunner Editor" />
      <TabGroup>
        <Tab name="Items">
          <Items />
        </Tab>
        <Tab name="Subjects">
          <Subjects />
        </Tab>
        <Tab name="Narratives">
          <Narratives />
        </Tab>
        <Tab name="Rooms">
          <Rooms />
        </Tab>
        <Tab name="Events">
          <Events />
        </Tab>
        <Tab name="Game Settings">
          <GameSettings />
        </Tab>
      </TabGroup>
    </>
  );
}

export default App;
