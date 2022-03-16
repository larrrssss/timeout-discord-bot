import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';

import { FileCommand } from '../types';

const units = [
  { name: 'Seconds', value: 1000 },
  { name: 'Minutes', value: 60 * 1000 },
  { name: 'Hours', value: 60 * 60 * 1000 },
  { name: 'Days', value: 24 * 60 * 60 * 1000 },
];

async function executor(interaction: CommandInteraction) {
  const member = interaction.options.getMember('member', true) as GuildMember;
  const time = interaction.options.getNumber('time', true);
  const unit = interaction.options.getInteger('unit', false) ?? 60 * 1000;
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
          .setDescription('You cannot timeout yourself')
      ],
    });

  if (time <= 0)
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor('RED')
          .setTitle('Invalid Time')
          .setDescription('Are you sure the timeout is that long? :wink:')
      ],
    });

  if (time * unit > 28 * (units.find((u) => u.name === 'Days')?.value as number)) 
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor('RED')
          .setTitle('Maximum Timeout Exceeded')
          .setDescription('The duration of the timeout may not exceed `28 days`.')
      ],
    });

  reason += `(Timeout created by ${interaction.user.tag} - ${interaction.user.id})`;

  try {
    const updatedMember = await member.timeout(
      time * unit,
      reason,
    );

    const disabledUntil = Math.floor(updatedMember.communicationDisabledUntilTimestamp as number / 1000);
    
    interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor('GREEN')
          .setTitle('Timeout Created')
          .addField('Member', `${member.user}`, true)
          .addField('Moderator', `${interaction.user}`, true)
          .addField('Length', `Timeout ends <t:${disabledUntil}:R>`, false)
          .addField('Reason', `\`\`\`${reason}\`\`\``),
      ],
    });
  } catch (e) {    
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor('RED')
          .setTitle('Timeout Failed')
          .setDescription('Make sure that the bot has the right permissions and the bot role is in the right place.')
      ],
    });
  }
}

export default {
  executor,
  schema: {
    name: 'mute',
    description: 'Temporarily mute a member from your server',
    options: [
      {
        type: 6,
        name: 'member',
        description: 'Which member do you want to timeout?',
        required: true,
      },
      {
        type: 10,
        name: 'time',
        description: 'How long should the timeout be? (Default minutes)',
        required: true,
      },
      {
        type: 4,
        name: 'unit',
        description: 'Change the time unit',
        required: false,
        choices: units,
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