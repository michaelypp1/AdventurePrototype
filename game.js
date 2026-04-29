class Room0Scene extends AdventureScene {
    addBackground(key) {
        let bg = this.add.image(this.w * 0.375, this.h * 0.5, key);
        bg.setDisplaySize(this.w * 0.75, this.h);
        bg.setDepth(-10);
    }

    addThing(x, y, label, hoverMessage, clickAction) {
        let thing = this.add.text(this.w * x, this.h * y, label)
            .setStyle({
                fontSize: `${2 * this.s}px`,
                color: '#eeeeee',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(0,0,0,0.45)',
                padding: { x: 10, y: 6 }
            })
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                thing.setColor('#ffdd88');
                this.showMessage(hoverMessage);
            })
            .on('pointerout', () => {
                thing.setColor('#eeeeee');
            })
            .on('pointerdown', () => {
                clickAction(thing);
            });

        return thing;
    }

    addHotspot(x, y, label, hoverMessage, clickAction) {
        let thing = this.add.text(this.w * x, this.h * y, label)
            .setStyle({
                fontSize: `${1.65 * this.s}px`,
                color: '#ffffff',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(15, 15, 15, 0.62)',
                padding: { x: 8, y: 5 }
            })
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                thing.setColor('#ff7777');
                this.showMessage(hoverMessage);
            })
            .on('pointerout', () => {
                thing.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                clickAction(thing);
            });

        return thing;
    }

    shake(target) {
        this.tweens.add({
            targets: target,
            x: target.x + this.s,
            repeat: 3,
            yoyo: true,
            duration: 80,
            ease: 'Sine.inOut'
        });
    }

    blink(target) {
        this.tweens.add({
            targets: target,
            alpha: { from: 1, to: 0.25 },
            yoyo: true,
            repeat: 4,
            duration: 100
        });
    }
    startRoomTimer(seconds) {
    this.timerRemaining = seconds;
    this.timerFinished = false;

    this.timerText = this.add.text(
        this.w * 0.75 + this.s,
        this.h * 0.52,
        `Time left: ${this.timerRemaining}s`
    ).setStyle({
        fontSize: `${2 * this.s}px`,
        color: '#ff7777',
        fontFamily: 'monospace'
    }).setWordWrapWidth(this.w * 0.25 - 2 * this.s);

    this.timerEvent = this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
            if (this.timerFinished) {
                return;
            }

            this.timerRemaining -= 1;
            this.timerText.setText(`Time left: ${this.timerRemaining}s`);

            if (this.timerRemaining <= 5) {
                this.timerText.setColor('#ff2222');
                this.cameras.main.flash(80, 120, 0, 0);
            }

            if (this.timerRemaining <= 0) {
                this.timerFinished = true;
                this.timerEvent.remove(false);

                this.showMessage("Time is up. The room locks down.");
                this.cameras.main.flash(400, 255, 0, 0);

                this.time.delayedCall(700, () => {
                    this.gotoScene("badEnding");
                });
            }
        }
    });
}

cancelRoomTimer() {
    this.timerFinished = true;

    if (this.timerEvent) {
        this.timerEvent.remove(false);
    }

    if (this.timerText) {
        this.timerText.setText("Timer stopped.");
        this.timerText.setColor('#88ff88');
    }
}

    lockedExit(x, y, label, destination, requiredItems, lockedMessage, openMessage) {
        return this.addHotspot(x, y, label, lockedMessage, (door) => {
            let missingItem = requiredItems.find((item) => !this.hasItem(item));

            if (missingItem) {
                this.showMessage(`Locked. You still need: ${missingItem}.`);
                this.shake(door);
                return;
            }

           this.showMessage(openMessage);
door.setText("open door");

this.cancelRoomTimer();

this.time.delayedCall(650, () => {
    this.gotoScene(destination);
});

            this.time.delayedCall(650, () => {
                this.gotoScene(destination);
            });
        });
    }
}


