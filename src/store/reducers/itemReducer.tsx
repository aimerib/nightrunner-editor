import { ActionTypes, ITEM_ACTION_TYPE } from '../../types';
import { initial_items_state } from '../initialStates';
const item_reducer = (
  old_state: typeof initial_items_state,
  action: ITEM_ACTION_TYPE
) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      const new_item = {};
      new_item[action.payload.id] = {
        id: action.payload.id,
        ...action.payload.new_item,
      };
      return { ...old_state, ...new_item };
    }
    case ActionTypes.UPDATE: {
      const updated_item = action.payload;
      const items = { ...old_state };
      items[updated_item.id] = { ...updated_item };
      return { ...old_state, ...items };
    }
    case ActionTypes.REMOVE: {
      const items = { ...old_state };
      delete items[action.payload];
      return { ...items };
    }
    case ActionTypes.RESET: {
      return initial_items_state;
    }
    case ActionTypes.LOAD: {
      return { ...action.payload };
    }
    default:
      return old_state;
  }
};
export default item_reducer;
