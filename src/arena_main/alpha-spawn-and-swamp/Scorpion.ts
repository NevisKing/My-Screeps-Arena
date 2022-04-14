import { ATTACK, BodyPartConstant, ERR_NOT_IN_RANGE, MOVE, RANGED_ATTACK, TOUGH } from "game/constants";
import { Creep, StructureSpawn } from "game/prototypes";
import { getRange } from "game/utils";
import { flee, simpleRangedAttack } from "../SharedModules/generalCombat";
import { GeneralSpawn } from "../SharedModules/generalSpawn";
import { BulkParts } from "../SharedModules/globals";
import { Role } from "../SharedModules/utilities";

export class Scorpion extends Role {
  public Run(creep: Creep): void {
    if (!creep.waveActive && !global.UNDER_ATTACK) {
      creep.moveTo({ x: global.MY_SPAWNS[0].x, y: global.MY_SPAWNS[0].y - 5 });
      return;
    }
    const enCreep = creep.findClosestByPath(global.EN_CREEPS);
    const melee = creep.findClosestByRange(
      global.EN_FIGHTERS.filter((c: Creep) => {
        return c.body.some((b: { type: BodyPartConstant; hits: number }) => {
          return b.type === ATTACK;
        });
      })
    );
    if (enCreep !== null) {
      simpleRangedAttack(creep, enCreep);
    } else {
      if (creep.rangedAttack(global.EN_SPAWNS[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(global.EN_SPAWNS[0]);
      }
    }

    if (melee && (getRange(creep, melee) < 3 || (getRange(creep, melee) < 5 && creep.hits < creep.hitsMax - 500))) {
      flee(creep, global.EN_FIGHTERS, 4);
    } else {
      if (enCreep) {
        if(getRange(creep, enCreep) < getRange(creep, global.EN_SPAWNS[0])){
          if(getRange(creep, enCreep) > 3){
            creep.moveTo(enCreep);
          }

        }
        else{
          creep.moveTo(global.EN_SPAWNS[0]);
        }
      }
    }
  }
  public Spawn(spawner: StructureSpawn, scaleUp = true): void {
    const body = BulkParts(TOUGH,0).concat(BulkParts(MOVE,2)).concat(BulkParts(RANGED_ATTACK, 1));

    const creep = new GeneralSpawn().spawnCreep(spawner, body, "Scorpion", scaleUp);
    if (creep !== undefined) {
      creep.waveActive = false;
    }
  }
}
