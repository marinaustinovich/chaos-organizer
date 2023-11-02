export default function sortMessagesByDate(messages) {
  return messages.sort((a, b) => new Date(a.time) - new Date(b.time));
}
