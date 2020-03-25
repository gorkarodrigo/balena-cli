/**
 * @license
 * Copyright 2020 Balena Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { flags } from '@oclif/command';
import { stripIndent } from 'common-tags';
import Command from '../command';
import * as cf from '../utils/common-flags';
import { getBalenaSdk } from '../utils/lazy';
import { CommandHelp } from '../utils/oclif-utils';

interface FlagsDef {
	device: string; // device UUID
	help: void;
}

interface ArgsDef {
	note: string;
}

export default class NoteCmd extends Command {
	public static description = stripIndent`
		Set a device note.

		Use this command to set or update a device note.

		If note command isn't passed, the tool attempts to read from \`stdin\`.

		To view the notes, use $ balena device <uuid>.
`;
	public static examples = [
		'$ balena note "My useful note" --device 7cf02a6',
		'$ cat note.txt | balena note --device 7cf02a6',
	];

	public static args = [
		{
			name: 'note',
			required: true,
			description: 'note content',
		},
	];

	public static usage = (
		'note ' + new CommandHelp({ args: NoteCmd.args }).defaultUsage()
	).trim();

	public static flags: flags.Input<FlagsDef> = {
		device: flags.string({
			char: 'd',
			description: 'device uuid',
			required: true,
		}),
		help: cf.help,
	};

	public static authenticated = true;

	public async run() {
		const { args: params, flags: options } = this.parse<FlagsDef, ArgsDef>(
			NoteCmd,
		);

		const { normalizeUuidProp } = await import('../utils/normalization');
		normalizeUuidProp(options, 'device');

		const balena = getBalenaSdk();

		return balena.models.device.note(options.device!, params.note);
	}
}
