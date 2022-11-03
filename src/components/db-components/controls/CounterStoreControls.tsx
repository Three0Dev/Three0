import React, { useState } from "react";
import { Box, Button, TextField, InputLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useStateValue, actions } from "../../../state/DatabaseState";

export default function CounterStoreControls() {
  const [appState, dispatch] = useStateValue();
  const [value, setValue] = useState(1);

  function handleValueChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setValue(parseInt(event.target.value, 10));
  }

  const addToDB = async () => {
    const { db } = appState;

    if (db.type !== "counter") {
      throw new Error("This component can only handle Counter databases");
    }

    if (value > 0) {
      await db.inc(value);
    }

    const entries = [{ payload: { value: db.value } }];
    dispatch({ type: actions.DB.SET_DB, db, entries });
  };

  function handleAdd(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (event) event.preventDefault();
    if (value === 0) return;
    addToDB();
  }

  return (
    <Box>
      <InputLabel>Number</InputLabel>
      <TextField
        onChange={(e) => handleValueChange(e)}
        type="number"
        name="value"
        value={value}
        placeholder="Value"
      />

      <Button
        onClick={(e) => handleAdd(e)}
        variant="contained"
        sx={{ marginLeft: 2 }}
        startIcon={<AddIcon />}
      >
        Increment
      </Button>
    </Box>
  );
}
