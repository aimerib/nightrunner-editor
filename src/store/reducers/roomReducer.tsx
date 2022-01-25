import { ActionTypes, ROOM_ACTION_TYPE } from '../../types';
import { initial_rooms_state } from '../initialStates';
const room_reducer = (
  old_state: typeof initial_rooms_state,
  action: ROOM_ACTION_TYPE
) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      const new_room = {};
      new_room[action.payload.id] = {
        id: action.payload.id,
        ...action.payload.new_room,
      };
      return { ...old_state, ...new_room };
    }
    case ActionTypes.UPDATE: {
      const updated_room = action.payload;
      const rooms = { ...old_state };
      rooms[updated_room.id] = { ...updated_room };
      return { ...old_state, ...rooms };
    }
    case ActionTypes.REMOVE: {
      const rooms = { ...old_state };
      delete rooms[action.payload];
      return { ...rooms };
    }
    case ActionTypes.RESET: {
      return initial_rooms_state;
    }
    case ActionTypes.LOAD: {
      return { ...action.payload };
    }
    default:
      return old_state;
  }
};
export default room_reducer;
