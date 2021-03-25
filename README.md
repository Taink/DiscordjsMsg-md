# DiscordjsMsg-md
A library for converting discord.js Message objects to a markdown form.

## Usage
### Requirements
Discord.js@12.5 or above, and as such Node v12 or above
### Installation:
```sh
# -S aliases --save
$ npm install -S discord.js discordjsmsg-md
```

```js
// for es6 modules, use:
import { serializeMessage } from 'discordjsmsg-md';
// for commonjs, use:
const { serializeMessage } = require('discordjsmsg-md');

// fetch the message somehow
// ...
// ...and serialize it!
const messageMarkdown = serializeMessage(message);
```

## Notes
The library in its current state is mostly usable, but keep in mind that:
* As I am french, the header provided in the helper method `serializeMessages` is in french
* You should avoid caching the messages if you plan to log an entire channel

All contributions are welcome! Submit a Pull Request if you would like to add something and I'll gladly review it.
