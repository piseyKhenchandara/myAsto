const MessageBox = ({ message }) => {
  if (!message.text) return null;
  const color = message.type === 'error' ? 'text-red-600' : 'text-green-600';
  return <h3 className={color}>{message.text}</h3>;
};

export default MessageBox;
