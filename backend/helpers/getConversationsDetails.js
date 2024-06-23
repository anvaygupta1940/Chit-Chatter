const Conversation = require("../models/Conversation");

const getConversationDetails = async (currUserId) => {
    if (currUserId) {

        // extracting all the conversations of current user
        const currentUserConversations = await Conversation.find({
            "$or": [
                { sender: currUserId },
                { receiver: currUserId }
            ]
        }).sort({ updatedAt: -1 }).populate('messages').populate("sender").populate("receiver");

        // console.log("current user conversations >>", currentUserConversations);

        const conversations = currentUserConversations.map((conv) => {

            // count the number of unseeen messages in each conversations
            const countUnseenMsg = conv?.messages.reduce((prev, curr) => {

                const msgByUserId = curr?.msgByUserId?.toString();

                if (msgByUserId !== currUserId) {
                    return prev + (curr?.seen ? 0 : 1);
                } else {
                    return prev;
                }
            }, 0);


            return {
                _id: conv?._id,
                sender: conv?.sender,
                receiver: conv?.receiver,
                unseenMsg: countUnseenMsg,
                lastMsg: conv?.messages[conv?.messages.length - 1]
            }
        })

        return conversations;
    } else {
        return [];
    }
}

module.exports = getConversationDetails