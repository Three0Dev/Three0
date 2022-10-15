import React from "react";
import { TextField, Select, InputLabel, FormControl } from "@mui/material";

export default function CreateProjectDialog() {
  return (
    <>
      <FormControl fullWidth sx={{ margin: "2% 0" }}>
        <TextField
          name="name"
          placeholder="Project Name"
          variant="outlined"
          id="project-name"
        />
      </FormControl>
      <FormControl fullWidth sx={{ margin: "2% 0" }}>
        <InputLabel id="blockchain-type">Type:</InputLabel>
        <Select
          native
          variant="outlined"
          label="Type:"
          labelId="blockchain-type"
          id="blockchain-type-selector"
        >
          <option value="NEAR_TESTNET">NEAR Testnet</option>
        </Select>
      </FormControl>
    </>
  );
}
