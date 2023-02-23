import "./ErrorMessage.styles.css";

const ErrorMessage = ({ text }: { text: string }) => {
  return <div className="error-msg">{text}</div>;
};

export { ErrorMessage };
