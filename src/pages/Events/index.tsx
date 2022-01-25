/* eslint-disable no-nested-ternary */
import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  RadioButton,
  ListContainer,
  Input,
  SelectList,
  Checkbox,
} from '../../components';
import { EVENT_TYPE, ActionTypes, ButtonType } from '../../types';
import { store } from '../../store';
import { useFocus } from '../../utils';
import style from './events.module.css';

export default function Events() {
  // init states
  const [name, set_name] = useState('');
  const [location, set_location] = useState(null);
  const [narrative, set_narrative] = useState(null);
  const [destination, set_destination] = useState(null);
  const [required_verb, set_required_verb] = useState(null);
  const [required_subject, set_required_subject] = useState(null);
  const [required_item, set_required_item] = useState(null);
  const [add_item, set_add_item] = useState(null);
  const [remove_old_narrative, set_remove_old_narrative] = useState(false);
  const [remove_item, set_remove_item] = useState(null);
  const [required_events, set_required_events] = useState([]);
  const [description, set_description] = useState('');
  const [previousId, set_id] = useState(0);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedRadio, set_selectedRadio] = useState('');
  const [event, set_event] = useState({} as EVENT_TYPE);

  // init events state
  const [events_state, dispatch_event] = useContext(store).gameState.events;
  const available_items = useContext(store).gameState.items[0];
  const available_narratives = useContext(store).gameState.narratives[0];
  const [available_rooms, dispatch_rooms] = useContext(store).gameState.rooms;
  const available_subjects = useContext(store).gameState.subjects[0];

  // holds the new event object
  const new_event: EVENT_TYPE = {
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
  };

  const events_array = events_state
    ? Object.keys(events_state).map((key) => {
        return events_state[key];
      })
    : [];

  useEffect(() => {
    if (events_array.length > 0) {
      set_id(events_array[events_array.length - 1].id + 1);
    }
  }, []);

  const resetInputs = () => {
    set_event({} as EVENT_TYPE);
    set_name('');
    set_selectedRadio('');
    set_description('');
    set_narrative(null);
    set_location(null);
    set_destination(null);
    set_required_verb(null);
    set_required_subject(null);
    set_required_item(null);
    set_add_item(null);
    set_remove_old_narrative(false);
    set_remove_item(null);
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

        resetInputs();
      }
    } else if (
      new_event.required_verb &&
      new_event.description &&
      new_event.name &&
      new_event.narrative &&
      new_event.location
    ) {
      const room = available_rooms[location];
      const id = previousId + 1;
      dispatch_event({ type: ActionTypes.ADD, payload: { new_event, id } });
      dispatch_rooms({
        type: ActionTypes.UPDATE,
        payload: { ...room, room_events: [...room.room_events, id] },
      });
      set_id(id);
      resetInputs();
    }
  };

  const handleDelete = () => {
    dispatch_event({ type: ActionTypes.REMOVE, payload: event.id });
    resetInputs();
  };

  const renderEvents = () => {
    return Object.keys(events_state).map((key) => {
      return (
        <RadioButton
          key={events_state[key].id}
          id={events_state[key].name}
          name="events"
          value={events_state[key].name}
          onChange={() => {
            set_event(events_state[key]);
            set_name(events_state[key].name);
            set_description(events_state[key].description);
            set_narrative(events_state[key].narrative);
            set_location(events_state[key].location);
            set_destination(events_state[key].destination);
            set_required_verb(events_state[key].required_verb);
            set_required_subject(events_state[key].required_subject);
            set_required_item(events_state[key].required_item);
            set_add_item(events_state[key].add_item);
            set_remove_old_narrative(events_state[key].remove_old_narrative);
            set_remove_item(events_state[key].remove_item);
            set_required_events(events_state[key].required_events);
            set_selectedRadio(events_state[key].name);
          }}
          checked={selectedRadio === events_state[key].name}
        >
          {events_state[key].name} - {events_state[key].description}
        </RadioButton>
      );
    });
  };
  const itemsOptions = Object.keys(available_items).map((key) => {
    return { label: available_items[key].name, value: available_items[key].id };
  });
  const roomsOptions = Object.keys(available_rooms)
    .filter((key) => available_rooms[key].name !== 'Intro')
    .map((key) => {
      return {
        label: available_rooms[key].name,
        value: available_rooms[key].id,
      };
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
  const eventsOptions = Object.keys(events_state).map((key) => {
    return {
      label: events_state[key].name,
      value: events_state[key].id,
    };
  });

  const verbsOptions = [
    { label: 'go', value: 1 },
    { label: 'take', value: 2 },
    { label: 'talk', value: 3 },
  ];

  const find_value_by_id = (array, id) => {
    const selectOption = array.find((object) => object.value === id);
    const value = selectOption ? selectOption : null;
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
            <div className={style.row}>
              <div className={style.col}>
                <SelectList
                  label="Event location"
                  options={roomsOptions}
                  value={find_value_by_id(roomsOptions, location)}
                  onChange={(e) => set_location(available_rooms[e.value].id)}
                />
              </div>
              <div className={style.col}>
                <SelectList
                  label="Required verb"
                  options={verbsOptions}
                  value={find_value_by_id(verbsOptions, required_verb)}
                  onChange={(e) => set_required_verb(e.value)}
                />
              </div>
            </div>
            <div className={style.row}>
              <div className={style.col}>
                <SelectList
                  label="Required item"
                  options={itemsOptions}
                  value={find_value_by_id(itemsOptions, required_item)}
                  onChange={(e) => {
                    set_required_item(available_items[e.value].id);
                  }}
                />
              </div>
              <div className={style.col}>
                <SelectList
                  label="Required subject"
                  options={subjectsOptions}
                  value={find_value_by_id(subjectsOptions, required_subject)}
                  onChange={(e) => {
                    set_required_subject(available_subjects[e.value].id);
                  }}
                />
              </div>
            </div>
            <div className={style.row}>
              <div className={style.col}>
                <SelectList
                  label="Narrative"
                  options={narrativesOptions}
                  value={find_value_by_id(narrativesOptions, narrative)}
                  onChange={(e) => {
                    set_narrative(available_narratives[e.value].id);
                  }}
                />
              </div>
              <div className={style.col}>
                <SelectList
                  label="Destination of event"
                  options={roomsOptions}
                  value={find_value_by_id(roomsOptions, destination)}
                  onChange={(e) => set_location(available_rooms[e.value].id)}
                />
              </div>
            </div>
            <div className={style.row}>
              <div className={style.col}>
                <SelectList
                  label="Add item"
                  options={itemsOptions}
                  value={find_value_by_id(itemsOptions, add_item)}
                  onChange={(e) => set_add_item(available_items[e.value].id)}
                />
              </div>
              <div className={style.col}>
                <SelectList
                  label="Remove item"
                  options={itemsOptions}
                  value={find_value_by_id(itemsOptions, remove_item)}
                  onChange={(e) => set_remove_item(available_items[e.value].id)}
                />
              </div>
            </div>
            <div className={style.row}>
              <div className={style.col}>
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
