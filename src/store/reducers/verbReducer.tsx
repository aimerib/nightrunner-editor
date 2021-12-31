import { VERB_ACTION_TYPE } from '../../types';
import { initial_verbs_state } from '../initialStates';
const verb_reducer = (
  old_state: typeof initial_verbs_state,
  action: VERB_ACTION_TYPE
) => {
  switch (action.type) {
    case 'ADD_VERB': {
      const new_verb = {};
      new_verb[action.payload.id] = {
        id: action.payload.id,
        ...action.payload.new_verb,
      };
      return { ...old_state, ...new_verb };
    }
    case 'UPDATE_VERB': {
      const updated_verb = action.payload;
      const verbs = { ...old_state };
      verbs[updated_verb.id] = { ...updated_verb };
      return { ...old_state, ...verbs };
    }
    case 'REMOVE_VERB': {
      const verbs = { ...old_state };
      delete verbs[action.payload];
      return { ...verbs };
    }
    case 'RESET_VERBS': {
      return initial_verbs_state;
    }
    default:
      return old_state;
  }
};
export default verb_reducer;