class Intro extends Phaser.Scene {
    constructor() {
        super('intro');
    }

    preload() {
        this.load.image('bgWake', 'assest/Wakeuproom.png');
        this.load.image('bgLock', 'assest/Lock Puzzle Room.png');
        this.load.image('bgStorage', 'assest/storage room.png');
        this.load.image('bgMonitor', 'assest/Monitor Room.png');
        this.load.image('bgFinal', 'assest/Final Door Chamber.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#100000');

        this.add.text(80, 80, "ROOM 0: THE FINAL TEST")
            .setStyle({
                fontSize: '64px',
                color: '#ffffff',
                fontFamily: 'monospace'
            });

        this.add.text(80, 180,
            "A psychological horror escape-room puzzle game.\n\n" +
            "You wake up inside a locked industrial building.\n" +
            "A distorted voice says every room is a test.\n\n" +
            "Find clues. Collect items. Do not rush the final door.\n\n" +
            "Click anywhere to begin."
        ).setStyle({
            fontSize: '30px',
            color: '#dddddd',
            fontFamily: 'monospace'
        });

        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('wakeRoom'));
        });
    }
}


class WakeRoom extends Room0Scene {
    constructor() {
        super("wakeRoom", "Wake-Up Room");
    }

    onEnter() {
        this.addBackground('bgWake');
        this.showMessage("You wake up in a locked room. The test has begun.");

        this.addHotspot(
            0.15, 0.72,
            "tape recorder",
            "An old tape recorder sits on the table. The red light is blinking.",
            (recorder) => {
                this.showMessage("A distorted voice says: The first key is hidden in plain sight.");
                this.blink(recorder);
            }
        );

        this.addHotspot(
            0.18, 0.40,
            "inspect table",
            "The metal table is scratched with numbers.",
            (table) => {
                if (!this.hasItem("clue: 314")) {
                    this.showMessage("You read the scratched numbers: 3 - 1 - 4.");
                    this.gainItem("clue: 314");
                } else {
                    this.showMessage("The scratched numbers are still there: 3 - 1 - 4.");
                }
            }
        );

        this.addHotspot(
            0.43, 0.70,
            "loose floor tile",
            "One floor tile looks slightly raised.",
            (tile) => {
                if (!this.hasItem("small key")) {
                    this.showMessage("You lift the tile and find a small rusty key.");
                    this.gainItem("small key");
                    tile.setText("empty tile");
                } else {
                    this.showMessage("There is nothing else under the tile.");
                }
            }
        );

        this.addHotspot(
            0.09, 0.28,
            "wall vent",
            "Cold air comes from the vent.",
            (vent) => {
                this.showMessage("You hear a faint speaker behind the wall: Observe before you act.");
                this.blink(vent);
            }
        );

        this.lockedExit(
            0.57, 0.48,
            "locked door",
            "lockPuzzleRoom",
            ["small key"],
            "The door is locked. There must be a key somewhere.",
            "The small key turns. The door opens."
        );
    }
}


class LockPuzzleRoom extends Room0Scene {
    constructor() {
        super("lockPuzzleRoom", "Lock Puzzle Room");
    }

