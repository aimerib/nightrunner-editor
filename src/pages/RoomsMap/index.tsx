/* eslint-disable max-statements */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import '@xyflow/react/dist/style.css';
import './rooms.module.css';

import { Directions, Exit, Item, Narrative, Room, Subject } from '@nightrunner/nightrunner_lib';
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, BackgroundVariant, ConnectionMode, Controls, DefaultEdgeOptions, Edge, FitViewOptions, Node, NodeTypes, OnConnect, OnEdgesChange, OnNodesChange, Panel, ReactFlow, updateEdge } from '@xyflow/react';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import {
  AddModal,
  Button,
  Input,
  ListContainer,
  Modal,
  RadioButton,
  SelectList,
} from '../../components';
import { store } from '../../store';
import {
  ActionTypes,
  ButtonType,
} from '../../types';
import { useFocus } from '../../utils';
import ButtonEdge from './ButtonEdge';
import ConnectionLine from './ConnectionLine';
import RoomNode from './RoomNode';
import TopBar from './TopBar';
import EditRoom from './EditRoom';


const nodeTypes: NodeTypes = {
  custom: RoomNode,
};

const edgeTypes = {
  buttonedge: ButtonEdge,
};

export default function Rooms() {
  // init states
  const [description, set_description] = useState('');
  const [exits, set_exits] = useState<Exit[]>([]);
  const [name, set_name] = useState('');
  const [items, set_items] = useState<Item[]>([]);
  const [narrative, set_narrative] = useState<number>(null);
  const [subjects, set_subjects] = useState<Subject[]>([]);
  const [location, set_location] = useState(null);
  const [direction, set_direction] = useState<Directions | ''>('');
  const [showModal, set_showModal] = useState(false);
  const [exits_exist, set_exits_exist] = useState<boolean>(false);
  const [is_first_room, set_is_first_room] = useState<boolean>(null);
  const [selected_exit, set_selected_exit] = useState<Exit>(null);
  const [show_modal, set_show_modal] = useState<boolean>(false);

  const [id, set_id] = useState(1);
  const [inputRef, setInputFocus] = useFocus();
  const [selectedExitRadio, set_selectedExitRadio] = useState(null);
  const [selectedRadio, set_selectedRadio] = useState(null);
  const [room, set_room] = useState({} as Room);

  // init rooms state
  const [rooms_state, dispatch_room] = useContext(store).gameState.rooms;

  const available_items = useContext(store).gameState.items[0];
  const available_narratives = useContext(store).gameState.narratives[0];
  const available_subjects = useContext(store).gameState.subjects[0];

  // holds the new room object
  const new_room: Room = {
    id,
    description,
    exits,
    name,
    stash: { items: [] },
    narrative,
    subjects,
    events: [],
  };
  const directionsOptions = [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
  ];

  useEffect(() => {
    if (exits.length > 0) {
      set_exits_exist(true);
    }
  }, [exits]);

  useEffect(() => {
    if (rooms_state.length < 1) {
      set_is_first_room(true);
    } else {
      set_is_first_room(false);
    }
  }, [id, room]);

  useEffect(() => {
    if (rooms_state.length > 0) {
      set_id(rooms_state[rooms_state.length - 1].id + 1);
    }
  }, []);

  const resetInputs = () => {
    set_description('');
    set_exits([]);
    set_name('');
    set_items([]);
    set_narrative(null);
    set_subjects([]);
    set_room({} as Room);
    set_selectedRadio('');
    setInputFocus();
  };

  const handleChange = () => {
    if (
      rooms_state.find((r: Room) => {
        return r.name === name;
      }) &&
      !room.id
    ) {
      set_show_modal(true);
    } else if (room.id || room.id === 0) {
      if (name && description && narrative) {
        const stash = { items };
        dispatch_room({
          type: ActionTypes.UPDATE,
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
      dispatch_room({ type: ActionTypes.ADD, payload: { new_room, id } });
      set_id(new_id);
      resetInputs();
    }
  };

  const handleDelete = () => {
    dispatch_room({ type: ActionTypes.REMOVE, payload: room.id });
    resetInputs();
  };

  const handle_delete_exit = () => {
    if (selected_exit) {
      const new_exits: Exit[] = exits.filter(
        (e: Exit) => e !== selected_exit
      );
      set_exits(new_exits);
      dispatch_room({
        type: ActionTypes.UPDATE,
        payload: {
          ...room,
          exits: new_exits,
        },
      });
    }
    if (exits.length === 0) {
      set_exits_exist(false);
    }
  };

  const renderRooms = () => {
    return rooms_state.map((r: Room) => {
      return (
        <RadioButton
          key={r.id}
          id={r.name}
          name="rooms"
          disabled={r.name === 'Intro'}
          value={r.name}
          onChange={() => {
            set_description(r.description);
            set_exits(r.exits);
            set_name(r.name);
            set_items(r.stash.items);
            set_narrative(r.narrative);
            set_subjects(r.subjects);
            set_room(r);
            if (exits) {
              set_exits(r.exits);
            }
            set_selectedRadio(r.name);
          }}
          checked={selectedRadio === r.name}
        >
          {r.name} - {r.description}
        </RadioButton>
      );
    });
  };

  const renderExits = (): React.ReactNode => {
    if (exits) {
      return exits.map((e: Exit, idx) => {
        const room_name = rooms_state.find((r: Room) => r.id === e.room_id).name;
        const direction_display = directionsOptions.find(
          (d) => d.value === e.direction
        ).label;
        const exit_display = `${room_name} - ${direction_display}`;
        return (
          <RadioButton
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            id={`${room_name}-e-${idx}`}
            name="exits"
            value={`${room_name}-e-${idx}`}
            onChange={() => {
              set_selected_exit(e);
              set_selectedExitRadio(idx);
            }}
            checked={selectedExitRadio === idx}
          >
            {exit_display}
          </RadioButton>
        );
      });
    }
    return <></>;
  };

  const itemsOptions = available_items.map((i: Item) => {
    return { label: i.name, value: i.id };
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

  const roomsOptions = Object.keys(rooms_state).map(
    (key): { label: string; value: number } => {
      return {
        label: rooms_state[key].name,
        value: rooms_state[key].id,
      };
    }
  );

  const disableSave = () => {
    if (!narrative || !name || !description) {
      return true;
    }
    return false;
  };

  const can_delete = () => {
    if (!selectedRadio) {
      return false;
    }
    return true;
  };

  const find_value_by_id = (array, object_id: number) => {
    const selectOption = array.find((object) => object.value === object_id);
    const value = selectOption ? selectOption : null;
    return value;
  };

  function exitNotUsed(
    exit_location: number,
    room_exits: Exit[]
  ) {
    for (let i = 0; i < room_exits.length; i++) {
      if (room_exits[i].room_id === exit_location) {
        return false;
      }
    }
    return true;
  }

  function directionNotUsed(
    direction_to_check: string,
    room_exits: Exit[]
  ) {
    for (let i = 0; i < room_exits.length; i++) {
      if (room_exits[i].direction === direction_to_check) {
        return false;
      }
    }
    return true;
  }

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showEditRoom, setShowEditRoom] = useState(false);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, type: 'buttonedge' }, eds)),
    [setEdges],
  );

  const onAddRoom = useCallback(() => {
    const newId = id + 1;
    const newNode: Node = {
      id: id.toString(),
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { label: `Room ${id}` },
      origin: [0.5, 0.0],
    };
    setNodes((nds) => [...nds, newNode]);
    set_id(newId);
    setShowEditRoom(true);
  }, [id]);

  const edgeUpdateSuccessful = useRef(true);

  // const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  return (
    <>
      {/* <TopBar onAddRoom={onAddRoom} onRemoveRoom={() => {}} /> */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        connectionMode={ConnectionMode.Loose}
        connectionLineStyle={{ stroke: '#000', strokeWidth: 2 }}
      >
        <Panel position="top-left">
          <Button className="m-2 shadow-nr text-green-nr" onClick={onAddRoom}>Add Room</Button>
        </Panel>
        <Controls showInteractive={false} className="bg-nr-700 text-green-nr" />
      </ReactFlow>
      <EditRoom open={showEditRoom} handleClose={() => setShowEditRoom(false)} />
    </>
  );

  function handle_save_exits() {
    if (location && direction) {
      const exit: Exit = {
        room_id: location,
        direction: direction,
      };
      let new_exits: Exit[];
      if (exits) {
        new_exits = [...exits, exit];
      } else {
        new_exits = [exit];
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
