import { GuildChannel, Message, MessageEmbed, User } from 'discord.js';
import { oneLine, source, stripIndent, stripIndents } from 'common-tags';

function authorStr(author: User): string {
    return oneLine`
    ![avatar](${author.displayAvatarURL({ size: 64 })})
    ${author.tag}
    ${author.bot ? '[BOT]' : ''}`
}

function msgTimestampStr(message: Message): string {
    return `${message.createdAt.toLocaleString()}${message.editedAt ? `, last edit: ${message.editedAt.toLocaleDateString()}` : ''}`
}

function serializeEmbed(embed: MessageEmbed): string {
    const embedAuthor = embed.author?.name ? oneLine`
        ${embed.author?.iconURL ? `![author icon url](${embed.author.iconURL})` : ''}
        ${embed.author?.url ? `[${embed.author.name}](${embed.author.url})` : embed.author?.name}
    ` : '';

    let fieldText = ''
    for (let i = 0; i < embed.fields.length; i++) {
        const field = embed.fields[i];
        if (i > 0) fieldText += '\n';
        fieldText += `> **${field.name}**\n> ${field.value}`;
    };

    return stripIndents`
        ${embedAuthor ? `> ${embedAuthor}` : ''}
        ${embed.title ? embed.url ? `> **[${embed.title}](${embed.url})**` : `> **${embed.title}**` : ''}
        ${embed.description ? `> ${embed.description}` : ''}
        ${fieldText}
        ${embed.image ? `![embed image](${embed.image.url})` : ''}
    `;
}

/**
 * Serializes a message to markdown
 * 
 * @param {Message} message the message to serialize in Markdown
 */
export function serializeMessage(message: Message): string {
    let content = stripIndent`
        ## ${authorStr(message.author)}
        *${msgTimestampStr(message)}*
        ${message.cleanContent}
    `;

    const attachments = Array.from(message.attachments.values())
    for (let i = 0; i < attachments.length; i++) {
        content += '\n';
        const attachment = attachments[i];
        if (attachment.name?.endsWith('.png') || attachment.name?.endsWith('.jpg') || attachment.name?.endsWith('.webp') || attachment.name?.endsWith('.gif')) {
            content += `![${attachment.name}](${attachment.url})`;
        } else {
            content += `> **[${attachment.name}](${attachment.url})**\n> *${attachment.size} bytes*\n`;
        }
    }

    for (let i = 0; i < message.embeds.length; ++i) {
        content += '\n';
        const embed = message.embeds[i];
        content += `${serializeEmbed(embed)}\n`;
    }

    return content;
}

/**
 * Helper function used to produce a complete file with a header.
 * 
 * @param   {Message[]} messages An array of messages to serialize
 * @returns {string}    
 */
export function serializeMessages(messages: Message[], hasHeader = true): string {
    console.log('Serializing...');
    const channelName = (messages[0].channel instanceof GuildChannel) ? messages[0].channel.name : '';
    const users: Set<User> = new Set();
    const result = messages.map((msg, i) => {
        if (!msg.author.bot) users.add(msg.author); // exclude bots from user list in header
        console.log(`Serializing ${i + 1}/${messages.length} messages...`)
        return serializeMessage(msg);
    }).join('\n\n');

    let usersStr = '';
    const usersArr = Array.from(users.values())
    for (let i = 0; i < usersArr.length; i++) {
        const author = usersArr[i];
        usersStr += stripIndent`
            * ${authorStr(author)}
                * ID: ${author.id}
        `;
        usersStr += '\n';
    }

    const header = source`
        # Historique des messages dans #${channelName}
        Participants :
        ${usersStr}

        --------------
    ` + '\n';

    return hasHeader ? header + result : result;
}
