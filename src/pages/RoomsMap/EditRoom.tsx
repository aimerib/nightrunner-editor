import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Fragment, useState } from 'react';
import Draggable from 'react-draggable';

import { Button, Input, ListContainer, SelectList } from '../../components';
import { ButtonType } from '../../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#39ff14',
          fontFamily: 'LibertyIsland',
          backgroundColor: '#262626',
          marginBottom: '20px',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: '#39ff14',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          margin: '10px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          minWidth: '80vw',
          minHeight: '80vh',
          // transform: 'translateX(80px) !important',
        },
      },
    },
}});

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function EditRoom(
  { open, handleClose }: { open: boolean; handleClose: () => void}
) {
  const [roomName, setRoomName] = useState('');

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Fragment>
        {/* <Button onClick={handleClickOpen}>
          Open draggable dialog
        </Button> */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            New Room
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Input
                label="Room Name"
                name="room-name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <div className="grid w-full h-full grid-cols-2">
                <ListContainer label="Events">
                  <p>Event 1</p>
                </ListContainer>
                <Button className="text-base justify-self-center" onClick={handleClose}>
                  Add Event
                </Button>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className="text-green-nr" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="text-green-nr" onClick={handleClose}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </ThemeProvider>

  );
}
