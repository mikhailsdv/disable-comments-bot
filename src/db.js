const {Deta} = require("deta")
const deta = Deta(process.env.DETA_PROJECT_KEY)
const db = deta.Base("disable-comments-bot")

const saveDeletedMessage = async ({
	message_id,
	chat,
	date,
	forward_from_chat,
	forward_from_message_id,
	forward_date,
}) => {
	const newItem = await db.put({
		message_id,
		chat,
		date,
		forward_from_chat,
		forward_from_message_id,
		forward_date,
		iso_date: new Date(date * 1000).toISOString(),
	})
	return Boolean(newItem?.key)
}

module.exports = {
	saveDeletedMessage,
}
