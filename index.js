'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const TelegramMessage = require('./data/telegramMessage');

const vkGroupId = process.env.VK_GROUP_ID;
const answerToServerVk = process.env.ANSWER_TO_SERVER_VK;
const chatTelegramId = process.env.TELEGRAM_CHAT_ID;
const tgToken = process.env.TOKEN;

const REQ_TYPE_CONFIRM = 'confirmation';
const DEFAULT_ANSWER = 'ok';

app.use(bodyParser.json());

app.use((req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        console.log('error JSON');
        res.end(DEFAULT_ANSWER);
    }
    next();
});

app.post('/botvkt', (req, res) => {
    if (req.body.type === REQ_TYPE_CONFIRM && req.body.group_id == vkGroupId) {
        res.end(answerToServerVk);
    }

    const telegramMessage = new TelegramMessage();
    const data = Object.assign(req, {vkGroupId, answerToServerVk, chatTelegramId, tgToken});
    telegramMessage.send(data.body);

    res.end(DEFAULT_ANSWER);
});

app.listen(process.env.PORT);