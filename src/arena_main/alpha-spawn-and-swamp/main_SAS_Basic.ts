import { Creep } from "game/prototypes";
import { GeneralSpawn, updateSpawning } from "../SharedModules/generalSpawn";
import { CountCreeps } from "../SharedModules/globals";
import { BarKeep } from "./BarKeep";
import { DragonFly } from "./DragonFly";
import { Medic } from "./Medic";
import { Scorpion } from "./Scorpion";
import { Soldier } from "./Soldier";
import { Trader } from "./Trader";
import { Wasp } from "./Wasp";

export function SasBasicMain() {
  if (global.TICK === 1) {
    global.ROLES.set("Trader", new Trader());
    global.ROLES.set("BarKeep", new BarKeep());
    global.ROLES.set("Soldier", new Soldier());
    global.ROLES.set("Medic", new Medic());
    global.ROLES.set("DragonFly", new DragonFly());
    global.ROLES.set("Scorpion", new Scorpion());
    global.ROLES.set("Wasp", new Wasp());
    global.CREEP_NUM = 0;
    new BarKeep().Spawn(global.MY_SPAWNS[0], false);

  }
  if (
    global.MY_DAMAGE + global.MY_HEALING - 400 > global.EN_DAMAGE + global.EN_HEALING ||
    global.MY_ECON < global.EN_ECON - 2000 ||
    global.TICK === 1300 ||
    global.UNDER_ATTACK
  ) {
    global.MY_FIGHTERS.forEach((creep: Creep) => {
      creep.waveActive = true;
    });
  }

  const spawn = new GeneralSpawn();
  if (!spawn.isSpawnerBusy(global.MY_SPAWNS[0])) {
    if (CountCreeps("Trader") < global.CREEP_NUM) {
      new Trader().Spawn(global.MY_SPAWNS[0]);
    } else if (CountCreeps("Wasp") < global.CREEP_NUM) {
      new Wasp().Spawn(global.MY_SPAWNS[0]);
    } else if (CountCreeps("Soldier") < global.CREEP_NUM) {
      new Soldier().Spawn(global.MY_SPAWNS[0]);
    } else if (CountCreeps("Medic") < global.CREEP_NUM) {
      new Medic().Spawn(global.MY_SPAWNS[0]);
    } else if (CountCreeps("Scorpion") < global.CREEP_NUM) {
      new Scorpion().Spawn(global.MY_SPAWNS[0]);
    } else {
      global.CREEP_NUM++;
    }
  }




  updateSpawning();
}
