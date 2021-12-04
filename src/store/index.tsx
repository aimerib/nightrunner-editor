import React, { createContext, Dispatch, useReducer } from 'react';
import {
  room_reducer,
  item_reducer,
  narrative_reducer,
  subject_reducer,
  event_reducer,
} from './reducers';
import {
  initial_items_state,
  initial_rooms_state,
  initial_events_state,
  initial_narratives_state,
  initial_subjects_state,
} from '././initialStates';
import {
  ITEMS_STATE_TYPE,
  ITEM_ACTION_TYPE,
  ROOMS_STATE_TYPE,
  ROOM_ACTION_TYPE,
  NARRATIVES_STATE_TYPE,
  NARRATIVE_ACTION_TYPE,
  SUBJECTS_STATE_TYPE,
  SUBJECT_ACTION_TYPE,
  EVENT_STATE_TYPE,
  EVENT_ACTION_TYPE,
} from '../types';

interface NRContext {
  items: [
    Record<string, unknown> | ITEMS_STATE_TYPE,
    Dispatch<ITEM_ACTION_TYPE>
  ];
  rooms: [ROOMS_STATE_TYPE, Dispatch<ROOM_ACTION_TYPE>];
  events: [EVENT_STATE_TYPE, Dispatch<EVENT_ACTION_TYPE>];
  narratives: [NARRATIVES_STATE_TYPE, Dispatch<NARRATIVE_ACTION_TYPE>];
  subjects: [SUBJECTS_STATE_TYPE, Dispatch<SUBJECT_ACTION_TYPE>];
}

const store = createContext({} as NRContext);
const { Provider } = store;

const StateProvider = ({ children }) => {
  //#region Items reducer
  const [items_state, dispatch_item] = useReducer(
    item_reducer,
    initial_items_state
  );
  //#endregion

  //#region Rooms reducer
  const [rooms_state, dispatch_room] = useReducer(
    room_reducer,
    initial_rooms_state
  );
  //#endregion

  //#region Events reducer
  const [events_state, dispatch_event] = useReducer(
    event_reducer,
    initial_events_state
  );
  //#endregion

  //#region Narratives reducer
  const [narratives_state, dispatch_narrative] = useReducer(
    narrative_reducer,
    initial_narratives_state
  );
  //#endregion

  //#region Subjects reducer
  const [subjects_state, dispatch_subject] = useReducer(
    subject_reducer,
    initial_subjects_state
  );
  //#endregion

  return (
    <Provider
      value={{
        items: [items_state, dispatch_item],
        rooms: [rooms_state, dispatch_room],
        events: [events_state, dispatch_event],
        narratives: [narratives_state, dispatch_narrative],
        subjects: [subjects_state, dispatch_subject],
      }}
    >
      {children}
    </Provider>
  );
};

export { store, StateProvider };
