# DiscordjsMsg-md
A library for converting discord.js Message objects to a markdown form.

## Usage
```js
import { serializeMessage } from 'discordjsmsg-md';
// for commonjs, use:
// const { serializeMessage } = require('discordjsmsg-md');

// fetch the message somehow
const messageMarkdown = serializeMessage(message);
```

## Notes

