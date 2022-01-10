import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  RadioButton,
  ListContainer,
  Input,
  Modal,
} from '../../components';
import { store } from '../../store';
import { VERB_TYPE } from '../../types';
import { useFocus } from '../../utils';

export default function Verbs(): JSX.Element {
  // init states
  const [name, set_name] = useState<string>('');
  const [id, set_id] = useState<number>(1);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedRadio, set_selectedRadio] = useState<string>('');
  const [selectedAliasRadio, set_selectedAliasRadio] = useState<string>('');
  const [show_modal, set_show_modal] = useState<boolean>(false);

  const [verb, set_verb] = useState({} as VERB_TYPE);
  const [alias_name, set_alias_name] = useState<string>('');
  const [aliases, set_aliases] = useState<string[]>([]);

  // init verbs state
  const [verbs_state, dispatch_item] = useContext(store).verbs;
  const verbs: VERB_TYPE[] = Object.keys(verbs_state).map((key): VERB_TYPE => {
    return verbs_state[key];
  });
  // holds the new verb object
  const new_verb: VERB_TYPE = { name, aliases };

  useEffect(() => {
    // const verbs: VERB_TYPE[] = Object.keys(verbs_state).map(
    //   (key): VERB_TYPE => {
    //     return verbs_state[key];
    //   }
    // );
    if (verbs.length > 0) {
      set_id(verbs[verbs.length - 1].id + 1);
    }
  }, [verbs_state]);

  const handleChange = (): void => {
    // const verbs: VERB_TYPE[] = Object.keys(verbs_state).map(
    //   (key): VERB_TYPE => {
    //     return verbs_state[key];
    //   }
    // );
    if (
      verbs.find((v) => v.name === name || v.aliases.includes(name)) &&
      !verb.id
    ) {
      set_show_modal(true);
    } else if (verb.id) {
      if (name) {
        dispatch_item({
          type: 'UPDATE_VERB',
          payload: { ...verb, name, aliases },
        });
      }
    } else if (new_verb.name && !verbs.find((v) => v.name === name)) {
      dispatch_item({ type: 'ADD_VERB', payload: { new_verb, id } });
    }
    set_verb({} as VERB_TYPE);
    set_selectedRadio('');
    set_alias_name('');
    set_name('');
    setInputFocus();
    set_aliases([]);
  };

  const handleDelete = (): void => {
    set_aliases([]);
    set_alias_name('');
    set_name('');
    set_selectedRadio('');
    dispatch_item({ type: 'REMOVE_VERB', payload: verb.id });
    setInputFocus();
  };

  const renderVerbs = (): JSX.Element[] => {
    return Object.keys(verbs_state).map((key): JSX.Element => {
      const aliases_string = verbs_state[key].aliases.join(', ');
      return (
        <RadioButton
          key={verbs_state[key].id}
          id={verbs_state[key].name}
          name="verbs"
          value={verbs_state[key].name}
          onChange={() => {
            set_verb(verbs_state[key]);
            set_name(verbs_state[key].name);
            set_aliases(verbs_state[key].aliases);
            set_selectedRadio(verbs_state[key].name);
          }}
          checked={selectedRadio === verbs_state[key].name}
        >
          {verbs_state[key].name} - aliases:&nbsp;&nbsp;{aliases_string}
        </RadioButton>
      );
    });
  };

  const renderAliases = (): React.ReactNode => {
    if (aliases.length > 0) {
      return Object.keys(aliases).map((key): JSX.Element => {
        return (
          <RadioButton
            key={key}
            id={aliases[key]}
            name="verbs"
            value={aliases[key]}
            onChange={() => {
              set_selectedAliasRadio(aliases[key]);
            }}
            checked={selectedAliasRadio === aliases[key]}
          >
            {aliases[key]}
          </RadioButton>
        );
      });
    }
    return <></>;
  };

  const disabled_save = () => {
    if (!name) {
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

  const handle_add_alias = (): void => {
    if (alias_name) {
      if (
        verbs.find(
          (v) => v.aliases.includes(alias_name) || v.name === alias_name
        )
      ) {
        set_show_modal(true);
      } else {
        set_aliases([...aliases, alias_name.toLowerCase()]);
        set_alias_name('');
      }
    }
  };
  const handle_delete_alias = (): void => {
    if (selectedAliasRadio) {
      const new_aliases = aliases.filter(
        (alias) => alias !== selectedAliasRadio
      );
      set_aliases(new_aliases);
      set_alias_name('');
      set_selectedAliasRadio('');
    }
  };

  return (
    <div className="w-full h-full bg-nr-main text-green-nr">
      <div className="grid w-full h-full grid-cols-2">
        {/* left side - content*/}
        <ListContainer label="Existing verbs:">{renderVerbs()}</ListContainer>
        {/* right side - form for adding more verbs */}
        <form
          className="flex flex-col gap-5 pl-3 place-content-center"
          onSubmit={(e) => {
            handleChange();
            e.preventDefault();
          }}
        >
          <Input
            label="Verb:"
            name="name"
            autoFocus
            innerRef={inputRef}
            value={name}
            onChange={(e) => {
              set_name(e.target.value);
            }}
          />
          <div className="h-full">
            <div className="flex items-end justify-between gap-5 py-5">
              <Input
                className="flex-1"
                label="Verb alias:"
                name="alias_name"
                value={alias_name}
                onChange={(e) => {
                  set_alias_name(e.target.value);
                }}
              />
              <Button
                disabled={!alias_name}
                className="text-base justify-self-center"
                type="button"
                onClick={handle_add_alias}
              >
                Add alias
              </Button>
            </div>
            <div className="flex flex-col justify-start gap-5">
              <ListContainer scrollable small label="Existing aliases:">
                {renderAliases()}
              </ListContainer>

              <Button
                disabled={!selectedAliasRadio}
                className="text-base justify-self-center"
                type="button"
                onClick={handle_delete_alias}
              >
                Delete alias
              </Button>
            </div>
          </div>
          <div className="flex justify-around mt-5">
            <Button type="submit" disabled={disabled_save()}>
              Save item
            </Button>
            <Button
              type="button"
              disabled={disabled_delete()}
              onClick={handleDelete}
            >
              Delete item
            </Button>
          </div>
        </form>
      </div>
      <Modal
        show={show_modal}
        handle_close={() => set_show_modal(false)}
        title="Invalid Verb"
      >
        <p>Verb already in use</p>
      </Modal>
    </div>
  );
}
