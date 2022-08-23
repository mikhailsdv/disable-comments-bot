require("dotenv").config({path: "../.env"})
const {Bot, InlineKeyboard} = require("grammy")
const {saveDeletedMessage} = require("./db")
const {trimMessage} = require("./utils")

const credits = trimMessage(`
	Built with [grammY](https://grammy.dev/)
	Hosted on [Deta.sh](https://deta.sh)
	GitHub: [mikhailsdv/disable-comments-bot](https://guthub.com/mikhailsdv/disable-comments-bot)
	Author's blog: @FilteredInternet
`)

const bot = new Bot(process.env.BOT_TOKEN)

bot.catch(err => {
	const ctx = err.ctx
	if (err?.error?.method === "deleteMessage") {
		ctx.reply(
			trimMessage(`
				⚠️ Couldn't delete auto-forward message. Please grant me admin rights and permission to delete messages.
			`)
		)
	} else {
		throw err.error
	}
})

bot.command("start", async ctx => {
	if (ctx.chat.id < 0) {
		return
	}
	await ctx.reply(
		trimMessage(`
			👋 Hi. I can delete automatic forwards from your channel to your discussion chat.

			Why?
			If you decide to disable comments and unlink discussion chat from your channel, then all your existing comments will also be unlinked from the posts.

			To prevent this behavior, you can delete automatically forwarded messages from your channel to the discussion chat, so that the comments button gets removed. This bot does everything for you.

			Add the bot to your discussion chat as an admin with permission to delete messages, and it will immediately delete messages forwarded from your channel.
			${credits}
		`),
		{
			reply_markup: new InlineKeyboard().url(
				"Add to chat",
				`https://t.me/${ctx.me.username}?startgroup=add`
			),
			parse_mode: "Markdown",
		}
	)
})

bot.on("message:new_chat_members:me", async ctx => {
	await ctx.reply(
		trimMessage(`
			Ok, I'm in your chat. Beginning from now I'm going to delete every message automatically forwarded from your channel.

			Make sure I have admin rights and permission to delete messages.

			If you want to stop me, just kick me from the chat.
			${credits}
		`),
		{
			parse_mode: "Markdown",
		}
	)
})

bot.on("message:is_automatic_forward", async ctx => {
	console.log("message:is_automatic_forward")
	await ctx.deleteMessage()
	await saveDeletedMessage({
		message_id: ctx.message.message_id,
		chat: ctx.message.chat,
		date: ctx.message.date,
		forward_from_chat: ctx.message.forward_from_chat,
		forward_from_message_id: ctx.message.forward_from_message_id,
		forward_date: ctx.message.forward_date,
	})
})

module.exports = bot
