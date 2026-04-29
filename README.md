Room 0: The Final Test
A psychological horror escape-room adventure game by Me, based on a simple adventure game engine by Adam Smith:
https://github.com/rndmcnlly/AdventurePrototype
The player wakes up inside a locked industrial building and must solve room-based puzzles to escape.

Requirements：
AdventureScene scenes: WakeRoom, LockPuzzleRoom, StorageRoom, MonitorRoom, FinalDoor
Non-AdventureScene scenes: Intro, GoodEnding, BadEnding
Helper methods added: addBackground(), addHotspot(), lockedExit(), shake(), blink()
Locations: Wake-Up Room, Lock Puzzle Room, Storage Room, Monitor Room, Final Door Chamber
Interactive objects: tape recorder, table, floor tile, keypad box, fuse panel, toolbox, sealed crate, monitors, locked drawer, card reader, keypad, final door
Pointerover messages: most objects show hints when hovered
Pointerdown effects: objects give items, reveal clues, unlock doors, shake, blink, flash, or move to another scene
Animation examples: objects blink, locked items shake, and the camera flashes during important moments
Timer: the Lock Puzzle Room has a timed challenge that sends the player to the bad ending if they fail

Asset sources：
The room background images were created by me using ChatGPT image generation. I prompted for realistic industrial horror escape-room backgrounds with metal doors, pipes, red warning lights, wet floors, puzzle rooms, storage shelves, CRT monitors, and a final vault door. I then selected clearer versions that matched the game's style.

Code sources：
adventure.js and the starter structure were created by Adam Smith:
https://github.com/rndmcnlly/AdventurePrototype

game.js was based on the starter example and rewritten by me for my Room 0 game.
