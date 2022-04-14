/* eslint-disable no-var */
/* eslint-disable sort-imports */

import { arenaInfo } from "game";
import { Creep } from "game/prototypes";
import { CtfBasicMain } from "./alpha-capture-the-flag/main_CTF_Basic";
import { CacBasicMain } from "./alpha-collect-and-control/main_CAC_Basic";
import { SasBasicMain } from "./alpha-spawn-and-swamp/main_SAS_Basic";
import { updateGlobals } from "./SharedModules/globals";
import { Role } from "./SharedModules/utilities";

global.TICK = 1;
export function loop(): void {
  updateGlobals();
  console.log("-------------------tick: " + global.TICK.toString());
  console.log("STAT    |    ME    |    ENEMY");
  console.log("ECON:       " + global.MY_ECON.toString() + "       " + global.EN_ECON.toString());
  console.log("ECON/T:     " + (global.MY_ECON / global.TICK).toPrecision(3).toString() + "       " + (global.EN_ECON/ global.TICK).toPrecision(3).toString());
  console.log("DAMAGE:     " + global.MY_DAMAGE.toString() + "       " + global.EN_DAMAGE.toString());
  console.log("HEALING:    " + global.MY_HEALING.toString() + "       " + global.EN_HEALING.toString());
  if (global.TICK === 1) {
    global.ROLES = new Map<string, any>();
    global.MY_CREEPS = new Array<Creep>();
    global.GROUP_NR = 0;
  }

  if (arenaInfo.name === "Capture the Flag" && arenaInfo.level === 1) {
    console.log("ctf lvl 1");
    CtfBasicMain();
  } else if (arenaInfo.name === "Spawn and Swamp" && arenaInfo.level === 1) {
    console.log("sas lvl 1");
    SasBasicMain();
  } else if (arenaInfo.name === "Collect and Control" && arenaInfo.level === 1) {
    console.log("cac lvl 1");
    CacBasicMain();
  }

  global.MY_CREEPS.forEach((creep: Creep) => {
    if (creep.class === undefined) {
      console.log("Creep confused!");

      return;
    }
    (global.ROLES.get(creep.class) as Role).Run(creep);
  });

  global.TICK++;
}
