import { EVENT_ACTION_TYPE, ActionTypes } from '../../types';
import { initial_events_state } from '../initialStates';
const event_reducer = (
  old_state: typeof initial_events_state,
  action: EVENT_ACTION_TYPE
) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      const new_event = {};
      new_event[action.payload.id] = {
        id: action.payload.id,
        ...action.payload.new_event,
      };
      return { ...old_state, ...new_event };
    }
    case ActionTypes.UPDATE: {
      const updated_event = action.payload;
      const events = { ...old_state };
      events[updated_event.id] = { ...updated_event };
      return { ...old_state, ...events };
    }
    case ActionTypes.REMOVE: {
      const events = { ...old_state };
      delete events[action.payload];
      return { ...events };
    }
    case ActionTypes.RESET: {
      return initial_events_state;
    }
    case ActionTypes.LOAD: {
      return { ...action.payload };
    }
    default:
      return old_state;
  }
};
export default event_reducer;
