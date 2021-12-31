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
    type: 'ADD_EVENT';
    payload: {
      id: number;
      new_event: EVENT_TYPE;
    };
  }
  | {
    type: 'UPDATE_EVENT';
    payload: EVENT_TYPE;
  }
  | {
    type: 'REMOVE_EVENT';
    payload: number;
  }
  | { type: 'RESET_EVENTS'}
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
    type: 'ADD_VERB';
    payload: {
      id: number;
      new_verb: VERB_TYPE;
    };
  }
  | {
    type: 'UPDATE_VERB';
    payload: VERB_TYPE;
  }
  | {
    type: 'REMOVE_VERB';
    payload: number;
  }
  | { type: 'RESET_VERBS'};
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
    type: 'ADD_ROOM';
    payload: {
      id: number;
      new_room: ROOM_TYPE;
    };
  }
  | {
    type: 'UPDATE_ROOM';
    payload: ROOM_TYPE;
  }
  | {
    type: 'REMOVE_ROOM';
    payload: number;
  }
  | { type: 'RESET_ROOMS'};
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
    type: 'ADD_NARRATIVE';
    payload: {
      id: number;
      new_narrative: NARRATIVE_TYPE;
    };
  }
  | {
    type: 'UPDATE_NARRATIVE';
    payload: NARRATIVE_TYPE;
  }
  | {
    type: 'REMOVE_NARRATIVE';
    payload: number;
  }
  | { type: 'RESET_NARRATIVES'};
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
    type: 'ADD_SUBJECT';
    payload: {
      id: number;
      new_subject: SUBJECT_TYPE;
    };
  }
  | {
    type: 'UPDATE_SUBJECT';
    payload: SUBJECT_TYPE;
  }
  | {
    type: 'REMOVE_SUBJECT';
    payload: number;
  }
  | { type: 'RESET_SUBJECTS'};
//#endregion

//#region Item
export type ITEM_ACTION_TYPE =
  | {
    type: 'ADD_ITEM';
    payload: {
      id: number;
      new_item: ITEM_TYPE;
    };
  }
  | {
    type: 'UPDATE_ITEM';
    payload: ITEM_TYPE;
  }
  | {
    type: 'REMOVE_ITEM';
    payload: number;
  }
  | { type: 'RESET_ITEMS'};

export type ITEM_TYPE = {
  id?: number,
  name: string, description: string, can_pick: boolean
};
export type ITEMS_STATE_TYPE = {
  [key: number]: ITEM_TYPE;
} | Record<string, never>;
//#endregion
