import React from "react";
import Toast from "react-bootstrap/Toast";

const Error = ({ errorMsg }) => {
  return (
    <Toast>
      <Toast.Header closeButton={false}>
        <strong className="me-auto"> {`Error: ${errorMsg}`}</strong>
      </Toast.Header>
    </Toast>
  );
};

export default Error;
