import { IconButton } from "@chakra-ui/button";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import React, { ReactElement } from "react";

export interface ReservationControlsProps {
  onEdit: () => void;
  onDelete: () => void;
}

function ReservationControls({
  onEdit,
  onDelete,
}: ReservationControlsProps): ReactElement {
  return (
    <Box
      gridArea="controls"
      display="flex"
      justifyContent="flex-end"
      textAlign="right"
    >
      <IconButton
        aria-label="edit reservation"
        variant="unstyled"
        size="sm"
        onClick={onEdit}
        icon={<EditIcon height="1.5em" width="1.5em" />}
      />
      <IconButton
        aria-label="delete reservation"
        variant="unstyled"
        size="sm"
        onClick={onDelete}
        icon={<DeleteIcon height="1.5em" width="1.5em" />}
      />
    </Box>
  );
}

export default ReservationControls;
