import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { join } from 'path';

import { info, success } from '../../lib/logger';
import { getCommands } from '../../lib/utils';

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN || '');

(async () => {
  const ownCommands = (await getCommands(join(__dirname, '../../commands')))
    .map((x) => x.schema.name);

  const route = process.env.NODE_ENV === 'production'
    ? Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || '')
    : Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID || '', process.env.GUILD_ID || '');

  info('Started refreshing application (/) commands');
  info(`Route: ${route}`);

  const commands = await rest.get(route) as { id: string, name: string }[];

  for (const cmd of commands) {
    if (ownCommands.includes(cmd.name))
      await rest.delete(`${route}/${cmd.id}`);
  }

  success('Successfully removed all application (/) commands');

  process.exit(0);  
})();