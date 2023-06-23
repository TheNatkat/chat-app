import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRef } from "react";

export default function MyVerticallyCenteredModal(props) {
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  function handleAddRoom(e) {
    let name = nameRef.current.value;
    let description = descriptionRef.current.value;
    props.makeRoom(name, description);
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          New Channel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="text" placeholder="Channel name" ref={nameRef} />
        <textarea
          ref={descriptionRef}
          placeholder="Channel Description"
          rows={5}
        />
      </Modal.Body>
      <Modal.Footer className="justify-content-end">
        <Button onMouseDown={(e) => handleAddRoom(e)} onClick={props.onHide}>
          save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
