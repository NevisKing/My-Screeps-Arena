import { HEAL, MOVE } from "game/constants";
import { Creep, StructureSpawn } from "game/prototypes";
import { findClosestByPath, getRange } from "game/utils";
import { flee } from "../SharedModules/generalCombat";
import { GeneralSpawn } from "../SharedModules/generalSpawn";
import { BulkParts } from "../SharedModules/globals";
import { Role } from "../SharedModules/utilities";

export class Medic extends Role {
  public Run(creep: Creep): void {
    if (creep.hits < creep.hitsMax) {
      creep.heal(creep);
      flee(creep, global.EN_FIGHTERS, 5);
      return;
    }

    let target = global.MY_CREEPS.filter(i => {
      return i.hits < i.hitsMax && getRange(creep, i) < 10;
    }).sort((a, b) =>  a.hits - b.hits)[0];

    if (target === null || target === undefined) {
      target = findClosestByPath(
        creep,
        global.MY_CREEPS.filter(i => {
          return i.class === "Soldier" || i.class === "Scorpion";
        })
      );
    }
    if (target === null) {
      creep.moveTo(global.MY_SPAWNS[0]);
      return;
    }

    creep.moveTo(target);

    if (target && getRange(creep, target) < 2) {
      creep.heal(target);
    } else {
      creep.rangedHeal(target);
    }

    const enemy = creep.findClosestByRange(global.EN_FIGHTERS);
    if (enemy !== null && getRange(creep, enemy) < 4) {
      flee(creep, global.EN_FIGHTERS, 5);
    }
  }
  public Spawn(spawner: StructureSpawn, scaleUp = true): void {
    const body = BulkParts(MOVE, 5).concat(BulkParts(HEAL, 1));

    const creep = new GeneralSpawn().spawnCreep(spawner, body, "Medic", scaleUp);
  }
}
