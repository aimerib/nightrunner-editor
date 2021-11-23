/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  RadioButton,
  ListContainer,
  Input,
  SelectList,
  AddModal,
} from '../../components';
import { store } from '../../store';
import { useFocus } from '../../utils';
import { ROOM_TYPE, Exits, EXIT_TYPE } from '../../types';
import './Rooms.css';

export default function Rooms() {
  // init states
  const [description, set_description] = useState('');
  const [exits, set_exits] = useState<Exits>(null);
  const [name, set_name] = useState('');
  const [item_ids, set_item_ids] = useState([]);
  const [narrative, set_narrative] = useState<number>(null);
  const [subjects, set_subjects] = useState([]);
  const [location, set_location] = useState(null);
  const [direction, set_direction] = useState('');
  const [showModal, set_showModal] = useState(false);
  const [exit_id, set_exit_id] = useState(0);
  const [selected_exit, set_selected_exit] = useState<EXIT_TYPE>(null);

  const [id, set_id] = useState(0);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedExitRadio, set_selectedExitRadio] = useState(null);
  const [selectedRadio, set_selectedRadio] = useState(null);
  const [room, set_room] = useState({} as ROOM_TYPE);

  // init rooms state
  const [rooms_state, dispatch_room] = useContext(store).rooms;

  const available_items = useContext(store).items[0];
  const available_narratives = useContext(store).narratives[0];
  const available_subjects = useContext(store).subjects[0];

  // holds the new room object
  const new_room: ROOM_TYPE = {
    id,
    description,
    exits,
    name,
    stash: { item_ids, items: [] },
    narrative,
    subjects,
    room_events: [],
  };
  const directionsOptions = [
    { value: 'NORTH', label: 'North' },
    { value: 'SOUTH', label: 'South' },
    { value: 'EAST', label: 'East' },
    { value: 'WEST', label: 'West' },
  ];

  const exits_array: { location: number; direction: string; id: number }[] =
    exits
      ? Object.keys(exits).map((key) => {
          return exits[key];
        })
      : [];
  const narratives_array = available_narratives
    ? Object.keys(available_narratives).map((key) => {
        return available_narratives[key];
      })
    : [];
  const rooms_array = rooms_state
    ? Object.keys(rooms_state).map((key) => {
        return rooms_state[key];
      })
    : [];

  useEffect(() => {
    if (exits_array.length > 0) {
      set_exit_id(exits_array[exits_array.length - 1].id + 1);
    }
  }, [exits]);

  const introExists =
    Object.keys(rooms_state).filter((key) => {
      return rooms_state[key].name === 'Intro';
    }).length > 0;

  const handleIntro = () => {
    if (introExists) {
      set_id(rooms_array[rooms_array.length - 1].id + 1);
    } else {
      set_name('Intro');
      set_description('Intro of the game.');
      set_narrative(1);
    }
  };

  useEffect(() => {
    handleIntro();
  }, []);

  const resetInputs = () => {
    set_description('');
    set_exits(null);
    set_name('');
    set_item_ids([]);
    set_narrative(null);
    set_subjects([]);
    set_room({} as ROOM_TYPE);
    set_selectedRadio('');
    setInputFocus();
  };

  const handleChange = () => {
    if (room.id || room.id === 0) {
      if (name && description && narrative) {
        const stash = { item_ids, items: [] };
        dispatch_room({
          type: 'UPDATE_ROOM',
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
      dispatch_room({ type: 'ADD_ROOM', payload: { new_room, id } });
      set_id(new_id);
      resetInputs();
    }
  };

  const handleDelete = () => {
    if (can_delete()) {
      dispatch_room({ type: 'REMOVE_ROOM', payload: room.id });
      resetInputs();
    }
  };

  const handle_delete_exit = () => {
    if (selected_exit) {
      const new_exits: Exits = { ...exits };
      delete new_exits[selected_exit.id];
      set_exits(new_exits);
      dispatch_room({
        type: 'UPDATE_ROOM',
        payload: {
          ...room,
          exits: new_exits,
        },
      });
    }
  };

  const renderRooms = () => {
    return Object.keys(rooms_state).map((key) => {
      return (
        <RadioButton
          key={rooms_state[key].id}
          id={rooms_state[key].name}
          name="rooms"
          disabled={rooms_state[key].name === 'Intro'}
          value={rooms_state[key].name}
          onChange={() => {
            set_description(rooms_state[key].description);
            set_exits(rooms_state[key].exits);
            set_name(rooms_state[key].name);
            set_item_ids(rooms_state[key].stash.item_ids);
            set_narrative(rooms_state[key].narrative);
            set_subjects(rooms_state[key].subjects);
            set_room(rooms_state[key]);
            if (exits) {
              set_exits(rooms_state[key].exits);
            }
            set_selectedRadio(rooms_state[key].name);
          }}
          checked={selectedRadio === rooms_state[key].name}
        >
          {rooms_state[key].name} - {rooms_state[key].description}
        </RadioButton>
      );
    });
  };

  const renderExits = (): React.ReactNode => {
    if (exits) {
      return Object.keys(exits).map((key) => {
        return (
          <RadioButton
            key={exits[key].id}
            id={exits[key].id}
            name="exits"
            value={exits[key].location}
            onChange={() => {
              set_selected_exit(exits[key]);
              set_selectedExitRadio(exits[key].id);
            }}
            checked={selectedExitRadio === exits[key].id}
          >
            {rooms_state[exits[key].location].name} - {exits[key].direction}
          </RadioButton>
        );
      });
    }
    return <></>;
  };

  const itemsOptions = Object.keys(available_items).map((key) => {
    return { label: available_items[key].name, value: available_items[key].id };
  });

  const narrativesOptions = Object.keys(available_narratives).map((key) => {
    return {
      label: available_narratives[key].description,
      value: available_narratives[key].id,
    };
  });
  const subjectsOptions = Object.keys(available_subjects).map((key) => {
    return {
      label: available_subjects[key].name,
      value: available_subjects[key].id,
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
    if (id === 0 && narratives_array.length === 0) {
      return true;
    } else if (
      id === 0 &&
      narratives_array.length > 0 &&
      narratives_array[0].id === 1
    ) {
      return false;
    } else if (!narrative || !name || !description) {
      return true;
    } else if (id !== 0) {
      return false;
    }
    return true;
  };

  const can_delete = () => {
    if (!selectedRadio) {
      return false;
    } else if (selectedRadio === 'Intro') {
      return false;
    } else if (id > 1 && rooms_array.length > 1) {
      return true;
    }
    return true;
  };

  const find_value_by_id = (array, object_id: number) => {
    const selectOption = array.find((object) => object.value === object_id);
    const value = selectOption ? selectOption : null;
    return value;
  };

  const logo_narrative_or_options = () => {
    if (
      narratives_array[0] &&
      narratives_array[0].id === 1 &&
      (room.id === 0 || id === 0)
    ) {
      return find_value_by_id(narrativesOptions, 1);
    }
    return find_value_by_id(narrativesOptions, narrative);
  };

  function exitNotUsed(
    exit_location: number,
    room_exits: { location: number; direction: string; id: number }[]
  ) {
    for (let i = 0; i < room_exits.length; i++) {
      if (room_exits[i].location === exit_location) {
        return false;
      }
    }
    return true;
  }

  function directionNotUsed(
    direction_to_check: string,
    room_exits: { location: number; direction: string; id: number }[]
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
            disabled={id === 0 || room.id === 0}
            innerRef={inputRef}
            value={id === 0 || room.id === 0 ? 'Intro' : name}
            onChange={(e) => {
              set_name(e.target.value);
            }}
          />
          <Input
            label="Room description:"
            name="description"
            disabled={id === 0 || room.id === 0}
            value={
              id === 0 || room.id === 0
                ? 'You need a narrative before saving the first location.'
                : description
            }
            onChange={(e) => set_description(e.target.value)}
          />
          <SelectList
            label="Narrative"
            isDisabled={!!(id === 0 || room.id === 0)}
            options={narrativesOptions}
            value={logo_narrative_or_options()}
            onChange={(e) => set_narrative(available_narratives[e.value].id)}
          />
          <div className="row">
            <div className="col">
              <SelectList
                isMulti
                isDisabled={!!(id === 0 || room.id === 0)}
                label="Items in this location"
                options={itemsOptions}
                value={itemsOptions.filter((e) => {
                  return item_ids.includes(e.value);
                })}
                onChange={(e) => {
                  set_item_ids(e.map((item) => item.value));
                }}
              />
            </div>
            <div className="col">
              <SelectList
                isMulti
                isDisabled={!!(id === 0 || room.id === 0)}
                label="Subjects in this room"
                options={subjectsOptions}
                value={subjectsOptions.filter((e) => {
                  return subjects.includes(e.value);
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
                disabled={!!(id === 0 || room.id === 0)}
                className="text-base justify-self-center"
                type="button"
                onClick={() => set_showModal(true)}
              >
                Add exit
              </Button>
              <Button
                disabled={!!(id === 0 || room.id === 0)}
                className="text-base justify-self-center"
                type="button"
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
                  location !== room.id &&
                  exit_location !== 0 &&
                  exitNotUsed(exit_location, exits_array)
                );
              })}
              value={roomsOptions.filter(({ value }) => {
                return rooms_state[value].id === location;
              })}
              onChange={({ value }: { value: number }) => {
                set_location(value);
              }}
            />
            <SelectList
              label="Exit direction"
              options={directionsOptions.filter(
                ({ label: direction_to_check }) => {
                  return directionNotUsed(direction_to_check, exits_array);
                }
              )}
              value={directionsOptions.filter(
                ({ label }) => direction === label
              )}
              onChange={(e) => set_direction(e.label)}
            />
          </AddModal>
          <div className="flex justify-between mt-5">
            <Button type="submit" disabled={disableSave()}>
              Save room
            </Button>
            <Button
              disabled={!can_delete()}
              type="button"
              onClick={handleDelete}
            >
              Delete room
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  function handle_save_exits() {
    if (location && direction) {
      const exit = {
        location: location,
        direction: direction,
        id: exit_id,
      };
      let new_exits: Exits;
      if (exits) {
        new_exits = { ...exits, [exit_id]: exit };
      } else {
        new_exits = { [exit_id]: exit };
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
