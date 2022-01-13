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
  | { type: ActionTypes.RESET};
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
  | { type: ActionTypes.RESET};
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
  | { type: ActionTypes.RESET};
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
  | { type: ActionTypes.RESET};
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
  | { type: ActionTypes.RESET};

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
}
//#endregion
