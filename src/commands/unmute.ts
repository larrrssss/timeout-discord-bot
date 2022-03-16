import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';

import { FileCommand } from '../types';

async function executor(interaction: CommandInteraction) {
  const member = interaction.options.getMember('member', true) as GuildMember;
  let reason = interaction.options.getString('reason', false) ?? '';

  if (!(interaction.member as GuildMember).permissions.has('MODERATE_MEMBERS'))
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor('RED')
          .setTitle('Missing Permissions')
          .setDescription('You do not have permissions to timeout members')
      ],
    });

  if (member.id === interaction.user.id)
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor('RED')
          .setTitle('Invalid Member')
          .setDescription('You cannot unmute yourself')
      ],
    });

  reason += `(Unmuted by ${interaction.user.tag} - ${interaction.user.id})`;

  try {
    await member.timeout(
      null,
      reason,
    );
    
    interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor('GREEN')
          .setTitle('Timeout Removed')
          .addField('Member', `${member.user}`, true)
          .addField('Moderator', `${interaction.user}`, true)
          .addField('Reason', `\`\`\`${reason}\`\`\``),
      ],
    });
  } catch (e) {    
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor('RED')
          .setTitle('Action Failed')
          .setDescription('Make sure that the bot has the right permissions and the bot role is in the right place.')
      ],
    });
  }
}

export default {
  executor,
  schema: {
    name: 'unmute',
    description: 'Unmute a member',
    options: [
      {
        type: 6,
        name: 'member',
        description: 'Which member do you want to unmute?',
        required: true,
      },
      {
        type: 3,
        name: 'reason',
        description: 'Enter a reason. This will only be visible in the Audit Log and will not shown to the member.',
        required: false,
      }
    ]
  }
} as FileCommand;