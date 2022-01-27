import {
  ActionTypes,
  ITEM_ACTION_TYPE,
  ITEMS_STATE_TYPE,
  ITEM_TYPE,
} from '../../types';
import { initial_items_state } from '../initialStates';
const item_reducer = (
  old_state: ITEMS_STATE_TYPE,
  action: ITEM_ACTION_TYPE
) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      const new_item = {
        id: action.payload.id,
        ...action.payload.new_item,
      };
      return [...old_state, new_item];
    }
    case ActionTypes.UPDATE: {
      const updated_item = action.payload;
      const items = old_state.filter((item: ITEM_TYPE) => {
        return item.id !== updated_item.id;
      });
      return [...items, updated_item];
    }
    case ActionTypes.REMOVE: {
      const items = old_state.filter((item: ITEM_TYPE) => {
        return item.id !== action.payload;
      });
      return [...items];
    }
    case ActionTypes.RESET: {
      return initial_items_state;
    }
    case ActionTypes.LOAD: {
      return [...action.payload];
    }
    default:
      return old_state;
  }
};
export default item_reducer;
