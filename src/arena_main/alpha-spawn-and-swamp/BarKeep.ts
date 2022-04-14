import { CARRY, ERR_NOT_IN_RANGE, MOVE, RESOURCE_ENERGY } from "game/constants";
import { Creep, StructureContainer, StructureSpawn } from "game/prototypes";
import { findClosestByPath, findClosestByRange, getObjectsByPrototype, getRange } from "game/utils";
import { GeneralSpawn } from "../SharedModules/generalSpawn";
import { BulkParts } from "../SharedModules/globals";
import { Role } from "../SharedModules/utilities";

export class BarKeep extends Role {
  public Run(creep: Creep): void {
    if (creep.store !== null && (creep.store.getUsedCapacity() as number) > 0) {
      const nearestSpawn = findClosestByPath(creep, global.MY_SPAWNS);
      if (creep.transfer(nearestSpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(nearestSpawn);
      }

      return;
    }

    const containers = getObjectsByPrototype(StructureContainer)
      .filter(i => {
        return ((i.store.getUsedCapacity(RESOURCE_ENERGY) as number) > 0 && (i.x > 90 || i.x < 10));
      })
      .filter(i => {
        return getRange(creep, i) < 5;
      });
    if (containers.length > 0) {
      let nearestContainer = findClosestByPath(creep, containers);
      if (!nearestContainer) {
        nearestContainer = findClosestByRange(creep, containers);
      }

      if (creep.withdraw(nearestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(nearestContainer);
      }
    } else {
      creep.class = "Trader";
    }
  }
  public Spawn(spawner: StructureSpawn, scaleUp = true): void {
    const body = BulkParts(MOVE, 3).concat(BulkParts(CARRY, 3));

    const creep = new GeneralSpawn().spawnCreep(spawner, body, "BarKeep", scaleUp);
  }
}
