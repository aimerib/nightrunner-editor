import React, { useState, useContext, useEffect } from 'react';
import { Button, RadioButton, ListContainer, Input } from '../../components';
import { store } from '../../store';
import { NARRATIVE_TYPE } from '../../types';
import { useFocus } from '../../utils';

export default function Narratives() {
  // init states
  const [text, set_text] = useState('');
  const [description, set_description] = useState('');
  const [id, set_id] = useState(2);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedRadio, set_selectedRadio] = useState('');
  const [narrative, set_narrative] = useState({} as NARRATIVE_TYPE);
  const [isLogo, set_isLogo] = useState<boolean>();

  // init narratives state
  const [narratives_state, dispatch_narrative] = useContext(store).narratives;

  // holds the new narrative object
  const new_narrative = { text, description };
  const logoExists =
    Object.keys(narratives_state).filter((key) => {
      return narratives_state[key].description === 'Logo';
    }).length > 0;

  const handleLogo = ({ force = null, focus_input = null } = {}) => {
    if (force === true) {
      set_isLogo(true);
      set_description('Logo');
    } else {
      set_isLogo(false);
    }
    if (focus_input && inputRef.current !== document.activeElement) {
      setInputFocus();
    }
  };

  useEffect(() => {
    if (!logoExists) {
      handleLogo({ force: true, focus_input: true });
    } else if (logoExists && selectedRadio === 'Logo') {
      handleLogo({ force: true });
    } else if (Object.keys(narratives_state).length >= 1) {
      handleLogo({ force: false });
    } else if (
      Object.keys(narratives_state).length === 1 &&
      selectedRadio === 'Logo'
    ) {
      handleLogo({ force: true });
    }
    if (inputRef.current !== document.activeElement && text.length < 1) {
      setInputFocus();
    }
    const narratives = Object.keys(narratives_state).map((key) => {
      return narratives_state[key];
    });
    if (narratives.length > 1 && logoExists) {
      set_id(narratives[narratives.length - 1].id + 1);
    }
  }, [narratives_state, handleLogo]);

  const handleChange = () => {
    if (selectedRadio === 'Logo') {
      handleLogo({ force: false, focus_input: true });
    }
    if (narrative.id && text && description) {
      dispatch_narrative({
        type: 'UPDATE_NARRATIVE',
        payload: { ...narrative, text, description },
      });
    } else if (!logoExists) {
      dispatch_narrative({
        type: 'ADD_NARRATIVE',
        payload: { new_narrative, id: 1 },
      });
    } else if (new_narrative.text && new_narrative.description) {
      dispatch_narrative({
        type: 'ADD_NARRATIVE',
        payload: { new_narrative, id },
      });
    }
    set_narrative({} as NARRATIVE_TYPE);
    set_selectedRadio('');
    set_text('');
    set_description('');
    handleLogo({ force: false, focus_input: true });
  };

  const handleDelete = () => {
    if (narrative.id === 1 || logoExists) {
      handleLogo({ force: true, focus_input: true });
    } else {
      handleLogo({ force: false, focus_input: true });
    }
    set_text('');
    set_description('');
    set_narrative({} as NARRATIVE_TYPE);
    dispatch_narrative({ type: 'REMOVE_NARRATIVE', payload: narrative.id });
    set_selectedRadio('');
  };

  const renderItems = () => {
    return Object.keys(narratives_state).map((key) => {
      return (
        <RadioButton
          key={narratives_state[key].id}
          id={narratives_state[key].description}
          name="narratives"
          value={narratives_state[key].text}
          onChange={() => {
            set_narrative(narratives_state[key]);
            set_text(narratives_state[key].text);
            set_description(narratives_state[key].description);
            set_selectedRadio(narratives_state[key].description);
            setInputFocus();
          }}
          checked={selectedRadio === narratives_state[key].description}
        >
          {narratives_state[key].description} - {narratives_state[key].text}
        </RadioButton>
      );
    });
  };

  const renderInputs = () => {
    if (isLogo) {
      return (
        <>
          <Input
            label="Description - By default the first narrative is the game logo"
            name="description"
            disabled
            value={description}
            onChange={() => null}
          />
          <Input
            label="Logo text:"
            autoFocus
            name="text"
            multiline
            value={text}
            innerRef={inputRef}
            onChange={(e) => {
              set_text(e.target.value);
            }}
          />
        </>
      );
    }
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
          <div className="flex justify-between mt-5">
            <Button type="submit" className="text-2xl">
              Save narrative
            </Button>
            <Button type="button" onClick={handleDelete} className="text-2xl">
              Delete narrative
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
