import React, { useState, useContext, useEffect } from 'react';
import { Button, RadioButton, ListContainer, Input } from '../../components';
import { store } from '../../store';
import { NARRATIVE_TYPE, ActionTypes, ButtonType } from '../../types';
import { useFocus } from '../../utils';

export default function Narratives() {
  // init states
  const [text, set_text] = useState('');
  const [description, set_description] = useState('');
  const [id, set_id] = useState(2);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedRadio, set_selectedRadio] = useState('');
  const [narrative, set_narrative] = useState({} as NARRATIVE_TYPE);

  // init narratives state
  const [narratives_state, dispatch_narrative] =
    useContext(store).gameState.narratives;

  // holds the new narrative object
  const new_narrative = { text, description };

  useEffect(() => {
    if (narratives_state.length > 0) {
      set_id(narratives_state[narratives_state.length - 1].id + 1);
    }
  }, []);

  const handleChange = () => {
    if (narrative.id) {
      if (text && description) {
        dispatch_narrative({
          type: ActionTypes.UPDATE,
          payload: { ...narrative, text, description },
        });
      }
    } else if (new_narrative.text && new_narrative.description) {
      const new_id = id + 1;
      dispatch_narrative({
        type: ActionTypes.ADD,
        payload: { new_narrative, id },
      });
      set_id(new_id);
    }
    set_narrative({} as NARRATIVE_TYPE);
    set_selectedRadio('');
    set_text('');
    set_description('');
    setInputFocus();
  };

  const handleDelete = () => {
    set_text('');
    set_description('');
    set_narrative({} as NARRATIVE_TYPE);
    dispatch_narrative({ type: ActionTypes.REMOVE, payload: narrative.id });
    set_selectedRadio('');
  };

  const renderItems = () => {
    return narratives_state.map((n: NARRATIVE_TYPE) => {
      return (
        <RadioButton
          key={n.id}
          id={n.description}
          name="narratives"
          value={n.text}
          onChange={() => {
            set_narrative(n);
            set_text(n.text);
            set_description(n.description);
            set_selectedRadio(n.description);
            setInputFocus();
          }}
          checked={selectedRadio === n.description}
        >
          {n.description} - {n.text}
        </RadioButton>
      );
    });
  };

  const renderInputs = () => {
    return (
      <>
        <Input
          label="Narrative description:"
          name="description"
          autoFocus
          value={description}
          onChange={(e) => set_description(e.target.value)}
          innerRef={inputRef}
        />
        <Input
          label="Narrative:"
          name="text"
          multiline
          value={text}
          onChange={(e) => {
            set_text(e.target.value);
          }}
        />
      </>
    );
  };

  const disabled_save = () => {
    if (!text || !description) {
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
        <ListContainer label="Existing narratives:">
          {renderItems()}
        </ListContainer>
        {/* right side - form for adding more items */}
        <form
          className="flex flex-col gap-5 pl-3 place-content-center"
          onSubmit={(e) => {
            handleChange();
            e.preventDefault();
          }}
        >
          {renderInputs()}
          <div className="flex justify-around mt-5">
            <Button type={ButtonType.SUBMIT} disabled={disabled_save()}>
              Save narrative
            </Button>
            <Button
              type={ButtonType.BUTTON}
              disabled={disabled_delete()}
              onClick={handleDelete}
            >
              Delete narrative
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
