/* eslint-disable max-len */
import { Room } from '@nightrunner/nightrunner_lib';

import { ActionTypes, ROOM_ACTION } from '../../types';
import { initial_rooms_state } from '../initialStates';
const room_reducer = (
  old_state: typeof initial_rooms_state,
  action: ROOM_ACTION
) => {
  switch (action.type) {
    case ActionTypes.ADD: {
      return [...old_state, action.payload.new_room];
    }
    case ActionTypes.UPDATE: {
      const updated_room = action.payload;
      return old_state.map((room: Room) => (room.id === updated_room.id ? { ...room, ...updated_room } : room));
    }
    case ActionTypes.REMOVE: {
      return old_state.filter((room: Room) => room.id !== action.payload);
    }
    case ActionTypes.RESET: {
      return initial_rooms_state;
    }
    case ActionTypes.LOAD: {
      return [...action.payload];
    }
    default:
      return old_state;
  }
};
export default room_reducer;
