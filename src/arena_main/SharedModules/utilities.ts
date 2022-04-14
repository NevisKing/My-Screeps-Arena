import { RESOURCE_ENERGY, TERRAIN_WALL } from "game/constants";
import { FindPathOpts, searchPath } from "game/path-finder";
import {
  ConstructionSite,
  Creep,
  RoomPosition,
  Structure,
  StructureContainer,
  StructureRampart,
  StructureSpawn
} from "game/prototypes";
import { createConstructionSite, findInRange, getDirection, getObjectsByPrototype, getTerrainAt } from "game/utils";

export type RoleType = "Farmer" | "Trader" | "Soldier" | "BarKeep" | "Medic" | "DragonFly" | "Scorpion" | "Wasp";

declare module "game/prototypes" {
  interface Creep {
    class: RoleType;
    spawning: number;
    waveActive: boolean;
  }
  interface StructureSpawn {
    spawning: number;
  }
}

export function constructAndBuild(creep: Creep, position: RoomPosition, structureType: any) {
  const strucs = findInRange(
    position,
    getObjectsByPrototype(Structure).filter(i => i instanceof structureType),
    0
  );
  if (strucs.length > 0) {
    return false;
  }
  const sites = findInRange(
    position,
    getObjectsByPrototype(ConstructionSite).filter(i => i.structure && i.structure instanceof structureType),
    0
  );
  if (sites.length === 0) {
    createConstructionSite(position.x, position.y, structureType);
  } else {
    creep.build(sites[0]);
  }
  return true;
}

export function isWalkable(position: RoomPosition, ignoreCreeps = true, myFlag = true) {
  const nonWalkables = findInRange(position, getObjectsByPrototype(Structure), 0).filter(
    i => !(i instanceof StructureContainer) && (!(i instanceof StructureRampart) || i.my === myFlag)
  );
  const testTerrain = getTerrainAt(position);
  if (testTerrain === TERRAIN_WALL || nonWalkables.length > 0) {
    return false;
  }
  if (!ignoreCreeps && findInRange(position, getObjectsByPrototype(Creep), 0).length > 0) {
    return false;
  }
  return true;
}

/**
export function verboseCostMatrix(plainCost = 2, swampCost = 10) {
  if (typeof ROOM_DEFAULT_COSTS === "undefined") {
    ROOM_DEFAULT_COSTS = {};
  } else {
    return ROOM_DEFAULT_COSTS;
  }

  const costs = new CostMatrix();
  console.log("computing default room costs");
  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      const tempTerrain = getTerrainAt({ x, y });
      if (tempTerrain === TERRAIN_WALL) {
        costs.set(x, y, 255);
      } else if (tempTerrain === TERRAIN_SWAMP) {
        costs.set(x, y, swampCost);
      } else {
        costs.set(x, y, plainCost);
      } // plains
    }
  }
  global.ROOM_DEFAULT_COSTS = costs;
  return costs;
}*/

export function moveToWithVisual(creep: Creep, target: RoomPosition, options: FindPathOpts | undefined) {
  const result = searchPath(creep, target, options);
  if (result.path.length > 0) {
    const direction = getDirection(result.path[0].x - creep.x, result.path[0].y - creep.y);
    creep.move(direction);

    result.path.forEach(pos => {
      // Visual.circle(pos);
    });
  }
}
/**
 function displayCostMatrix(costMatrix: CostMatrix, locationOfInterest: RoomPosition, radius = 5) {
  // global.text(text,{x:creep.x,y:creep.y});
  for (let x = -radius; x < radius; x += 1) {
    for (let y = -radius; y < radius; y += 1) {
      const tempPos = { x: locationOfInterest.x + x, y: locationOfInterest.y + y };
      if (!InBounds(tempPos)) {
        continue;
      }
      text(costMatrix.get(tempPos.x, tempPos.y), tempPos, { font: 0.5 });
    }
  }
}*/

// these functions are global and not neccesarily associated with combat (they could really go anywhere, but ya)
export function InBounds(position: RoomPosition) {
  if (position.x < 0 || position.x > 99 || position.y < 0 || position.y > 99) {
    return false;
  } else {
    return true;
  }
}

export abstract class Role {
  abstract Run(creep: Creep): void;
  abstract Spawn(spawner: StructureSpawn): void;
}

export function drain(creep: Creep, container: StructureContainer) {
  const t = creep.store.getUsedCapacity(RESOURCE_ENERGY);
  if (t !== null && t > 0) {
    creep.drop(RESOURCE_ENERGY);
  } else {
    creep.withdraw(container, RESOURCE_ENERGY);
  }
}
