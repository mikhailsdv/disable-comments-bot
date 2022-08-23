require("dotenv").config({path: "./.env"})
const bot = require("./src/bot.js")
const {webhookCallback} = require("grammy")
const express = require("express")
const expressApp = express()

expressApp.use(express.json())

expressApp.use(`/${process.env.BOT_TOKEN}`, webhookCallback(bot, "express"))

expressApp.get("/", (req, res) => {
	res.send("Hello World!")
})

module.exports = expressApp
