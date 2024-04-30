/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, { useState, useContext, useEffect } from 'react';
import { Room, Exit, Narrative, Subject, Item, Directions } from '@nightrunner/nightrunner_lib';
import {
  Button,
  RadioButton,
  ListContainer,
  Input,
  SelectList,
  AddModal,
  Modal,
} from '../../components';
import { store } from '../../store';
import { useFocus } from '../../utils';
import {
  ActionTypes,
  ButtonType,
} from '../../types';
import style from './rooms.module.css';

export default function Rooms() {
  // init states
  const [description, set_description] = useState('');
  const [exits, set_exits] = useState<Exit[]>([]);
  const [name, set_name] = useState('');
  const [items, set_items] = useState<Item[]>([]);
  const [narrative, set_narrative] = useState<number>(null);
  const [subjects, set_subjects] = useState<Subject[]>([]);
  const [location, set_location] = useState(null);
  const [direction, set_direction] = useState<Directions | ''>('');
  const [showModal, set_showModal] = useState(false);
  // const [exit_id, set_exit_id] = useState(0);
  const [exits_exist, set_exits_exist] = useState<boolean>(false);
  const [is_first_room, set_is_first_room] = useState<boolean>(null);
  const [selected_exit, set_selected_exit] = useState<Exit>(null);
  const [show_modal, set_show_modal] = useState<boolean>(false);

  const [id, set_id] = useState(1);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedExitRadio, set_selectedExitRadio] = useState(null);
  const [selectedRadio, set_selectedRadio] = useState(null);
  const [room, set_room] = useState({} as Room);

  // init rooms state
  const [rooms_state, dispatch_room] = useContext(store).gameState.rooms;

  const available_items = useContext(store).gameState.items[0];
  const available_narratives = useContext(store).gameState.narratives[0];
  const available_subjects = useContext(store).gameState.subjects[0];

  // holds the new room object
  const new_room: Room = {
    id,
    description,
    exits,
    name,
    stash: { items: [] },
    narrative,
    subjects,
    events: [],
  };
  const directionsOptions = [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
  ];

  const rooms_array: Room[] = rooms_state
    ? Object.keys(rooms_state).map((key) => {
        return rooms_state[key];
      })
    : [];

  useEffect(() => {
    if (exits.length > 0) {
      // set_exit_id(exits[exits.length - 1].id + 1);
      set_exits_exist(true);
    }
  }, [exits]);

  useEffect(() => {
    if (rooms_array.length < 1) {
      set_is_first_room(true);
    } else {
      set_is_first_room(false);
    }
  }, [id, room]);

  useEffect(() => {
    if (rooms_array.length > 0) {
      set_id(rooms_array[rooms_array.length - 1].id + 1);
    }
  }, []);

  const resetInputs = () => {
    set_description('');
    set_exits([]);
    set_name('');
    set_items([]);
    set_narrative(null);
    set_subjects([]);
    set_room({} as Room);
    set_selectedRadio('');
    setInputFocus();
  };

  const handleChange = () => {
    if (
      rooms_array.find((r: Room) => {
        return r.name === name;
      }) &&
      !room.id
    ) {
      set_show_modal(true);
    } else if (room.id || room.id === 0) {
      if (name && description && narrative) {
        const stash = { items };
        dispatch_room({
          type: ActionTypes.UPDATE,
          payload: {
            ...room,
            description,
            exits,
            name,
            stash,
            narrative,
            subjects,
          },
        });
        resetInputs();
      }
    } else if (new_room.name && new_room.description && new_room.narrative) {
      const new_id = id + 1;
      dispatch_room({ type: ActionTypes.ADD, payload: { new_room, id } });
      set_id(new_id);
      resetInputs();
    }
  };

  const handleDelete = () => {
    dispatch_room({ type: ActionTypes.REMOVE, payload: room.id });
    resetInputs();
  };

  const handle_delete_exit = () => {
    if (selected_exit) {
      const new_exits: Exit[] = exits.filter(
        (e: Exit) => e !== selected_exit
      );
      set_exits(new_exits);
      dispatch_room({
        type: ActionTypes.UPDATE,
        payload: {
          ...room,
          exits: new_exits,
        },
      });
    }
    if (exits.length === 0) {
      set_exits_exist(false);
    }
  };

  const renderRooms = () => {
    return rooms_state.map((r: Room) => {
      return (
        <RadioButton
          key={r.id}
          id={r.name}
          name="rooms"
          disabled={r.name === 'Intro'}
          value={r.name}
          onChange={() => {
            set_description(r.description);
            set_exits(r.exits);
            set_name(r.name);
            set_items(r.stash.items);
            set_narrative(r.narrative);
            set_subjects(r.subjects);
            set_room(r);
            if (exits) {
              set_exits(r.exits);
            }
            set_selectedRadio(r.name);
          }}
          checked={selectedRadio === r.name}
        >
          {r.name} - {r.description}
        </RadioButton>
      );
    });
  };

  const renderExits = (): React.ReactNode => {
    if (exits) {
      return exits.map((e: Exit, idx) => {
        const room_name = rooms_state.find((r: Room) => r.id === e.room_id).name;
        const direction_display = directionsOptions.find(
          (d) => d.value === e.direction
        ).label;
        const exit_display = `${room_name} - ${direction_display}`;
        return (
          <RadioButton
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            id={`${room_name}-e-${idx}`}
            name="exits"
            value={`${room_name}-e-${idx}`}
            onChange={() => {
              set_selected_exit(e);
              set_selectedExitRadio(idx);
            }}
            checked={selectedExitRadio === idx}
          >
            {exit_display}
          </RadioButton>
        );
      });
    }
    return <></>;
  };

  const itemsOptions = available_items.map((i: Item) => {
    return { label: i.name, value: i.id };
  });

  const narrativesOptions = available_narratives.map((n: Narrative) => {
    return {
      label: n.description,
      value: n.id,
    };
  });
  const subjectsOptions = available_subjects.map((s: Subject) => {
    return {
      label: s.name,
      value: s.id,
    };
  });

  const roomsOptions = Object.keys(rooms_state).map(
    (key): { label: string; value: number } => {
      return {
        label: rooms_state[key].name,
        value: rooms_state[key].id,
      };
    }
  );

  const disableSave = () => {
    if (!narrative || !name || !description) {
      return true;
    }
    return false;
  };

  const can_delete = () => {
    if (!selectedRadio) {
      return false;
    }
    return true;
  };

  const find_value_by_id = (array, object_id: number) => {
    const selectOption = array.find((object) => object.value === object_id);
    const value = selectOption ? selectOption : null;
    return value;
  };

  function exitNotUsed(
    exit_location: number,
    room_exits: Exit[]
  ) {
    for (let i = 0; i < room_exits.length; i++) {
      if (room_exits[i].room_id === exit_location) {
        return false;
      }
    }
    return true;
  }

  function directionNotUsed(
    direction_to_check: string,
    room_exits: Exit[]
  ) {
    for (let i = 0; i < room_exits.length; i++) {
      if (room_exits[i].direction === direction_to_check) {
        return false;
      }
    }
    return true;
  }

  return (
    <div className="w-full h-full bg-nr-main text-green-nr">
      <div className="grid h-full grid-cols-2">
        {/* left side - content*/}
        <ListContainer label="Existing rooms:">{renderRooms()}</ListContainer>
        {/* right side - form for adding more rooms */}
        <form
          className="flex flex-col gap-5 pl-3 place-content-center"
          onSubmit={(e) => {
            handleChange();
            e.preventDefault();
          }}
        >
          <Input
            label="Room name:"
            name="name"
            autoFocus
            innerRef={inputRef}
            value={name}
            onChange={(e) => {
              set_name(e.target.value);
            }}
          />
          <Input
            label="Room description:"
            name="description"
            value={description}
            onChange={(e) => set_description(e.target.value)}
          />
          <SelectList
            label="Narrative"
            options={narrativesOptions}
            value={find_value_by_id(narrativesOptions, narrative)}
            onChange={(e) => {
              set_narrative(
                available_narratives.find(
                  (n: Narrative) => n.id === e.value
                ).id
              );
            }}
          />
          <div className={style.row}>
            <div className={style.col}>
              <SelectList
                isMulti
                label="Items in this location"
                options={itemsOptions}
                value={itemsOptions.filter((e) => {
                  return items.map((i) => i.id).includes(e.value);
                })}
                onChange={(e) => {
                  set_items(e);
                }}
              />
            </div>
            <div className={style.col}>
              <SelectList
                isMulti
                label="Subjects in this room"
                options={subjectsOptions}
                value={subjectsOptions.filter((e) => {
                  return subjects.map((s) => s.name).includes(e.label);
                })}
                onChange={(e) => {
                  set_subjects(e.map((subject) => subject.value));
                }}
              />
            </div>
          </div>
          <div className="h-full">
            <ListContainer scrollable small label="Room exits:">
              {renderExits()}
            </ListContainer>
            <div className="flex justify-between pt-5">
              <Button
                disabled={is_first_room}
                className="text-base justify-self-center"
                type={ButtonType.BUTTON}
                onClick={() => set_showModal(true)}
              >
                Add exit
              </Button>
              <Button
                disabled={!exits_exist}
                className="text-base justify-self-center"
                type={ButtonType.BUTTON}
                onClick={handle_delete_exit}
              >
                Delete exit
              </Button>
            </div>
          </div>
          <AddModal
            show={showModal}
            title="Add exits"
            handle_save={handle_save_exits}
            handle_close={handle_close_modal}
          >
            <SelectList
              label="To location"
              options={roomsOptions.filter(({ value: exit_location }) => {
                return (
                  exit_location !== room.id &&
                  exitNotUsed(exit_location, exits)
                );
              })}
              value={roomsOptions.filter(({ value }) => {
                return rooms_state.find((r: Room) => r.id === value).id === location;
              })}
              onChange={({ value }: { value: number }) => {
                set_location(value);
              }}
            />
            <SelectList
              label="Exit direction"
              options={directionsOptions.filter(
                ({ label: direction_to_check }) => {
                  return directionNotUsed(direction_to_check, exits);
                }
              )}
              value={directionsOptions.filter(
                ({ value }) => direction === value
              )}
              onChange={(e) => set_direction(e.value)}
            />
          </AddModal>
          <div className="flex justify-around mt-5">
            <Button type={ButtonType.SUBMIT} disabled={disableSave()}>
              Save room
            </Button>
            <Button
              disabled={!can_delete()}
              type={ButtonType.BUTTON}
              onClick={handleDelete}
            >
              Delete room
            </Button>
          </div>
        </form>
      </div>
      <Modal
        show={show_modal}
        handle_close={() => set_show_modal(false)}
        title="Invalid Room"
      >
        <p>Room already in use</p>
      </Modal>
    </div>
  );

  function handle_save_exits() {
    if (location && direction) {
      const exit: Exit = {
        room_id: location,
        direction: direction,
      };
      let new_exits: Exit[];
      if (exits) {
        new_exits = [...exits, exit];
      } else {
        new_exits = [exit];
      }
      set_exits(new_exits);
      set_showModal(false);
      set_location(null);
      set_direction(null);
    }
  }

  function handle_close_modal() {
    set_showModal(false);
    set_location(null);
    set_direction(null);
  }
}

Rooms.displayName = 'Rooms';
