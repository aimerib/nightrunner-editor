import React, { useState, useContext, useEffect } from 'react';
import { Button, RadioButton, ListContainer, Input } from '../../components';
import { store } from '../../store';
import { useFocus } from '../../utils';
import { SUBJECT_TYPE, ActionTypes, ButtonType } from '../../types';

export default function Subjects() {
  // init states
  const [name, set_name] = useState('');
  const [description, set_description] = useState('');
  const [id, set_id] = useState(1);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedRadio, set_selectedRadio] = useState('');
  const [subject, set_subject] = useState({} as SUBJECT_TYPE);

  // init items state
  const [subjects_state, dispatch_subject] =
    useContext(store).gameState.subjects;

  // holds the new item object
  const new_subject: SUBJECT_TYPE = { name, description };

  useEffect(() => {
    if (subjects_state.length > 0) {
      set_id(subjects_state[subjects_state.length - 1].id + 1);
    }
  }, [subjects_state]);

  const handleChange = (): void => {
    if (subject.id) {
      if (name && description) {
        dispatch_subject({
          type: ActionTypes.UPDATE,
          payload: { ...subject, name, description },
        });
      }
    } else if (new_subject.name && new_subject.description) {
      dispatch_subject({ type: ActionTypes.ADD, payload: { new_subject, id } });
    }
    set_subject({} as SUBJECT_TYPE);
    set_selectedRadio('');
    set_description('');
    set_name('');
    setInputFocus();
  };

  const handleDelete = (): void => {
    set_description('');
    set_name('');
    set_selectedRadio('');
    dispatch_subject({ type: ActionTypes.REMOVE, payload: subject.id });
    setInputFocus();
  };

  const renderSubjects = (): JSX.Element[] => {
    return subjects_state.map((s: SUBJECT_TYPE): JSX.Element => {
      return (
        <RadioButton
          key={s.id}
          id={s.name}
          name="subjects"
          value={s.name}
          onChange={() => {
            set_subject(s);
            set_name(s.name);
            set_description(s.description);
            set_selectedRadio(s.name);
          }}
          checked={selectedRadio === s.name}
        >
          {s.name} - {s.description}
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
        <ListContainer scrollable label="Existing subjects:">
          {renderSubjects()}
        </ListContainer>
        {/* right side - form for adding more items */}
        <form
          className="flex flex-col gap-5 pl-3 place-content-center"
          onSubmit={(e) => {
            handleChange();
            e.preventDefault();
          }}
        >
          <Input
            label="Subject name:"
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
            label="Subject description:"
            name="description"
            value={description}
            onChange={(e) => set_description(e.target.value)}
          />
          <div className="flex justify-around mt-5">
            <Button type={ButtonType.SUBMIT} disabled={disabled_save()}>
              Save subject
            </Button>
            <Button
              type={ButtonType.BUTTON}
              disabled={disabled_delete()}
              onClick={handleDelete}
            >
              Delete subject
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
