/* eslint-disable max-len */

import { Event, Item, Narrative, Room, Subject, Verb } from '@nightrunner/nightrunner_lib';
import { Dispatch, SetStateAction } from 'react';


// //#region Exit

// export type EXIT_TYPE = {
//   direction: string;
//   room_id: number;
//   id: number;
// };
// //#endregion

// //#region Event
// export type EVENT_TYPE = {
//   id?: number;
//   name: string;
//   location: number;
//   narrative: number;
//   destination: number;
//   required_verb: number;
//   required_subject: number;
//   required_item:number;
//   add_item: number;
//   remove_old_narrative: boolean;
//   remove_item: number;
//   required_events: number[];
//   description: string;
// };
// export type EVENT_STATE_TYPE = {
//   [key: number]: Event;
// } | Record<string, never>;

export type EVENT_ACTION =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_event: Event;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: Event;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: Event[]};

//#endregion

//#region Verb
// export type VERB_TYPE = {
//   id?: number,
//   names: string[];
//   // name: string;
//   // aliases: string[];
// };
// export type VERB_STATE_TYPE = Verb[] | [];

export type VERB_ACTION =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_verb: Verb;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: Verb;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: Verb[]};

//#endregion

// //#region Room
// export type ROOM_TYPE = {
//   id?: number,
//   name: string;
//   description: string;
//   exits: EXIT_TYPE[];
//   stash: { items?: number[]; item_ids?: number[] };
//   room_events?: number[];
//   narrative: number;
//   subjects?: number[];
// };
// export type ROOMS_STATE_TYPE = Room[] | [];

export type ROOM_ACTION =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_room: Room;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: Room;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: Room[]};
//#endregion

// //#region Narrative
// export type NARRATIVE_TYPE = {
//   id?: number;
//   text: string;
//   description: string;
// };

// export type NARRATIVES_STATE_TYPE = Narrative[] | [];

export type NARRATIVE_ACTION =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_narrative: Narrative;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: Narrative;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: Narrative[]};

//#endregion

// //#region Subject
// export type SUBJECT_TYPE = {
//   id?: number;
//   name: string;
//   description: string;
// };

// export type SUBJECTS_STATE_TYPE = Subject[] | [];

export type SUBJECT_ACTION =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_subject: Subject;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: Subject;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: Subject[]};

//#endregion

//#region Item
export type ITEM_ACTION =
  | {
    type: ActionTypes.ADD;
    payload: {
      id: number;
      new_item: Item;
    };
  }
  | {
    type: ActionTypes.UPDATE;
    payload: Item;
  }
  | {
    type: ActionTypes.REMOVE;
    payload: number;
  }
  | { type: ActionTypes.RESET}
  | { type: ActionTypes.LOAD; payload: Item[]};


// export type ITEM_TYPE = {
//   id?: number,
//   name: string, description: string, can_pick: boolean
// };
// export type ITEMS_STATE_TYPE = Item[]| [];
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
export type GAME_STATE = {
  folder: [string, Dispatch<SetStateAction<string>>];
  name: [string, Dispatch<SetStateAction<string>>];
  intro: [string, Dispatch<SetStateAction<string>>];
  verbs: [Verb[], Dispatch<VERB_ACTION>];
  items: [Item[], Dispatch<ITEM_ACTION>];
  rooms: [Room[], Dispatch<ROOM_ACTION>];
  events: [Event[], Dispatch<EVENT_ACTION>];
  narratives: [Narrative[], Dispatch<NARRATIVE_ACTION>];
  subjects: [Subject[], Dispatch<SUBJECT_ACTION>];
};
//#endregion

export type GAME_SETTINGS = {
  intro: string;
  verbs: Verb[];
  items: Item[];
  rooms: Room[];
  events: Event[];
  narratives: Narrative[];
  subjects: Subject[];
};
//#region Night Runner Context
export type NRContext = {
  gameState: GAME_STATE;
  new_game: () => void;
  load_game: (game_settings: GAME_SETTINGS) => void;
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
