const MessageBox = ({ message }) => {
  if (!message.text) return null;
  const color = message.type === 'error' ? 'text-red-600' : 'text-green-600';
  return <p className={color}>{message.text}</p>;
};

export default MessageBox;
