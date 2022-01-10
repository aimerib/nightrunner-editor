import React, { useState } from 'react';
import { Button, Input, ListContainer } from '../../components';
import { useFocus } from '../../utils';

export default function Settings() {
  const [name, set_name] = useState('');
  const [intro, set_intro] = useState('');
  const [inputRef, setInputFocus] = useFocus();
  return (
    <div className="flex flex-col w-full h-full gap-5 bg-nr-main text-green-nr">
      <Input
        label="Game Name:"
        name="description"
        autoFocus
        value={name}
        onChange={(e) => set_name(e.target.value)}
        innerRef={inputRef}
      />
      <Input
        label="Game Introduction:"
        name="text"
        multiline
        value={intro}
        onChange={(e) => {
          set_intro(e.target.value);
        }}
      />
      <Button type="button" className="self-center">
        Save Game
      </Button>
    </div>
  );
}
