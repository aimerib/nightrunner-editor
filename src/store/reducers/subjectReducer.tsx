import { SUBJECT_ACTION_TYPE } from '../../types';
import { initial_subjects_state } from '../initialStates';
const subject_reducer = (
  old_state: typeof initial_subjects_state,
  action: SUBJECT_ACTION_TYPE
) => {
  switch (action.type) {
    case 'ADD_SUBJECT': {
      const new_subject = {};
      new_subject[action.payload.id] = {
        id: action.payload.id,
        ...action.payload.new_subject,
      };
      return { ...old_state, ...new_subject };
    }
    case 'UPDATE_SUBJECT': {
      const updated_subject = action.payload;
      const subjects = { ...old_state };
      subjects[updated_subject.id] = { ...updated_subject };
      return { ...old_state, ...subjects };
    }
    case 'REMOVE_SUBJECT': {
      const subjects = { ...old_state };
      delete subjects[action.payload];
      return { ...subjects };
    }
    default:
      return old_state;
  }
};
export default subject_reducer;
