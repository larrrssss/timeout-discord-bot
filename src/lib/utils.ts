import fs from 'fs';
import path from 'path';

import { FileCommand } from '../types';

export async function getCommands(p: string): Promise<FileCommand[]> {
  const files = await fs.promises.readdir(p);
  const cmds = [];

  for (const f of files) {
    if (['js', 'ts'].includes(f.split('.').pop() || '')) {
      cmds.push((await import(path.join(p, f))).default);
      continue;
    }

    cmds.push(...(await getCommands(path.join(p, f))));
  }

  return cmds;
}