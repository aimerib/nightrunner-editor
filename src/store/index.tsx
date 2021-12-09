import React, { createContext, Dispatch, useReducer } from 'react';
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
  VERB_STATE_TYPE,
  VERB_ACTION_TYPE,
} from '../types';

interface NRContext {
  verbs: [VERB_STATE_TYPE, Dispatch<VERB_ACTION_TYPE>];
  items: [ITEMS_STATE_TYPE, Dispatch<ITEM_ACTION_TYPE>];
  rooms: [ROOMS_STATE_TYPE, Dispatch<ROOM_ACTION_TYPE>];
  events: [EVENT_STATE_TYPE, Dispatch<EVENT_ACTION_TYPE>];
  narratives: [NARRATIVES_STATE_TYPE, Dispatch<NARRATIVE_ACTION_TYPE>];
  subjects: [SUBJECTS_STATE_TYPE, Dispatch<SUBJECT_ACTION_TYPE>];
}

const store = createContext({} as NRContext);
const { Provider } = store;

const StateProvider = ({ children }) => {
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

  return (
    <Provider
      value={{
        verbs: [verbs_state, dispatch_verb],
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
