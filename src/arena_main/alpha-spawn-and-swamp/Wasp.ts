import { HEAL, MOVE, RANGED_ATTACK } from "game/constants";
import { Creep, StructureExtension, StructureSpawn } from "game/prototypes";
import { findInRange, getObjectsByPrototype, getRange } from "game/utils";
import { flee, simpleRangedAttack } from "../SharedModules/generalCombat";
import { GeneralSpawn } from "../SharedModules/generalSpawn";
import { BulkParts } from "../SharedModules/globals";
import { Role } from "../SharedModules/utilities";

export class Wasp extends Role {
  public Run(creep: Creep): void {
    let healTarget: Creep;
    let target: Creep | StructureExtension | StructureSpawn;

    const targets = (global.EN_SPAWNS as (Creep | StructureExtension | StructureSpawn)[])
      .concat(
        getObjectsByPrototype(StructureExtension).filter((t: StructureExtension) => {
          return !t.my;
        })
      )
      .concat(global.EN_CREEPS);

    // eslint-disable-next-line prefer-const
    target = creep.findClosestByPath(targets);

    simpleRangedAttack(creep, target);
    if (getRange(creep, target) > 3) {
      creep.moveTo(target);
    }

    // eslint-disable-next-line prefer-const
    healTarget = creep.findClosestByRange(
      findInRange(
        creep,
        global.MY_CREEPS.filter((i: Creep) => {
          return i.hits < i.hitsMax;
        }),
        3
      )
    );

    if (healTarget) {
      if (getRange(creep, healTarget) <= 1) {
        creep.heal(healTarget);
      } else {
        if(!target){
          creep.rangedHeal(healTarget);
        }
      }
    } else {
      creep.heal(creep);
    }
    const anyCreep = creep.findClosestByRange(global.EN_FIGHTERS);
    if (anyCreep && (getRange(creep, anyCreep) < 3 || creep.hits < creep.hitsMax)) {
      flee(creep, global.EN_FIGHTERS, 5);
    }
  }

  public Spawn(spawner: StructureSpawn, scaleUp = true): void {
    const body = BulkParts(MOVE, 9)
      .concat(BulkParts(RANGED_ATTACK, 1))
      .concat(BulkParts(MOVE, 1))
      .concat(BulkParts(HEAL, 1));

    const creep = new GeneralSpawn().spawnCreep(spawner, body, "Wasp", scaleUp);
  }
}
