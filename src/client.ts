import { Client, Intents } from 'discord.js';
import path from 'path';

import { getCommands } from './lib/utils';
import { FileCommand } from './types';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

let commands: FileCommand[] | undefined;

client.on('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  commands = await getCommands(path.join(__dirname, 'commands'));
});

client.on('interactionCreate', (interaction) => {
  try {
    
    if (interaction.isCommand() && commands) {
      for (const cmd of commands) {
        if (cmd.schema.name === interaction.commandName)
          cmd.executor(interaction);
      }
    }

  } catch (e) {
    console.log(e);
  }
});

export default client;