import "./Tooltip.styles.css";

const Tooltip = ({ text }: { text: string }) => {
  return <div className="Tooltip">{text}</div>;
};

export { Tooltip };
