import { ROOM_ACTION_TYPE } from '../../types';
import { initial_rooms_state } from '../initialStates';
const room_reducer = (
  old_state: typeof initial_rooms_state,
  action: ROOM_ACTION_TYPE
) => {
  switch (action.type) {
    case 'ADD_ROOM': {
      const new_room = {};
      new_room[action.payload.id] = {
        id: action.payload.id,
        ...action.payload.new_room,
      };
      return { ...old_state, ...new_room };
    }
    case 'UPDATE_ROOM': {
      const updated_room = action.payload;
      const rooms = { ...old_state };
      rooms[updated_room.id] = { ...updated_room };
      return { ...old_state, ...rooms };
    }
    case 'REMOVE_ROOM': {
      const rooms = { ...old_state };
      delete rooms[action.payload];
      return { ...rooms };
    }
    default:
      return old_state;
  }
};
export default room_reducer;
