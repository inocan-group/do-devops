"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.play = exports.SoundEffect = void 0;
require("./play-sound");
const play_sound_1 = require("play-sound");
var SoundEffect;
(function (SoundEffect) {
    SoundEffect["glass"] = "glass";
    SoundEffect["laser"] = "laser";
    SoundEffect["sadTrombone"] = "sadTrombone";
    SoundEffect["scream"] = "scream";
})(SoundEffect = exports.SoundEffect || (exports.SoundEffect = {}));
/**
 * Plays sounds effects but is dependant on a OS level player.
 * For **MacOS** the `afplay` is the default. For other OS's it
 * is `aplay` but if you're on Linux it may be better to use
 * `mpg123` or `mpg321`.
 */
function play(effect = "glass") {
    return __awaiter(this, void 0, void 0, function* () {
        const player = play_sound_1.default();
        player.play(`./src/shared/sound/${effect}.m4a`);
    });
}
exports.play = play;
