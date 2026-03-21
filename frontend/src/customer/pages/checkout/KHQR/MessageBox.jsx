const MessageBox = ({ message }) => {
  if (!message.text) return null;
  const color = message.type === 'error' ? 'text-danger-dark' : 'text-primary';
  return <h4 className={color}>{message.text}</h4>;
};

export default MessageBox;
