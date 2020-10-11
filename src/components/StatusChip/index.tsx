import React from "react";
import Chip from "@material-ui/core/Chip";
import { useConfirm } from "material-ui-confirm";
import { reqUpdateStatus } from "services/job";

const StatusChip = ({ id, status, nextStatus }: any) => {
  const confirm = useConfirm();
  const [updating, setUpdating] = React.useState(false);

  const handleUpdateStatus = React.useCallback(() => {
    confirm().then(() => {
      setUpdating(true);
      reqUpdateStatus(id, nextStatus).finally(() => {
        setUpdating(false);
      });
    });
  }, [confirm, id, nextStatus]);

  if (updating) return <>Loading...</>;

  if (status !== "ค้างจ่าย") {
    return <Chip size="small" label={status} />;
  }

  return (
    <Chip
      size="small"
      label={status}
      color="secondary"
      onClick={handleUpdateStatus}
    />
  );
};
export default StatusChip;
