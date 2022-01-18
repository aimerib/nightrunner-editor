import React, { createContext, useReducer, useState } from 'react';
import {
  room_reducer,
  item_reducer,
  narrative_reducer,
  subject_reducer,
  event_reducer,
  verb_reducer,
} from './reducers';
import {
  initial_items_state,
  initial_rooms_state,
  initial_events_state,
  initial_narratives_state,
  initial_subjects_state,
  initial_verbs_state,
} from '././initialStates';
import {
  // ITEMS_STATE_TYPE,
  // ITEM_ACTION_TYPE,
  // ROOMS_STATE_TYPE,
  // ROOM_ACTION_TYPE,
  // NARRATIVES_STATE_TYPE,
  // NARRATIVE_ACTION_TYPE,
  // SUBJECTS_STATE_TYPE,
  // SUBJECT_ACTION_TYPE,
  // EVENT_STATE_TYPE,
  // EVENT_ACTION_TYPE,
  // VERB_STATE_TYPE,
  // VERB_ACTION_TYPE,
  GAME_STATE_TYPE,
  NRContext,
  ActionTypes,
} from '../types';

// interface NRContext {
//   verbs: [VERB_STATE_TYPE, Dispatch<VERB_ACTION_TYPE>];
//   items: [ITEMS_STATE_TYPE, Dispatch<ITEM_ACTION_TYPE>];
//   rooms: [ROOMS_STATE_TYPE, Dispatch<ROOM_ACTION_TYPE>];
//   events: [EVENT_STATE_TYPE, Dispatch<EVENT_ACTION_TYPE>];
//   narratives: [NARRATIVES_STATE_TYPE, Dispatch<NARRATIVE_ACTION_TYPE>];
//   subjects: [SUBJECTS_STATE_TYPE, Dispatch<SUBJECT_ACTION_TYPE>];
//   new_game: () => void;
//   pages: [number, React.Dispatch<React.SetStateAction<number>>];
//   gameState: Game;
// }

const store = createContext({} as NRContext);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [name, set_name] = useState('');
  const [folder, set_folder] = useState('');
  const [intro, set_intro] = useState('');

  const [verbs_state, dispatch_verb] = useReducer(
    verb_reducer,
    initial_verbs_state
  );

  const [items_state, dispatch_item] = useReducer(
    item_reducer,
    initial_items_state
  );

  const [rooms_state, dispatch_room] = useReducer(
    room_reducer,
    initial_rooms_state
  );

  const [events_state, dispatch_event] = useReducer(
    event_reducer,
    initial_events_state
  );

  const [narratives_state, dispatch_narrative] = useReducer(
    narrative_reducer,
    initial_narratives_state
  );

  const [subjects_state, dispatch_subject] = useReducer(
    subject_reducer,
    initial_subjects_state
  );
  const [currentPage, setCurrentPage] = useState(0);

  const new_game = () => {
    dispatch_verb({
      type: ActionTypes.RESET,
    });
    dispatch_item({
      type: ActionTypes.RESET,
    });
    dispatch_room({
      type: ActionTypes.RESET,
    });
    dispatch_event({
      type: ActionTypes.RESET,
    });
    dispatch_narrative({
      type: ActionTypes.RESET,
    });
    dispatch_subject({
      type: ActionTypes.RESET,
    });
    set_folder('');
    set_intro('');
    set_name('');
    setCurrentPage(0);
  };
  const save_settings = (game_name: string, game_intro: string) => {
    set_name(game_name);
    set_intro(game_intro);
  };

  // const gameState: GAME_STATE_TYPE = {
  //   verbs: [verbs_state, dispatch_verb],
  //   items: [items_state, dispatch_item],
  //   rooms: [rooms_state, dispatch_room],
  //   events: [events_state, dispatch_event],
  //   narratives: [narratives_state, dispatch_narrative],
  //   subjects: [subjects_state, dispatch_subject],
  //   new_game,
  //   pages: [currentPage, setCurrentPage],
  //   folder: [folder, set_folder],
  //   name: [name, set_name],
  //   intro: [intro, set_intro],
  // };
  const gameState: GAME_STATE_TYPE = {
    verbs: [verbs_state, dispatch_verb],
    items: [items_state, dispatch_item],
    rooms: [rooms_state, dispatch_room],
    events: [events_state, dispatch_event],
    narratives: [narratives_state, dispatch_narrative],
    subjects: [subjects_state, dispatch_subject],
    folder: [folder, set_folder],
    name: [name, set_name],
    intro: [intro, set_intro],
  };
  return (
    <Provider
      value={{
        gameState: gameState,
        new_game,
        save_settings,
        pages: [currentPage, setCurrentPage],
      }}
    >
      {children}
    </Provider>
  );
};

export { store, StateProvider };