    onEnter() {
        this.addBackground('bgLock');
        this.showMessage("A timer glows on the wall. Look at the symbols, then enter the code.");

        if (this.startRoomTimer) {
            this.startRoomTimer(45);
        }

        this.addHotspot(
            0.13, 0.25,
            "wall symbols",
            "Symbols are painted on the wall.",
            (symbols) => {
                this.showMessage("Symbol clue: triangle = 3, circle = 1, square = 4. The code is the order shown on the wall.");
                this.gainItem("symbol clue");
                this.blink(symbols);
            }
        );

        this.addHotspot(
            0.35, 0.32,
            "keypad box",
            "A metal box requires a three-digit code.",
            (box) => {
                if (!this.hasItem("clue: 314")) {
                    this.showMessage("You need the scratched number clue from the first room.");
                    this.shake(box);
                    return;
                }

                if (!this.hasItem("symbol clue")) {
                    this.showMessage("You should inspect the wall symbols first.");
                    this.shake(box);
                    return;
                }

                if (this.hasItem("fuse")) {
                    this.showMessage("The box is already open.");
                    return;
                }

                let answer = prompt("Enter the 3-digit code:");

                if (answer === null) {
                    this.showMessage("You step away from the keypad.");
                    return;
                }

                answer = answer.trim();

                if (answer === "314") {
                    this.showMessage("Correct. The box opens and reveals a fuse.");
                    this.gainItem("fuse");
                    box.setText("opened box");
                    this.cameras.main.flash(150, 200, 200, 180);
                } else {
                    this.showMessage("Wrong code. Check the wall symbols again.");
                    this.shake(box);
                }
            }
        );

        this.addHotspot(
            0.48, 0.27,
            "countdown timer",
            "The timer makes the room feel dangerous.",
            (timer) => {
                this.showMessage("The timer flickers: Fear wastes more time than the clock.");
                this.blink(timer);
            }
        );

        this.addHotspot(
            0.20, 0.72,
            "floor plates",
            "Several pressure plates are built into the floor.",
            (plates) => {
                this.showMessage("The plates rattle, but they are only a distraction.");
                this.shake(plates);
            }
        );

        this.addHotspot(
            0.08, 0.48,
            "rusty valve",
            "The valve is stiff and covered in rust.",
            (valve) => {
                this.showMessage("You turn the valve. Steam hisses through the pipes.");
                this.tweens.add({
                    targets: valve,
                    angle: 8,
                    yoyo: true,
                    repeat: 2,
                    duration: 120
                });
            }
        );

        this.lockedExit(
            0.60, 0.47,
            "red door",
            "storageRoom",
            ["fuse"],
            "The red door is locked. Open the keypad box and get the fuse first.",
            "You insert the fuse. The red door unlocks."
        );
    }
}


class StorageRoom extends Room0Scene {
    constructor() {
        super("storageRoom", "Storage Room");
    }

    onEnter() {
        this.addBackground('bgStorage');
        this.showMessage("Shelves, crates, and cables fill the storage room.");

        this.addHotspot(
            0.18, 0.29,
            "fuse panel",
            "The fuse panel is missing one piece.",
            (panel) => {
                if (!this.hasItem("fuse")) {
                    this.showMessage("Something is missing from the panel.");
                    this.shake(panel);
                    return;
                }

                if (!this.hasItem("power restored")) {
                    this.showMessage("The fuse fits. The lights turn on.");
                    this.gainItem("power restored");
                    panel.setText("working fuse panel");
                    this.cameras.main.flash(250, 220, 220, 200);
                } else {
                    this.showMessage("The power is already restored.");
                }
            }
        );

        this.addHotspot(
            0.24, 0.58,
            "toolbox",
            "A heavy toolbox is covered in dust.",
            (toolbox) => {
                if (!this.hasItem("screwdriver")) {
                    this.showMessage("You open the toolbox and take a screwdriver.");
                    this.gainItem("screwdriver");
                    toolbox.setText("opened toolbox");
                } else {
                    this.showMessage("The toolbox is empty now.");
                }
            }
        );

        this.addHotspot(
            0.40, 0.47,
            "sealed crate",
            "The crate is screwed shut.",
            (crate) => {
                if (!this.hasItem("screwdriver")) {
                    this.showMessage("You need a tool to open this.");
                    this.shake(crate);
                    return;
                }

                if (!this.hasItem("keycard")) {
                    this.showMessage("You remove the screws. A scratched keycard is inside.");
                    this.gainItem("keycard");
                    crate.setText("opened crate");
                } else {
                    this.showMessage("The crate is already open.");
                }
            }
        );

        this.addHotspot(
            0.52, 0.31,
            "warning poster",
            "A warning poster is peeling off the wall.",
            () => {
                this.showMessage("The poster says: The truth is behind the screen.");
            }
        );

        this.addHotspot(
            0.63, 0.60,
            "hanging cable",
            "A loose cable hangs from the wall.",
            (cable) => {
                this.showMessage("The cable sparks. The restored power is unstable.");
                this.blink(cable);
            }
        );

        this.lockedExit(
            0.55, 0.77,
            "door to monitors",
            "monitorRoom",
            ["power restored"],
            "The hallway is too dark. Restore the power first.",
            "With the power restored, the monitor room door opens."
        );
    }
}


