import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Modal } from "semantic-ui-react";

const propTypes = {
  /** The name of the table in DB */
  table: PropTypes.string,
};

// Use this modal by keeping a 'confirm' state as follows:
//   const [deleteIds, setDeleteIds] = useState([])
// Then add ConfirmDeleteModal to the return JSX, pass on deleteIds and setDeleteIds,
// and set table ids to deleteIds to trigger the confirm delete modal

const ConfirmDeleteModal = ({ processDelete, deleteIds, setDeleteIds }) => {
  const [ask, setAsk] = useState(true);
  const { t } = useTranslation();
  const deleteImmediately = useRef(false);
  const beingDeleted = useRef([]);

  const handleDelete = async () => {
    if (beingDeleted.current === deleteIds) return;
    beingDeleted.current = deleteIds;
    deleteImmediately.current = !ask;
    await processDelete(deleteIds);
    setDeleteIds([]);
  };

  const n = deleteIds?.length || 0;
  if (deleteImmediately.current && n === 1) {
    handleDelete();
    return null;
  }

  return (
    <Modal
      size="small"
      style={{ backgroundColor: "#00000054" }}
      open={n > 0}
      onClose={() => setDeleteIds([])}
    >
      <Modal.Content>
        <p>
          {t("explore.table.delete.confirm", {
            n: n,
            items: n === 1 ? t("common.item") : t("common.items"),
          })}
        </p>
      </Modal.Content>
      <Modal.Actions>
        {n > 1 ? null : (
          <Checkbox
            onChange={(e, d) => setAsk(!d.checked)}
            label={t("explore.table.delete.dontask")}
          />
        )}
        <Button size="mini" primary onClick={() => setDeleteIds([])}>
          {t("common.cancel")}
        </Button>
        <Button size="mini" color="red" onClick={() => handleDelete()}>
          {t("common.delete")}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

ConfirmDeleteModal.propTypes = propTypes;
export default React.memo(ConfirmDeleteModal);
