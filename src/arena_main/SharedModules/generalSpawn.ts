/* eslint-disable no-var */
import { BODYPART_COST, BodyPartConstant, RESOURCE_ENERGY } from "game/constants";
import { StructureExtension, StructureSpawn } from "game/prototypes";
import { RoleType } from "./utilities";

export function updateSpawning() {
  global.ENERGY_AVAILABLE = SpawnEnergyAvailable();
  global.ENERGY_CAPACITY = SpawnEnergyCapacity();

  global.MY_SPAWNS.forEach(spawner => {
    if (spawner.spawning === undefined) {
      spawner.spawning = 1;
    }
    spawner.spawning -= 1;
    console.log("spawner spawning timer: " + spawner.spawning.toString());
  });

  global.MY_CREEPS.forEach(creep => {
    if (creep.spawning === undefined) {
      creep.spawning = -1;
    }
    if (creep.spawning > 0) {
      creep.spawning -= 1;
    }
  });
}

export function SpawnEnergyAvailable() {
  const allSpawnStrucs = global.MY_STRUCTS.filter(
    i => i instanceof StructureSpawn || i instanceof StructureExtension
  ) as (StructureSpawn | StructureExtension)[];
  let totalEnergy = 0;
  allSpawnStrucs.forEach(struct => {
    totalEnergy += struct.store.energy;
  });
  return totalEnergy;
}

export function SpawnEnergyCapacity() {
  const allSpawnStrucs = global.MY_STRUCTS.filter(
    i => i instanceof StructureSpawn || i instanceof StructureExtension
  ) as (StructureSpawn | StructureExtension)[];
  let totalCapacity = 0;
  allSpawnStrucs.forEach(struct => {
    const a = struct.store.getCapacity(RESOURCE_ENERGY);
    if (a !== null) {
      totalCapacity += a;
    }
  });
  return totalCapacity;
}

export class GeneralSpawn {
  public spawnCreep(
    spawner: StructureSpawn,
    creepBody: BodyPartConstant[],
    role: RoleType,
    scaleUp = true,
    outspeed = true
  ) {
    /*
    if (outspeed) {
      while (checkBodySpeed(creepBody) < global.EN_AVG_SPEED) {
        creepBody = ([MOVE] as BodyPartConstant[]).concat(creepBody);
      }
    }*/
    if (scaleUp) {
      const bodyCopy = creepBody;
      const max = SpawnEnergyCapacity();
      while (this.creepCost(creepBody.concat(bodyCopy)) < max) {
        creepBody = creepBody.concat(bodyCopy);
      }
    }

    var spawnObj = spawner.spawnCreep(creepBody);

    if (spawnObj.object) {
      console.log(role + " spawn success");
    } else {
      if (spawnObj.error) {
        console.log(role + " spawnError: " + spawnObj.error.toString());
      }
      return;
    }

    global.ENERGY_AVAILABLE -= this.creepCost(creepBody);
    spawner.spawning = creepBody.length * 3;

    spawnObj.object.class = role;
    spawnObj.object.spawning = creepBody.length * 3 - 1;
    return spawnObj.object;
  }

  public isSpawnerBusy(spawner: StructureSpawn) {
    if (spawner.spawning > 0) {
      return true;
    } else {
      return false;
    }
  }

  public creepCost(creepBodyDesign: BodyPartConstant[]) {
    let totalCost = 0;
    creepBodyDesign.forEach(part => {
      totalCost += BODYPART_COST[part];
    });
    return totalCost;
  }
}
export function creepCost(body: { type: BodyPartConstant; hits: number }[]) {
  let totalCost = 0;
  body.forEach(part => {
    totalCost += BODYPART_COST[part.type];
  });
  return totalCost;
}
