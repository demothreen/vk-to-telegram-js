'use strict';

const request = require('request');
const Agent = require('socks5-https-client/lib/Agent');

class TelegramMessage {

    send(data) {

        let telegramMessage;

        //пришло новое сообщение в группу
        if (data.type === 'message_new') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nПришло личное сообщение "
                + "\nПерейти к сообщению: " + this.getLinkToMessageWithUser(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст сообщения: '" + this.getBody(data)
                + "\n\nОт: https://vk.com/id" + this.getUserMessage(data);
        }

        //добавлен новый комментарий к фото
        if (data.type == 'photo_comment_new') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nДобавлен комментарий "
                + "\nК изображению: " + this.getPhotoLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст комментария: '" + this.getComment(data)
                + "\n\nОт: " + this.getUserComment(data);
        }
        //добавлен комментарий на стене
        if (data.type == 'wall_reply_new') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nДобавлен комментарий к посту "
                + "\nПост: " + this.getPostLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст комментария: '" + this.getComment(data)
                + "\n\nОт: " + this.getUserComment(data);
        }
        //изменен комментарий на стене
        if (data.type == 'wall_reply_edit') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nИзменен комментарий "
                + "\nПост: " + this.getPostLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст комментария: '" + this.getComment(data)
                + "\n\nОт: " + this.getUserComment(data);
        }
        //удален комментарий на стене
        if (data.type == 'wall_reply_delete') {
            telegramMessage =
                "\nУдален комментарий "
                + "\nПост: " + this.getPostLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nКто удалил комментарий: " + this.getUserCommentDel(data);
        }
        //добавлен комментарий к видео
        if (data.type == 'video_comment_new') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nДобавлен комментарий "
                + "\nК видео: " + this.getVideoLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст комментария: '" + this.getComment(data)
                + "\n\nОт: " + this.getUserComment(data);
        }
        //добавлена новая запись на стене
        if (data.type == 'wall_post_new') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nДобавлен новый пост "
                + "\nПост: " + this.getNewPostLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст комментария: '" + this.getComment(data)
                + "\n\nОпубликовал запись: " + this.getUserPostCreate(data);
        }
        //добавлен новый комментарий в обсуждениях
        if (data.type == 'board_post_new') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nДобавлен новый комментарий к обсуждению: "
                + "\n" + this.getTopicLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст комментария: '" + this.getComment(data)
                + "\n\nОт: " + this.getUserComment(data);
        }
        //отредактирован новый комментарий в обсуждениях
        if (data.type == 'board_post_edit') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nОтредактирован комментарий в обсуждении: "
                + "\n" + this.getTopicLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст комментария: '" + this.getComment(data)
                + "\n\nОт: " + this.getUserComment(data);
        }
        //Удален комментарий в обсуждениях
        if (data.type == 'board_post_delete') {
            telegramMessage = "\nУдален комментарий в обсуждении: "
                + "\n" + this.getTopicLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)

        }
        //добавлен новый комментарий к товару
        if (data.type == 'market_comment_new') {
            telegramMessage = "Дата: " + this.getDateTime(data)
                + "\nДобавлен новый комментарий к товару "
                + "\nТовар: " + this.getMarketLink(data)
                + "\nИдентификатор сообщения: " + this.getTextId(data)
                + "\n\nТекст комментария: '" + this.getComment(data)
                + "\n\nОт: " + this.getUserComment(data);
        }

        //если в перечисленных типах нет того, что пришлет вк, будет ошибка
        if (telegramMessage === undefined) {
            telegramMessage = 'Данный тип запроса не обработан: ' + data.type;
        }

        this._internalSend(telegramMessage, data);

    }

    _internalSend(telegramMessage, data) {
        if (data.group_id == process.env.VK_GROUP_ID) {

            let url = "https://api.telegram.org/bot"
                + process.env.TOKEN
                + "/sendMessage?chat_id="
                + process.env.TELEGRAM_CHAT_ID
                + "&text="
                + encodeURIComponent(telegramMessage)
                + " ";

            request({
                url: url,
                strictSSL: true,
                agentClass: Agent,
                agentOptions: {
                    socksHost: process.env.PROXY_SOCKS5_HOST,
                    socksPort: parseInt(process.env.PROXY_SOCKS5_PORT),
                    // If authorization is needed:
                    socksUsername: process.env.PROXY_SOCKS5_USERNAME,
                    socksPassword: process.env.PROXY_SOCKS5_PASSWORD
                }
            }, function (err) {
                err ? console.log(err) : '';
            });
        }
    }

    //парсим дату/время сообщения

    getDateTime(data) {

        let a = new Date(data.object.date * 1000);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = (a.getMinutes() < 10 ? '0' : '') + a.getMinutes();
        let timeNow = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
        return timeNow;
    }

    //линк для перехода сразу в окно сообщения с пользователем

    getLinkToMessageWithUser(data) {
        return "https://vk.com/gim" + data.group_id + "?sel=" + data.object.user_id + ""
    }

    //парсим идентификатор сообщения

    getTextId(data) {
        return "<<" + data.object.id + ">>";
    }

    //парсим текст сообщения

    getBody(data) {
        return data.object.body + "'";
    }

    //парсим текст комментария

    getComment(data) {
        return data.object.text + "'";
    }

    //парсим от кого пришло сообщение

    getUserMessage(data) {
        return data.object.user_id;
    }

    //парсим от кого комментарий

    getUserComment(data) {
        let from_id = data.object.from_id;
        if (from_id > 0) {
            return "https://vk.com/id" + from_id;
        }
        else if (from_id < 0) {
            return "https://vk.com/club" + Math.abs(from_id);
        }
    }

    //парсим ссылку на пост

    getPostLink(data) {
        return "https://vk.com/wall-" + data.group_id + "_" + data.object.post_id + ";";
    }

    //парсим ссылку на фото

    getPhotoLink(data) {
        return "https://vk.com/club" + data.group_id + "?z=photo-" + data.group_id + "_" + data.object.photo_id + ";";
    }

    //парсим ссылку на видео

    getVideoLink(data) {
        return "https://vk.com/videos-" + data.group_id + "?z=video-" + data.group_id + "_" + data.object.video_id + ";";
    }

    //парсим кто удалил комментарий

    getUserCommentDel(data) {
        return "https://vk.com/id" + data.object.deleter_id;
    }

    //парсим ссылку на новосозданный пост

    getNewPostLink(data) {
        return "https://vk.com/wall-" + data.group_id + "_" + data.object.id + ";";
    }

    //парсим создателя поста

    getUserPostCreate(data) {
        return "https://vk.com/id" + data.object.created_by;
    }

    //парсим ссылку на обсуждение

    getTopicLink(data) {
        return "https://vk.com/topic-" + data.group_id + "_" + data.object.topic_id + "?post=" + data.object.id + ";";
    }

    //парсим ссылку на товар

    getMarketLink(data) {
        return "https://vk.com/market-" + data.group_id + "?w=product-" + data.group_id + "_" + data.object.item_id + ";";
    }
}

module.exports = TelegramMessage;
