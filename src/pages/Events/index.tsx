/* eslint-disable no-nested-ternary */
import './Events.css';

import {
Event, Item, Narrative, Room, Subject, Verb
} from '@nightrunner/nightrunner_lib';
import { useContext, useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  Input,
  ListContainer,
  RadioButton,
  SelectList,
} from '../../components';
import { store } from '../../store';
import {
  ActionTypes,
  ButtonType,
  ROOM_ACTION,
} from '../../types';
import { useFocus } from '../../utils';

export default function Events() {
  // init states
  const [name, set_name] = useState('');
  const [location, set_location] = useState(1);
  const [narrative, set_narrative] = useState<number | undefined>(undefined);
  const [destination, set_destination] = useState<number | undefined>(undefined);
  const [required_verb, set_required_verb] = useState<number | undefined>(undefined);
  const [required_subject, set_required_subject] = useState<number | undefined>(undefined);
  const [required_item, set_required_item] = useState<number | undefined>(undefined);
  const [add_item, set_add_item] = useState(undefined);
  const [remove_old_narrative, set_remove_old_narrative] = useState(false);
  const [remove_item, set_remove_item] = useState(undefined);
  const [required_events, set_required_events] = useState([]);
  const [description, set_description] = useState('');
  const [previousId, set_id] = useState(0);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedRadio, set_selectedRadio] = useState('');
  const [event, set_event] = useState({} as Event);

  // init events state
  const [events_state, dispatch_event] = useContext(store).gameState.events;
  const available_items = useContext(store).gameState.items[0];
  const available_narratives = useContext(store).gameState.narratives[0];
  const available_verbs = useContext(store).gameState.verbs[0];
  const [available_rooms, dispatch_rooms] = useContext(store).gameState.rooms;
  const available_subjects = useContext(store).gameState.subjects[0];

  // holds the new event object
  const new_event: Event = {
    id: previousId,
    name,
    location: location,
    narrative: narrative,
    completed: false,
    narrative_after: undefined,
    add_subject: undefined,
    move_subject_to_location: undefined,
    destination,
    required_verb: required_verb,
    required_subject: required_subject,
    required_item: required_item,
    add_item: add_item,
    remove_old_narrative,
    remove_item: remove_item,
    required_events,
    description,
  };

  // const events_array = events_state
  //   ? Object.keys(events_state).map((key: string) => {
  //       return events_state[key];
  //     })
  //   : [];

  useEffect(() => {
    if (events_state.length > 0) {
      set_id(events_state[events_state.length - 1].id + 1);
    }
  }, []);

  const resetInputs = () => {
    set_event({} as Event);
    set_name('');
    set_selectedRadio('');
    set_description('');
    set_narrative(undefined);
    set_location(1);
    set_destination(undefined);
    set_required_verb(undefined);
    set_required_subject(undefined);
    set_required_item(undefined);
    set_add_item(undefined);
    set_remove_old_narrative(false);
    set_remove_item(undefined);
    set_required_events([]);
    setInputFocus();
  };

  const handleChange = () => {
    if (event.id) {
      if (name && description && narrative && required_verb && location) {
        dispatch_event({
          type: ActionTypes.UPDATE,
          payload: {
            ...event,
            name,
            location,
            narrative,
            destination,
            required_verb,
            required_subject,
            required_item,
            add_item,
            remove_old_narrative,
            remove_item,
            required_events,
            description,
          },
        });
        const room: Room = available_rooms[location];
        dispatch_rooms({
          type: ActionTypes.UPDATE,
          payload: {
            ...room,
            events: [...room.events, event].filter(
              //de-dupe events
              (e, index, self) => self.indexOf(e) === index
            ),
          } as Room,
        } as ROOM_ACTION);
        resetInputs();
      }
    } else if (
      new_event.required_verb &&
      new_event.description &&
      new_event.name &&
      new_event.narrative &&
      new_event.location
    ) {
      const room = available_rooms.find((r) => r.id === location) as Room;
      const id = previousId + 1;
      dispatch_event({ type: ActionTypes.ADD, payload: { new_event, id } });
      dispatch_rooms({
        type: ActionTypes.UPDATE,
        payload: {
          ...room,
          events: [...room.events, new_event].filter(
            //de-dupe events
            (e, index, self) => self.indexOf(e) === index
          ),
        },
      });
      set_id(id);
      resetInputs();
    }
  };

  const handleDelete = () => {
    const room = available_rooms[location];
    room.events = room.events.filter((e) => e.id !== event.id);

    dispatch_event({ type: ActionTypes.REMOVE, payload: event.id });
    dispatch_rooms({ type: ActionTypes.UPDATE, payload: room });
    resetInputs();
  };

  const renderEvents = () => {
    return events_state.map((e) => {
      return (
        <RadioButton
          key={e.id}
          id={e.name}
          name="events"
          value={e.name}
          onChange={() => {
            set_event(e);
            set_name(e.name);
            set_description(e.description);
            set_narrative(e.narrative);
            set_location(e.location);
            set_destination(e.destination);
            set_required_verb(e.required_verb);
            set_required_subject(e.required_subject);
            set_required_item(e.required_item);
            set_add_item(e.add_item);
            set_remove_old_narrative(e.remove_old_narrative);
            set_remove_item(e.remove_item);
            set_required_events(e.required_events);
            set_selectedRadio(e.name);
          }}
          checked={selectedRadio === e.name}
        >
          {e.name} - {e.description}
        </RadioButton>
      );
    });
  };
  const itemsOptions = available_items.map((i: Item) => {
    return { label: i.name, value: i.id };
  });
  const roomsOptions = available_rooms
    .filter((room) => room.name !== 'Intro')
    .map((room) => {
      return {
        label: room.name,
        value: room.id,
      };
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
  const eventsOptions = events_state.map((e) => {
    return {
      label: e.name,
      value: e.id,
    };
  });

  const verbsOptions = available_verbs.map((v: Verb) => {
    return {
      label: v.names[0],
      value: v.id,
    };
  });

  const find_value_by_id = (array: {
    label: string, value: number
  }[], id: number): { label: string, value: number } | undefined => {
    const selectOption = array.find((object) => object.value === id);
    const value = selectOption ? selectOption : undefined;
    return value;
  };

  const disabled_save = () => {
    if (!narrative || !name || !description || !location || !required_verb) {
      return true;
    }
    return false;
  };

  const disabled_delete = () => {
    if (selectedRadio) {
      return false;
    }
    return true;
  };

  return (
    <div className="w-full h-full bg-nr-main text-green-nr">
      <div className="grid w-full h-full grid-cols-2">
        {/* left side - content*/}
        <ListContainer label="Existing events:">{renderEvents()}</ListContainer>
        {/* right side - form for adding more events */}
        <form
          className="flex flex-col gap-5 pl-3 place-content-center"
          onSubmit={(e) => {
            handleChange();
            e.preventDefault();
          }}
        >
          <div className="grid h-full">
            <Input
              label="Event name:"
              name="name"
              autoFocus
              innerRef={inputRef}
              value={name}
              onChange={(e) => {
                set_name(e.target.value);
              }}
            />
            <Input
              label="Event description:"
              name="description"
              value={description}
              onChange={(e) => set_description(e.target.value)}
            />
            <div className="row">
              <div className="col">
                <SelectList
                  label="Event location"
                  options={roomsOptions}
                  value={find_value_by_id(roomsOptions, location)}
                  onChange={(e) => {
                    const room: Room = available_rooms[location];
                    dispatch_rooms({
                      type: ActionTypes.UPDATE,
                      payload: {
                        ...room,
                        room_events: room.events.filter(
                          //de-dupe events
                          (ev) => ev.location !== location
                        ),
                      } as Room,
                    } as ROOM_ACTION);
                    set_location(available_rooms[e.value].id);
                  }}
                />
              </div>
              <div className="col">
                <SelectList
                  label="Required verb"
                  options={verbsOptions}
                  value={find_value_by_id(verbsOptions, required_verb)}
                  onChange={(e: { value: number, label: string }) => set_required_verb(e.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <SelectList
                  label="Required item"
                  options={itemsOptions}
                  value={find_value_by_id(itemsOptions, required_item)}
                  onChange={(e) => {
                    set_required_item(
                      available_items.find((i: Item) => i.id === e.value)
                        .id
                    );
                  }}
                />
              </div>
              <div className="col">
                <SelectList
                  label="Required subject"
                  options={subjectsOptions}
                  value={find_value_by_id(subjectsOptions, required_subject)}
                  onChange={(e) => {
                    set_required_subject(
                      available_subjects.find(
                        (s: SUBJECT_TYPE) => s.id === e.value
                      ).id
                    );
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <SelectList
                  label="Narrative"
                  options={narrativesOptions}
                  value={find_value_by_id(narrativesOptions, narrative)}
                  onChange={(e) => {
                    set_narrative(
                      available_narratives.find(
                        (n: NARRATIVE_TYPE) => n.id === e.value
                      ).id
                    );
                  }}
                />
              </div>
              <div className="col">
                <SelectList
                  label="Destination of event"
                  options={roomsOptions}
                  value={find_value_by_id(roomsOptions, destination)}
                  onChange={(e) => set_location(available_rooms[e.value].id)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <SelectList
                  label="Add item"
                  options={itemsOptions}
                  value={find_value_by_id(itemsOptions, add_item)}
                  onChange={(e) => {
                    set_add_item(
                      available_items.find((i: ITEM_TYPE) => i.id === e.value)
                        .id
                    );
                  }}
                />
              </div>
              <div className="col">
                <SelectList
                  label="Remove item"
                  options={itemsOptions}
                  value={find_value_by_id(itemsOptions, remove_item)}
                  onChange={(e) => {
                    set_remove_item(
                      available_items.find((i: ITEM_TYPE) => i.id === e.value)
                        .id
                    );
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <SelectList
                  label="Required events"
                  isMulti
                  options={eventsOptions}
                  value={eventsOptions.filter((e) => {
                    return required_events.includes(e.value);
                  })}
                  onChange={(e) => {
                    set_required_events(
                      e.map((event_object) => event_object.value)
                    );
                  }}
                />
              </div>
              <div className="self-center col">
                <Checkbox
                  className="flex self-center text-xl justify-self-center justify-items-center"
                  label="Remove previous narrative"
                  checked={remove_old_narrative}
                  onClick={() => {
                    return remove_old_narrative
                      ? set_remove_old_narrative(false)
                      : set_remove_old_narrative(true);
                  }}
                />
              </div>
            </div>
            <div className="flex self-end justify-around mt-5">
              <Button type={ButtonType.SUBMIT} disabled={disabled_save()}>
                Save event
              </Button>
              <Button
                type={ButtonType.BUTTON}
                disabled={disabled_delete()}
                onClick={handleDelete}
              >
                Delete event
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