class MonitorRoom extends Room0Scene {
    constructor() {
        super("monitorRoom", "Monitor Room");
    }

    onEnter() {
        this.addBackground('bgMonitor');
        this.showMessage("Static fills the screens. You can see the rooms you escaped.");

        this.time.delayedCall(20000, () => {
            if (!this.hasItem("keycard")) {
                this.showMessage("You have been stuck here for a while. Maybe you missed something in the Storage Room.");
                this.cameras.main.flash(250, 120, 0, 0);
            }
        });

        this.addHotspot(
            0.22, 0.32,
            "security monitors",
            "The screens show earlier rooms.",
            (monitors) => {
                this.showMessage("One hidden number was visible from the beginning: 7.");
                this.blink(monitors);
            }
        );

        this.addHotspot(
            0.29, 0.52,
            "static screen",
            "One screen keeps flashing.",
            (screen) => {
                if (!this.hasItem("code starts with 7")) {
                    this.showMessage("The static clears: Final code starts with 7.");
                    this.gainItem("code starts with 7");
                } else {
                    this.showMessage("The screen still shows: Final code starts with 7.");
                }
                this.blink(screen);
            }
        );

        this.addHotspot(
            0.42, 0.62,
            "locked drawer",
            "The drawer has a card reader.",
            (drawer) => {
                if (!this.hasItem("keycard")) {
                    this.showMessage("The drawer needs an access card. Go back to the Storage Room and check the sealed crate.");
                    this.shake(drawer);
                    return;
                }

                if (!this.hasItem("final code: 7284")) {
                    this.showMessage("The drawer opens. A folded note says: 7284.");
                    this.gainItem("final code: 7284");
                    drawer.setText("opened drawer");
                } else {
                    this.showMessage("The note still says: 7284.");
                }
            }
        );

        this.addHotspot(
            0.10, 0.20,
            "speaker",
            "A distorted voice comes from the speaker.",
            (speaker) => {
                this.showMessage("The final door does not test strength. It tests memory.");
                this.blink(speaker);
            }
        );

        this.addHotspot(
            0.51, 0.47,
            "tape stack",
            "Several old tapes are stacked on the desk.",
            () => {
                this.showMessage("Most tapes are blank. One label says: Room 0 repeats mistakes.");
            }
        );

        this.addHotspot(
            0.08, 0.82,
            "go back to storage",
            "Maybe you missed an item in the previous room.",
            () => {
                this.showMessage("You return to the Storage Room to look for the missing item.");
                this.time.delayedCall(400, () => {
                    this.gotoScene("storageRoom");
                });
            }
        );

        this.lockedExit(
            0.58, 0.72,
            "final hallway",
            "finalDoor",
            ["final code: 7284"],
            "You do not know the final code yet.",
            "You memorize the code and move toward the final door."
        );
    }
}


class FinalDoor extends Room0Scene {
    constructor() {
        super("finalDoor", "Final Door Chamber");
    }

