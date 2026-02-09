# PMD Save Editor

A modern web-based save editor for Pokémon Mystery Dungeon: Rescue Team (Blue/Red) and Explorers of Sky/Time/Darkness.

## Credits & Legacy

This project is a modern refactor and continuation of the logic found in the [SkyEditor.SaveEditor](https://github.com/evandixon/SkyEditor.SaveEditor) project by **Evan Dixon**. We owe a great deal to the original research and implementation done by the SkyEditor community.

## Features

- **Rescue Team Support**: Compatible with Blue Rescue Team and Red Rescue Team save files.
- **Explorers Support**: Comprehensive editing for Explorers of Sky, Time, and Darkness.
- **Team Editing**: Modify Pokémon stats, moves, nicknames, and more.
- **Inventory Management**: Add, remove, or edit items in your storage and bag.
- **Save Integrity**: Automatic checksum calculation and backup management.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Falker/PMD-Save-Editor.git
   cd PMD-Save-Editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

The project is built using:
- **React** with **TypeScript**
- **Vite** for the build pipeline
- **Vanilla CSS** for styling

## License

This project is licensed under the MIT License - see the LICENSE file for details. (Based on SkyEditor legacy).
