import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

export default function ContinueDialogue({onClick}) {
  const [open, setOpen] = React.useState(true);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Wrong Step"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This box is currently at a different step.
            Continue Anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id = "yes" onClick={(event) => onClick(event)} color="primary">
            YES
          </Button>
          <Button id = "no" onClick={(event) => onClick(event)} color="primary" autoFocus>
            NO
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}