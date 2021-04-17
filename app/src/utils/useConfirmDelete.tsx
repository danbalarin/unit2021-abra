import { ConfirmDelete } from "components/ConfirmDelete";
import { useCallback, useRef } from "react";

interface UseConfirmDeleteProps {
  onDelete: () => void;
}

const useConfirmDelete = ({
  onDelete: onDeleteConfirm,
}: UseConfirmDeleteProps) => {
  const confirmRef = useRef<any>();
  const show = useCallback(() => {
    confirmRef.current.show();
  }, [confirmRef.current]);
  return {
    ConfirmDelete: (
      <ConfirmDelete ref={confirmRef} onConfirm={onDeleteConfirm} />
    ),
    show,
  };
};

export default useConfirmDelete;
