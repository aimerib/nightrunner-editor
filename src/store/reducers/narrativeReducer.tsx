import { NARRATIVE_ACTION_TYPE } from '../../types';
import { initial_narratives_state } from '../initialStates';

const narrative_reducer = (
  old_state: typeof initial_narratives_state,
  action: NARRATIVE_ACTION_TYPE
) => {
  switch (action.type) {
    case 'ADD_NARRATIVE': {
      const new_narrative = {};
      new_narrative[action.payload.id] = {
        id: action.payload.id,
        ...action.payload.new_narrative,
      };
      return { ...old_state, ...new_narrative };
    }
    case 'UPDATE_NARRATIVE': {
      const updated_narrative = action.payload;
      const narratives = { ...old_state };
      narratives[updated_narrative.id] = { ...updated_narrative };
      return { ...old_state, ...narratives };
    }
    case 'REMOVE_NARRATIVE': {
      const narratives = { ...old_state };
      delete narratives[action.payload];
      return { ...narratives };
    }
    case 'RESET_NARRATIVES': {
      return initial_narratives_state;
    }
    default:
      return old_state;
  }
};
export default narrative_reducer;
