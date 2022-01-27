import {
  VERB_ACTION_TYPE,
  ActionTypes,
  VERB_STATE_TYPE,
  VERB_TYPE,
} from '../../types';
import { initial_verbs_state } from '../initialStates';
const verb_reducer = (old_state: VERB_STATE_TYPE, action: VERB_ACTION_TYPE) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      const new_verb = {
        id: action.payload.id,
        ...action.payload.new_verb,
      };
      return [...old_state, new_verb];
    }
    case ActionTypes.UPDATE: {
      const updated_verb = action.payload;
      const verbs = old_state.filter((verb: VERB_TYPE) => {
        return verb.id !== updated_verb.id;
      });
      return [...verbs, updated_verb];
    }
    case ActionTypes.REMOVE: {
      const verbs = old_state.filter((verb: VERB_TYPE) => {
        return verb.id !== action.payload;
      });
      return [...verbs];
    }
    case ActionTypes.RESET: {
      return initial_verbs_state;
    }
    case ActionTypes.LOAD: {
      return [...action.payload];
    }
    default:
      return old_state;
  }
};
export default verb_reducer;
