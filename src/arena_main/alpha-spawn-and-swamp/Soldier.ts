import { ATTACK, ERR_NOT_IN_RANGE, MOVE, TOUGH } from "game/constants";
import { Creep, StructureSpawn } from "game/prototypes";
import { findClosestByPath } from "game/utils";
import { flee } from "../SharedModules/generalCombat";
import { GeneralSpawn } from "../SharedModules/generalSpawn";
import { BulkParts } from "../SharedModules/globals";
import { Role } from "../SharedModules/utilities";

export class Soldier extends Role {
  public Run(creep: Creep): void {
    if(!creep.waveActive && !global.UNDER_ATTACK){
      creep.moveTo({ x: global.MY_SPAWNS[0].x, y: global.MY_SPAWNS[0].y - 7 });
      return;
    }

    const nearestEnemy = findClosestByPath(creep, global.EN_CREEPS);
    const enemySpawn = global.EN_SPAWNS[0];
    let closer: Creep | StructureSpawn = enemySpawn;
    if (nearestEnemy !== null) {
      closer = findClosestByPath(creep, [nearestEnemy, enemySpawn]);
    }

    if (creep.attack(closer) === ERR_NOT_IN_RANGE) {
      creep.moveTo(closer);
    }

    if (creep.hits < creep.hitsMax / 2) {
      flee(creep, global.EN_FIGHTERS, 3);
      return;
    }
  }

  public Spawn(spawner: StructureSpawn, scaleUp = true): void {
    const body = BulkParts(TOUGH,0).concat(BulkParts(ATTACK, 1)).concat(BulkParts(MOVE,2));

    const creep = new GeneralSpawn().spawnCreep(spawner, body, "Soldier", scaleUp);
    if (creep !== undefined) {
      creep.waveActive = false;
    }
  }
}
