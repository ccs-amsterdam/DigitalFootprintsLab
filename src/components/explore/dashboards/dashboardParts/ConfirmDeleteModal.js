import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import { Button, ButtonGroup, Checkbox, Modal } from "semantic-ui-react";

const propTypes = {
  /** The name of the table in DB */
  table: PropTypes.string,
};

// Use this modal by keeping a 'confirm' state as follows:
//   const [deleteIds, setDeleteIds] = useState([])
// Then add ConfirmDeleteModal to the return JSX, pass on deleteIds and setDeleteIds,
// and set table ids to deleteIds to trigger the confirm delete modal

const ConfirmDeleteModal = ({ dashData, deleteIds, setDeleteIds }) => {
  const [ask, setAsk] = useState(true);
  const deleteImmediately = useRef(false);

  const handleDelete = async () => {
    deleteImmediately.current = !ask;
    await dashData.rmID(deleteIds);
    setDeleteIds([]);
  };

  const n = deleteIds?.length || 0;
  if (deleteImmediately.current && n === 1) {
    handleDelete();
    return null;
  }

  return (
    <Modal style={{ backgroundColor: "#00000054" }} open={n > 0} onClose={() => setDeleteIds([])}>
      <Modal.Header>Delete item{n === 1 ? "" : "s"}</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete {n === 1 ? "this item" : `${n} items`}?</p>

        <br />
        <Modal.Actions>
          <ButtonGroup centered="true">
            <Button fluid primary onClick={() => setDeleteIds([])}>
              Cancel
            </Button>
            <Button fluid color="red" onClick={(e, d) => handleDelete()}>
              Yes
            </Button>
          </ButtonGroup>
          {n > 1 ? null : (
            <Checkbox
              style={{ float: "right" }}
              onChange={(e, d) => setAsk(!d.checked)}
              label="Do not ask again. Next time, delete immediately when clicking the trash icon"
            />
          )}
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

ConfirmDeleteModal.propTypes = propTypes;
export default React.memo(ConfirmDeleteModal);
