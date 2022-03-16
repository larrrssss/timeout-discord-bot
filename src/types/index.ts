import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export interface FileCommand {
  executor: (interaction: CommandInteraction) => Promise<void>,
  schema: ApplicationCommandData,
}