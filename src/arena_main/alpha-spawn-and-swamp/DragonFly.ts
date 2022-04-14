import { ATTACK, ERR_NOT_IN_RANGE, HEAL, MOVE, RANGED_ATTACK } from "game/constants";
import { Creep, StructureSpawn } from "game/prototypes";
import { getRange } from "game/utils";
import { flee, simpleRangedAttack } from "../SharedModules/generalCombat";
import { GeneralSpawn } from "../SharedModules/generalSpawn";
import { BulkParts } from "../SharedModules/globals";
import { Role } from "../SharedModules/utilities";

export class DragonFly extends Role {
  public Run(creep: Creep): void {
    creep.heal(creep);
    const anyCreep = creep.findClosestByRange(global.EN_FIGHTERS);
    const target = creep.findClosestByRange(
      global.EN_CREEPS.filter(t => {
        return (
          t.x < 86 &&
          t.x > 13 &&
          !t.body.some(bodyPart => {
            return (
              (bodyPart.type === ATTACK || bodyPart.type === HEAL || bodyPart.type === RANGED_ATTACK) &&
              bodyPart.hits > 0
            );
          })
        );
      })
    );
    if (target !== null) {
      simpleRangedAttack(creep, target);
      // creep.moveTo(global.EN_SPAWNS[0]);
    } else {
      simpleRangedAttack(creep, anyCreep as Creep);
      if (creep.rangedAttack(global.EN_SPAWNS[0]) === ERR_NOT_IN_RANGE) {
        // creep.moveTo(global.EN_SPAWNS[0]);
      }
    }
    creep.moveTo({ x: 50, y: 50 });
    if (anyCreep && (getRange(creep, anyCreep) < 5 || creep.hits < creep.hitsMax - 100)) {
      flee(creep, global.EN_FIGHTERS, 5);
    } else {
      if (target) {
        creep.moveTo(target);
      }
    }
  }

  public Spawn(spawner: StructureSpawn, scaleUp = true): void {
    const body = BulkParts(RANGED_ATTACK, 1).concat(BulkParts(MOVE, 9).concat(BulkParts(HEAL, 1)));

    const creep = new GeneralSpawn().spawnCreep(spawner, body, "DragonFly", scaleUp);
  }
}
