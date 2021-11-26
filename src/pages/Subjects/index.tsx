import React, { useState, useContext, useEffect } from 'react';
import { Button, RadioButton, ListContainer, Input } from '../../components';
import { store } from '../../store';
import { useFocus } from '../../utils';
import { SUBJECT_TYPE } from '../../types';

export default function Subjects() {
  // init states
  const [name, set_name] = useState('');
  const [description, set_description] = useState('');
  const [id, set_id] = useState(1);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedRadio, set_selectedRadio] = useState('');
  const [subject, set_subject] = useState({} as SUBJECT_TYPE);

  // init items state
  const [subjects_state, dispatch_subject] = useContext(store).subjects;

  // holds the new item object
  const new_subject: SUBJECT_TYPE = { name, description };

  useEffect(() => {
    const subjects = Object.keys(subjects_state).map((key) => {
      return subjects_state[key];
    });
    if (subjects.length > 0) {
      set_id(subjects[subjects.length - 1].id + 1);
    }
  }, [subjects_state]);

  const handleChange = (): void => {
    if (subject.id) {
      if (name && description) {
        dispatch_subject({
          type: 'UPDATE_SUBJECT',
          payload: { ...subject, name, description },
        });
      }
    } else if (new_subject.name && new_subject.description) {
      dispatch_subject({ type: 'ADD_SUBJECT', payload: { new_subject, id } });
    }
    set_subject(null);
    set_selectedRadio('');
    set_description('');
    set_name('');
    setInputFocus();
  };

  const handleDelete = (): void => {
    set_description('');
    set_name('');
    dispatch_subject({ type: 'REMOVE_SUBJECT', payload: subject.id });
    setInputFocus();
  };

  const renderSubjects = (): JSX.Element[] => {
    return Object.keys(subjects_state).map((key): JSX.Element => {
      return (
        <RadioButton
          key={subjects_state[key].id}
          id={subjects_state[key].name}
          name="subjects"
          value={subjects_state[key].name}
          onChange={() => {
            set_subject(subjects_state[key]);
            set_name(subjects_state[key].name);
            set_description(subjects_state[key].description);
            set_selectedRadio(subjects_state[key].name);
          }}
          checked={selectedRadio === subjects_state[key].name}
        >
          {subjects_state[key].name} - {subjects_state[key].description}
        </RadioButton>
      );
    });
  };

  return (
    <div className="w-full h-full bg-nr-main text-green-nr">
      <div className="grid w-full h-full grid-cols-2">
        {/* left side - content*/}
        <ListContainer label="Existing subjects:">
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
            label="Subject description:"
            name="description"
            value={description}
            onChange={(e) => set_description(e.target.value)}
          />
          <div className="flex justify-between mt-5">
            <Button type="submit">Save subject</Button>
            <Button type="button" onClick={handleDelete}>
              Delete subject
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
