import { Dispatch, SetStateAction } from 'react';

//#region Exit
export type Exits = {
  [id: number]: EXIT_TYPE;
};

export type EXIT_TYPE = {
  direction: string;
  location: number;
  id: number;
};
//#endregion

//#region Event
export type EVENT_TYPE = {
  id?: number;
  name: string;
  location: number;
  narrative: number;
  destination: number;
  required_verb: number;
  required_subject: number;
  required_item:number;
  add_item: number;
  remove_old_narrative: boolean;
  remove_item: number;
  required_events: number[];
  description: string;
};
export type EVENT_STATE_TYPE = {
  [key: number]: EVENT_TYPE;
} | Record<string, never>;

export type EVENT_ACTION_TYPE =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_event: EVENT_TYPE;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: EVENT_TYPE;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: EVENT_STATE_TYPE};

//#endregion

//#region Verb
export type VERB_TYPE = {
  id?: number,
  name: string;
  aliases: string[];
};
export type VERB_STATE_TYPE = {
  [key: number]: VERB_TYPE;
} | Record<string, never>;

export type VERB_ACTION_TYPE =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_verb: VERB_TYPE;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: VERB_TYPE;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: VERB_STATE_TYPE};

//#endregion

//#region Room
export type ROOM_TYPE = {
  id?: number,
  name: string;
  description: string;
  exits: Exits;
  stash: { items?: number[]; item_ids?: number[] };
  room_events?: number[];
  narrative: number;
  subjects?: number[];
};
export type ROOMS_STATE_TYPE = {
  [key: number]: ROOM_TYPE;
} | Record<string, never>;

export type ROOM_ACTION_TYPE =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_room: ROOM_TYPE;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: ROOM_TYPE;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: ROOMS_STATE_TYPE};
//#endregion

//#region Narrative
export type NARRATIVE_TYPE = {
  id?: number;
  text: string;
  description: string;
};

export type NARRATIVES_STATE_TYPE = {
  [key: number]: NARRATIVE_TYPE;
} | Record<string, never>;

export type NARRATIVE_ACTION_TYPE =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_narrative: NARRATIVE_TYPE;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: NARRATIVE_TYPE;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: NARRATIVES_STATE_TYPE};

//#endregion

//#region Subject
export type SUBJECT_TYPE = {
  id?: number;
  name: string;
  description: string;
};

export type SUBJECTS_STATE_TYPE = {
  [key: number]: SUBJECT_TYPE;
} | Record<string, never>;

export type SUBJECT_ACTION_TYPE =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_subject: SUBJECT_TYPE;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: SUBJECT_TYPE;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: SUBJECTS_STATE_TYPE};

//#endregion

//#region Item
export type ITEM_ACTION_TYPE =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_item: ITEM_TYPE;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: ITEM_TYPE;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: ITEMS_STATE_TYPE};


export type ITEM_TYPE = {
  id?: number,
  name: string, description: string, can_pick: boolean
};
export type ITEMS_STATE_TYPE = {
  [key: number]: ITEM_TYPE;
} | Record<string, never>;
//#endregion

//#region ActionTypes
export enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
  RESET = 'RESET',
  LOAD = 'LOAD',
}
//#endregion

//#region GameState
export type GAME_STATE_TYPE = {
  folder: [string, Dispatch<SetStateAction<string>>];
  name: [string, Dispatch<SetStateAction<string>>];
  intro: [string, Dispatch<SetStateAction<string>>];
  verbs: [VERB_STATE_TYPE, Dispatch<VERB_ACTION_TYPE>];
  items: [ITEMS_STATE_TYPE, Dispatch<ITEM_ACTION_TYPE>];
  rooms: [ROOMS_STATE_TYPE, Dispatch<ROOM_ACTION_TYPE>];
  events: [EVENT_STATE_TYPE, Dispatch<EVENT_ACTION_TYPE>];
  narratives: [NARRATIVES_STATE_TYPE, Dispatch<NARRATIVE_ACTION_TYPE>];
  subjects: [SUBJECTS_STATE_TYPE, Dispatch<SUBJECT_ACTION_TYPE>];
};
//#endregion

export type GAME_SETTINGS_TYPE = {
  intro: string;
  verbs: VERB_STATE_TYPE;
  items: ITEMS_STATE_TYPE;
  rooms: ROOMS_STATE_TYPE;
  events: EVENT_STATE_TYPE;
  narratives: NARRATIVES_STATE_TYPE;
  subjects: SUBJECTS_STATE_TYPE;
};
//#region Night Runner Context
export type NRContext = {
  gameState: GAME_STATE_TYPE;
  new_game: () => void;
  load_game: (game_settings: GAME_SETTINGS_TYPE) => void;
  save_settings: (game_name: string, game_intro: string) => void;
  pages: [number, Dispatch<SetStateAction<number>>];
}
//#endregion

//#region ButtonType
export enum ButtonType {
  SUBMIT = 'submit',
  BUTTON = 'button',
}
//#endregion
