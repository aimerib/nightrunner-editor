import {
  ActionTypes,
  NARRATIVE_ACTION_TYPE,
  NARRATIVE_TYPE,
} from '../../types';
import { initial_narratives_state } from '../initialStates';

const narrative_reducer = (
  old_state: typeof initial_narratives_state,
  action: NARRATIVE_ACTION_TYPE
) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      const new_narrative = {
        id: action.payload.id,
        ...action.payload.new_narrative,
      };
      return [...old_state, new_narrative];
    }
    case ActionTypes.UPDATE: {
      const updated_narrative = action.payload;
      const narratives = old_state.filter((narrative: NARRATIVE_TYPE) => {
        return narrative.id !== updated_narrative.id;
      });
      return [...narratives, updated_narrative];
    }
    case ActionTypes.REMOVE: {
      const narratives = old_state.filter((narrative: NARRATIVE_TYPE) => {
        return narrative.id !== action.payload;
      });
      return [...narratives];
    }
    case ActionTypes.RESET: {
      return initial_narratives_state;
    }
    case ActionTypes.LOAD: {
      return [...action.payload];
    }
    default:
      return old_state;
  }
};
export default narrative_reducer;
