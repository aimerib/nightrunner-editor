import { ActionTypes, SUBJECT_ACTION_TYPE, SUBJECT_TYPE } from '../../types';
import { initial_subjects_state } from '../initialStates';
const subject_reducer = (
  old_state: typeof initial_subjects_state,
  action: SUBJECT_ACTION_TYPE
) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      const new_subject = {
        id: action.payload.id,
        ...action.payload.new_subject,
      };
      return [...old_state, new_subject];
    }
    case ActionTypes.UPDATE: {
      const updated_subject = action.payload;
      const subjects = old_state.filter((subject: SUBJECT_TYPE) => {
        return subject.id !== updated_subject.id;
      });
      return [...subjects, updated_subject];
    }
    case ActionTypes.REMOVE: {
      const subjects = old_state.filter((subject: SUBJECT_TYPE) => {
        return subject.id !== action.payload;
      });
      return [...subjects];
    }
    case ActionTypes.RESET: {
      return initial_subjects_state;
    }
    case ActionTypes.LOAD: {
      return [...action.payload];
    }
    default:
      return old_state;
  }
};
export default subject_reducer;
