import { useState } from "react";
import { BurritoSelect } from "./BurritoSelect";
import { Box } from "@mui/material";

export function WrapperNav({ flavor }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
      <BurritoSelect flavor={flavor} />
    </Box>
  );
}
