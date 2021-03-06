const discordApiError = require('discord.js').DiscordAPIError;
const Command = require('../../models/Command');
const Utils = require('../../modules/Utils');

class Ban extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'Bans a mentioned user or users, plus you can specify the amount of days of messages to remove',
      category: 'Moderation',
      usage: ['ban [user mention/s]', ['ban [user mention/s] -d [days] -r [reason]']],
      guildOnly: true,
      permLevel: 'Moderator',
    });
  }

  async run(message, args) {
    //  find the indexes for arguements
    const indexOfD = args.indexOf('-d');
    const indexOfR = args.indexOf('-r');
    let days = 0;
    let reason = '';
    let displaySuccess;

    if (indexOfD !== -1) {
      //  parse the day arguement
      days = parseInt(args.slice(indexOfD + 1, indexOfR), 10);
    }
    if (indexOfR !== -1) {
      //  seperate the reason into a whole string
      reason = args.slice(indexOfR + 1).join(' ');
    }

    const bannedUsersTags = [];

    //  for each mentioned user, ban the user, inserting the days and reason
    if (message.mentions.users.size > 0) {
      message.mentions.users.forEach((user) => {
        const member = message.guild.member(user);
        if (member) {
          member.ban({
            reason,
            days,
          })
            .then(() => bannedUsersTags.push(user.tag))
            .catch((e) => {
              if (e instanceof discordApiError) {
                message.channel.send(Utils.createErrorMessage(e.message));
              } else {
                message.channel.send(Utils.createErrorMessage(`Failed to ban user: **${user.tag}**`));
              }
              displaySuccess = false;
              this.client.logger.error(e);
            });
        } else {
          message.channel.send(Utils.createErrorMessage(`The user ${user.tag} is not in this guild`));
        }
      });
      if (displaySuccess === true) {
        message.channel.send(Utils.createSuccessMessage(`Successfully banned user(s) ${bannedUsersTags.join(' ')}`));
      }
    } else {
      message.channel.send(Utils.createErrorMessage('You didn\'t mention any users to ban'));
    }
  }
}

module.exports = Ban;
