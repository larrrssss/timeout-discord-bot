import 'dotenv/config';
import { join } from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { getCommands } from '../../lib/utils';
import { info, error, success } from '../../lib/logger';

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN || '');

(async () => {
  const commands = await getCommands(join(__dirname, '../../commands'));

  const route = process.env.NODE_ENV === 'production'
    ? Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || '')
    : Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID || '', process.env.GUILD_ID || '');

  info('Started refreshing application (/) commands');
  info(`Route: ${route}`);
  for (const cmd of commands) {
    try {
      await rest.post(
        route,
        { body: cmd.schema },
      );
    } catch (e: any) {
      error(`Error registering command ${cmd.schema.name}`);
      error(JSON.stringify(e.rawError));
    }
  }

  success('Successfully reloaded application (/) commands');

  process.exit(0);  
})();