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
    <div className="App">
      <TitleBar title="Nightrunner Editor" />
      <TabGroup className="">
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
    </div>
  );
}

export default App;
