import { CARRY, ERR_NOT_IN_RANGE, MOVE, RESOURCE_ENERGY } from "game/constants";
import { Creep, Resource, StructureContainer, StructureSpawn } from "game/prototypes";
import { findClosestByPath, findClosestByRange, getObjectsByPrototype, getRange } from "game/utils";
import { flee } from "../SharedModules/generalCombat";
import { GeneralSpawn } from "../SharedModules/generalSpawn";
import { BulkParts } from "../SharedModules/globals";
import { drain, Role } from "../SharedModules/utilities";

export class Trader extends Role {
  public Run(creep: Creep): void {
    const closestEnergy = creep.findClosestByPath(getObjectsByPrototype(Resource));
    const tempContainers = getObjectsByPrototype(StructureContainer).filter(
      i =>
        i.x < 90 &&
        i.x > 10 &&
        i.store.getUsedCapacity(RESOURCE_ENERGY) !== null &&
        (i.store.getUsedCapacity(RESOURCE_ENERGY) as number) > 0
    );
    let nearestContainer = findClosestByPath(creep, tempContainers);
    if (!nearestContainer) {
      nearestContainer = findClosestByRange(creep, tempContainers);
    }

    if (getRange(creep, nearestContainer) < 2) {
      drain(creep, nearestContainer);
    }

    if (getRange(nearestContainer, creep) > 1)
      if (
        creep.store !== null &&
        (creep.store.getUsedCapacity() as number) > (creep.store.getCapacity() as number) - 50
      ) {
        const nearestSpawn = findClosestByPath(creep, global.MY_SPAWNS);
        if (creep.transfer(nearestSpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(nearestSpawn);
        }
      } else {
        if (tempContainers.length > 0) {
          if (closestEnergy === null || getRange(nearestContainer, creep) <= getRange(closestEnergy, creep)) {
            creep.moveTo(nearestContainer);
          } else {
            if (creep.pickup(closestEnergy) === ERR_NOT_IN_RANGE) {
              creep.moveTo(closestEnergy);
            }
          }
        }
      }

    const enemy = findClosestByRange(creep, global.EN_FIGHTERS);
    if (enemy && getRange(creep, enemy) < 5) {
      flee(creep, global.EN_FIGHTERS, 5);
    }
  }
  public Spawn(spawner: StructureSpawn, scaleUp = true): void {
    const body = BulkParts(MOVE, 2).concat(BulkParts(CARRY, 1));

    const creep = new GeneralSpawn().spawnCreep(spawner, body, "Trader", scaleUp);
  }
}