    onEnter() {
        this.addBackground('bgFinal');
        this.showMessage("This is the final test. Every room gave you part of the answer.");

        this.addHotspot(
            0.53, 0.41,
            "card reader",
            "The reader is still active.",
            (reader) => {
                if (!this.hasItem("keycard")) {
                    this.showMessage("You need a keycard.");
                    this.shake(reader);
                    return;
                }

                if (!this.hasItem("reader activated")) {
                    this.showMessage("The card reader turns green.");
                    this.gainItem("reader activated");
                    reader.setText("reader: green");
                    this.cameras.main.flash(150, 100, 255, 100);
                } else {
                    this.showMessage("The reader is already green.");
                }
            }
        );

        this.addHotspot(
            0.58, 0.52,
            "keypad",
            "The keypad needs a four-digit code.",
            (keypad) => {
                if (!this.hasItem("final code: 7284")) {
                    this.showMessage("You still do not know the code.");
                    this.shake(keypad);
                    return;
                }

                if (!this.hasItem("lock released")) {
                    this.showMessage("You enter 7284. The final lock releases.");
                    this.gainItem("lock released");
                    keypad.setText("7284 accepted");
                    this.cameras.main.flash(150, 255, 255, 180);
                } else {
                    this.showMessage("The keypad already accepted the code.");
                }
            }
        );

        this.addHotspot(
            0.17, 0.24,
            "warning light",
            "The red light keeps flashing.",
            (light) => {
                this.showMessage("Every room gave you part of the answer.");
                this.blink(light);
            }
        );

        this.addHotspot(
            0.36, 0.44,
            "main exit door",
            "This is the final exit.",
            (door) => {
                if (this.hasItem("reader activated") && this.hasItem("lock released")) {
                    this.showMessage("The final door opens.");
                    door.setText("opened exit");
                    this.time.delayedCall(700, () => this.gotoScene("goodEnding"));
                } else {
                    this.showMessage("The door will not open yet.");
                    this.shake(door);
                }
            }
        );

        this.addHotspot(
            0.38, 0.62,
            "force the door",
            "You could try to force it, but that seems risky.",
            () => {
                this.gotoScene("badEnding");
            }
        );
    }
}


class GoodEnding extends Phaser.Scene {
    constructor() {
        super("goodEnding");
    }

    create() {
        this.cameras.main.setBackgroundColor('#050505');

        this.add.text(80, 80, "GOOD ENDING: ESCAPE")
            .setStyle({
                fontSize: '56px',
                color: '#ffffff',
                fontFamily: 'monospace'
            });

        this.add.text(80, 180,
            "The final door unlocks.\n\n" +
            "You step outside into the cold night.\n\n" +
            "The distorted voice says:\n" +
            "\"You observed, remembered, and chose carefully.\"\n\n" +
            "You escaped Room 0 because you solved each test instead of rushing.\n\n" +
            "Click anywhere to restart."
        ).setStyle({
            fontSize: '28px',
            color: '#dddddd',
            fontFamily: 'monospace'
        });

        this.input.on('pointerdown', () => {
            this.scene.start('intro');
        });
    }
}


class BadEnding extends Phaser.Scene {
    constructor() {
        super("badEnding");
    }

    create() {
        this.cameras.main.setBackgroundColor('#120000');

        this.add.text(80, 80, "BAD ENDING: LOCKED IN")
            .setStyle({
                fontSize: '56px',
                color: '#ff7777',
                fontFamily: 'monospace'
            });

        this.add.text(80, 180,
            "You try to force the final door open.\n\n" +
            "The keypad flashes red.\n" +
            "The warning lights turn on.\n" +
            "The room locks down.\n\n" +
            "The distorted voice says:\n" +
            "\"You rushed through the test, but you did not understand it.\"\n\n" +
            "The screen fades to black.\n" +
            "You are trapped inside Room 0.\n\n" +
            "Click anywhere to restart."
        ).setStyle({
            fontSize: '28px',
            color: '#eeeeee',
            fontFamily: 'monospace'
        });

        this.input.on('pointerdown', () => {
            this.scene.start('intro');
        });
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [
        Intro,
        WakeRoom,
        LockPuzzleRoom,
        StorageRoom,
        MonitorRoom,
        FinalDoor,
        GoodEnding,
        BadEnding
    ],
    title: "Room 0: The Final Test",
});