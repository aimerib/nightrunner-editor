import { Event } from '@nightrunner/nightrunner_lib';

import { ActionTypes, EVENT_ACTION, } from '../../types';
import { initial_events_state } from '../initialStates';
const event_reducer = (
  old_state: typeof initial_events_state,
  action: EVENT_ACTION
) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      return [...old_state, action.payload.new_event];
    }
    case ActionTypes.UPDATE: {
      const updated_event = action.payload;
      return old_state.map(
        (event: Event) => (event.id === updated_event.id ? { ...event, ...updated_event } : event)
      );
    }
    case ActionTypes.REMOVE: {
      return old_state.filter((event: Event) => event.id !== action.payload);
    }
    case ActionTypes.RESET: {
      return initial_events_state;
    }
    case ActionTypes.LOAD: {
      return [...action.payload];
    }
    default:
      return old_state;
  }
};
export default event_reducer;
