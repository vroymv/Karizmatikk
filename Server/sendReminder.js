async function sendReminder() {
  try {
    let messages = [];
    const allTokens = await PushToken.find();
    const usersToRemind = await getUsersToRemind();
    const toRemind = allTokens.filter((element) =>
      usersToRemind.includes(element.token)
    );

    for (let pushToken of toRemind) {
      if (!Expo.isExpoPushToken(pushToken.token)) {
        console.error(
          `Push token ${pushToken.token} is not a valid Expo push token`
        );
        continue;
      }
      let name = await User.find({ _id: pushToken.userId }, { username: 1 });
      name = name[0].username;

      messages.push({
        to: pushToken.token,
        sound: "default",
        title: `Hi, ${name}!`,
        body: "We hope you're enjoying clean and fresh shoes! It's been a week since your last order, and we wanted to remind you that it's time to give your shoes another wash.",
        data: { withSome: "data" },
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
}

async function getUsersToRemind() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  //   const usersToRemind = await Order.find(
  //     { orderTime: { $lt: oneWeekAgo } },
  //     { userId: 1 }
  //   );
  const usersToRemind = await User.find(
    { lastOrder: { $lt: oneWeekAgo } },
    { _id: 1 }
  );
  const allTokens = await PushToken.find({}, { userId: 1 });
  const usersToRemindWithPushTokens = usersToRemind.filter((element) =>
    allTokens.includes(element)
  );

  return usersToRemindWithPushTokens;
}

module.exports = sendReminder;
