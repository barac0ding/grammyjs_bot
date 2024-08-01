require('dotenv').config()
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy')
const { hydrate } = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API_KEY)

bot.use(hydrate())


bot.api.setMyCommands([
    {
        command: "start",
        description: "Start the bot",
    },
    {
        command: "menu",
        description: "Get menu",
    },

])

bot.command('start', async (ctx) => {
    ctx.react('🍌')
    ctx.reply('*This is bold text\\!*, and _cursive text_\\. This is [link to lesson](https://www.youtube.com/watch?v=q-AFR0D7Vuw)', {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true
    })
})


const menuKeyboard = new InlineKeyboard()
    .text('Get status of order', 'order-status')
    .text('Ping support', 'support')

const backKeyboard = new InlineKeyboard()
    .text('< Back to Menu', 'back')

bot.command('menu', async (ctx) => {
    await ctx.reply('Do your order', {
        reply_markup: menuKeyboard
    })
})

bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Order status: delivered', {
        reply_markup: backKeyboard
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('back', async(ctx) => {
    await ctx.callbackQuery.message.editText('Menu', {
        reply_markup: menuKeyboard
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText("Write your message", {
        reply_markup: backKeyboard
    })
    await ctx.answerCallbackQuery()
})

bot.catch((err) => {
    const ctx = err.ctx
    console.error(`Error while handling update ${ctx.update.update_id}: `)
    const e = err.error

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description)
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram", e)
    } else (
        console.error("Unknown error", e)
    )
})

bot.start();

