import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  RadioButton,
  ListContainer,
  Input,
  Checkbox,
} from '../../components';
import { store } from '../../store';
import { ITEM_TYPE, ActionTypes, ButtonType } from '../../types';
import { useFocus } from '../../utils';

export default function Items(): JSX.Element {
  // init states
  const [name, set_name] = useState<string>('');
  const [description, set_description] = useState<string>('');
  const [can_pick, set_can_pick] = useState<boolean>(false);
  const [id, set_id] = useState<number>(1);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedRadio, set_selectedRadio] = useState<string>('');
  const [item, set_item] = useState({} as ITEM_TYPE);

  // init items state
  const [items_state, dispatch_item] = useContext(store).gameState.items;

  // holds the new item object
  const new_item: ITEM_TYPE = { name, description, can_pick };

  useEffect(() => {
    // const items: ITEM_TYPE[] = Object.keys(items_state).map(
    //   (key): ITEM_TYPE => {
    //     return items_state[key];
    //   }
    // );
    if (items_state.length > 0) {
      set_id(items_state[items_state.length - 1].id + 1);
    }
  }, [items_state]);

  const handleChange = (): void => {
    if (item.id) {
      if (name && description) {
        dispatch_item({
          type: ActionTypes.UPDATE,
          payload: { ...item, name, description, can_pick },
        });
      }
    } else if (new_item.name && new_item.description) {
      dispatch_item({ type: ActionTypes.ADD, payload: { new_item, id } });
    }
    set_item({} as ITEM_TYPE);
    set_selectedRadio('');
    set_description('');
    set_name('');
    setInputFocus();
    set_can_pick(false);
  };

  const handleDelete = (): void => {
    set_can_pick(false);
    set_description('');
    set_name('');
    set_selectedRadio('');
    dispatch_item({ type: ActionTypes.REMOVE, payload: item.id });
    setInputFocus();
  };

  const renderItems = (): JSX.Element[] => {
    return items_state.map((i: ITEM_TYPE): JSX.Element => {
      return (
        <RadioButton
          key={i.id}
          id={i.name}
          name="items"
          value={i.name}
          onChange={() => {
            set_item(i);
            set_name(i.name);
            set_can_pick(i.can_pick);
            set_description(i.description);
            set_selectedRadio(i.name);
          }}
          checked={selectedRadio === i.name}
        >
          {i.name} - {i.description}
        </RadioButton>
      );
    });
  };

  const disabled_save = () => {
    if (!name || !description) {
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
        <ListContainer label="Existing items:">{renderItems()}</ListContainer>
        {/* right side - form for adding more items */}
        <form
          className="flex flex-col gap-5 pl-3 place-content-center"
          onSubmit={(e) => {
            handleChange();
            e.preventDefault();
          }}
        >
          <Input
            label="Item name:"
            name="name"
            autoFocus
            innerRef={inputRef}
            value={name}
            onChange={(e) => {
              set_name(e.target.value);
            }}
          />
          <Input
            multiline
            label="Item description:"
            name="description"
            value={description}
            onChange={(e) => set_description(e.target.value)}
          />
          <Checkbox
            label="Item can be picked up"
            name="can_be_picked"
            value="can_be_picked"
            checked={can_pick}
            onClick={() => set_can_pick(!can_pick)}
          />
          <div className="flex justify-around mt-5">
            <Button type={ButtonType.SUBMIT} disabled={disabled_save()}>
              Save item
            </Button>
            <Button
              type={ButtonType.BUTTON}
              disabled={disabled_delete()}
              onClick={handleDelete}
            >
              Delete item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
