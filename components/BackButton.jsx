import Button from "./Button";

/* eslint-disable react/prop-types */
function BackButton({ onClick }) {
  return (
    <Button type="back" onClick={onClick}>
      &larr; Back
    </Button>
  );
}

export default BackButton;
