export default function mergeMessages(messageArray) {
  const mergedMessages = [];

  messageArray.forEach((user) => {
    user.messages.forEach((message) => {
      mergedMessages.push({
        nickname: user.nickname,
        time: message.time,
        text: message.text,
      });
    });
  });

  return mergedMessages;
}
