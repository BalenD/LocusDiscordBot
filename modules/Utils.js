const { RichEmbed } = require('discord.js');

class Utils {
  /**
   * Ready-made rich embed for error messages
   * @param {String} messageText text to display as an error message
   * @returns Pre-formatted RichEmbed object with the error message
   */
  static createErrorMessage(messageText) {
    const errorMessage = new RichEmbed()
      .setColor('#D0021B')
      .setDescription(`:octagonal_sign: | ${messageText}`)
      .setTimestamp();

    return errorMessage;
  }

  /**
   * Ready-made rich embed for success messages
   * @param {String} messageText text to display as a success message
   * @returns Pre-formatted RichEmbed object with the success message
   */
  static createSuccessMessage(messageText) {
    const successMessage = new RichEmbed()
      .setColor('#7ED321')
      .setDescription(`:white_check_mark: | ${messageText}`)
      .setTimestamp();

    return successMessage;
  }

  /**
   * Ready-made rich embed for info messages
   * @param {String} messageText text to display as an information message
   * @returns Pre-formatted RichEmbed object with the information message
   */
  static createInfoMessage(messageText) {
    const infoMessage = new RichEmbed()
      .setColor('#F1DF37')
      .setDescription(`:warning: | ${messageText}`)
      .setTimestamp();

    return infoMessage;
  }

  /**
   * returns string for verification level number
   * @param {number} verificationLevelNumber the number to map to text
   */
  static VerificationLevelString(verificationLevelNumber) {
    const verificationLevel = {
      0: 'None',
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High',
    };

    return verificationLevel[verificationLevelNumber];
  }

  /**
   * creates a random number between a minimum and a maximum
   * @param {*} min the mminimum number it can get
   * @param {*} max  the maximum number it can get
   */
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * checks if the member has the specific neccesary command perms
   * @param {*} memberPermissions the member permissions
   * @param {*} commandPermissions the permissions needed to run command
   */
  static hasPerms(memberPermissions, commandPermissions) {
    commandPermissions.forEach((perm) => {
      if (!memberPermissions.includes(perm)) {
        return false;
      }
    });
    return true;
  }

  static Auditable(client, guild, messageInfo, args) {
    const settings = client.getSettings(guild.id);
    if (settings.auditLogs === false) {
      return;
    }
    const logs = guild.channels.find(ch => ch.name === settings.auditLogsChannel);
    if (guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
      guild.createChannel(settings.auditLogsChannel, 'text');
    }
    if (!guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
      client.logger.log('guild logs channel does not exist and cant be created');
    }
    const msgToReturn = new RichEmbed()
      .setColor(messageInfo.color)
      .setDescription(messageInfo.description)
      .setAuthor(`${messageInfo.authorName} ${messageInfo.authorIcon}`);

    Object.entries(args).forEach(([key, value]) => {
      msgToReturn.addField(key, value);
    });
    console.log(logs);
    logs.send(msgToReturn);
  }
}

module.exports = Utils;
