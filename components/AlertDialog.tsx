"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { SetStateAction, useState } from "react";

interface Props {
  title: string;
  description?: string;
  confirmText?: string;
  confirmValue?: string;
  alertOpen: boolean;
  setAlertOpen: (value: SetStateAction<boolean>) => void;
  action: () => Promise<void>;
}

export default function AlertDialog({
  title,
  description,
  confirmText,
  confirmValue,
  alertOpen,
  setAlertOpen,
  action,
}: Props) {
  const [confirmationBox, setConfirmationBox] = useState<string>("");

  const handleConfirm = () => {
    action();
    setAlertOpen(false);
  };

  return (
    <Dialog
      open={alertOpen}
      onClose={() => setAlertOpen(true)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      )}
      {confirmText && confirmValue && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmText}
            <TextField
              margin="normal"
              label={confirmValue}
              value={confirmationBox}
              onChange={(e) => setConfirmationBox(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          disabled={
            confirmText && confirmValue && confirmationBox !== confirmValue
              ? true
              : false
          }
          variant="contained"
          color="error"
          onClick={handleConfirm}
        >
          Delete
        </Button>
        <Button onClick={() => setAlertOpen(false)} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
