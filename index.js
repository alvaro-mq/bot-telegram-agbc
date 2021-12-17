require('dotenv').config();

const { Telegraf, session, Scenes } = require('telegraf');
const jsoning = require('jsoning');
const fs = require('fs');
const cron = require('node-cron');
const { WizardScene, Stage } = Scenes;

const { getData, search } = require('./agbc.service');
const db = new jsoning('db.json');
const dbHistorico = new jsoning('db.historico.json');
const { getText, makeHtml } = require('./utils');
const { TELEGRAF_TOKEN } = process.env;

(async () => {
  const bot = new Telegraf(TELEGRAF_TOKEN);

  bot.telegram.getMe().then((botInformations) => {
    bot.options.username = botInformations.username;
    console.log(`Server has initialized bot nickname. Nick: ${botInformations.username}`);
  });

  bot.start((ctx) => {
    const { message } = ctx.update;
    ctx.reply(`Bienvenid@ ${message.chat.username} a @AlertaAGBCBot 🤖. Te ayudare a buscar diariamente tu nombre de destinatario o nro de seguimiento.`)
  });

  bot.help((ctx) => {

  });

  bot.command('buscar', async (ctx) => {
    const text = getText(ctx);
    if (text) {
      const response = await getData('LA PAZ');
      const match = search(response, text);
      if (match && match.length > 0) {
        match.forEach((row) => {
          ctx.replyWithHTML(makeHtml(row));
        })
      } else {
        ctx.replyWithMarkdown('___No se encontraron coincidencias...___');
      }
    } else {
      ctx.replyWithMarkdown('Debes escribir el nombre del destinatario o el nro de seguimiento. Ej: ***/buscar*** ABC123456');
    }
  });

  const superWizard = new WizardScene(
    'super-wizard',
    async ctx => {
      const message = 'Genial, escribe el nombre del destinatario o el nro de seguimiento que quieres consultar.';
      ctx.reply(message);
      ctx.wizard.state.data = {};
  
      return ctx.wizard.next();
    },
    async ctx => {
      const chatId = ctx.update.message.chat.id;
      const code = ctx.message.text.trim().toUpperCase();
      ctx.wizard.state.data.code = code;
      ctx.replyWithMarkdown(`El nombre  de destinatario o nro de seguimiento ***${ctx.wizard.state.data.code}*** se registro exitosamente. 👍 Te alertare cuando encuentre alguna coincidencia.`);
      await db.push(chatId, { code, createDate: new Date() });
      return ctx.scene.leave();
    }
  );
  const stage = new Stage([superWizard]);
  bot.use(session());
  bot.use(stage.middleware());

  bot.command('/nuevo', ctx => {
    ctx.scene.enter('super-wizard');
  });

  // init cron
  cron.schedule('* * * * *', async () => {
    console.log('init cron...', new Date());
    const response = await getData('LA PAZ');
    const usersList = await db.all();
    Object.keys(usersList).forEach((userId) => {
      const codesList = usersList[userId];
      const codesListFilter = codesList.filter((data) => {
        const { code } = data;
        const match = search(response, code);
        if (match.length > 0) {
          match.forEach((row) => {
            bot.telegram.sendMessage(
              userId,
              makeHtml(row),
              { parse_mode: 'Html' }
            );
          });
          dbHistorico.push(userId, { ...data, alertDate: new Date(), result: match });
          return false;
        }
        return true;
      });
      if (codesListFilter.length < codesList.length) {
        db.set(userId, codesListFilter);
      }
    })
  });

  await bot.launch();
})();
