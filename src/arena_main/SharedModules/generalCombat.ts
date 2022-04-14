import { ATTACK, BodyPartConstant, CARRY, HEAL, MOVE, RANGED_ATTACK } from "game/constants";
import { searchPath } from "game/path-finder";
import { Creep, StructureExtension, StructureSpawn } from "game/prototypes";
import { findInRange, getDirection } from "game/utils";

export function computeCreepHealing(creep: Creep) {
  let totalHeal = 0;
  creep.body.forEach(part => {
    if (part.hits > 0) {
      if (part.type === HEAL) {
        totalHeal += 12;
      }
    }
  });
  return totalHeal;
}

export function computeCreepDamage(creep: Creep) {
  let totalDamage = 0;
  creep.body.forEach(part => {
    if (part.hits > 0) {
      if (part.type === ATTACK) {
        totalDamage += 30;
      } else if (part.type === RANGED_ATTACK) {
        totalDamage += 10;
      }
    }
  });
  return totalDamage;
}

export function checkCreepSpeed(creep: Creep) {
  let workingMoveParts = 0;
  let fatigueParts = 0;
  let carryFatigue = 0;
  if (creep.store !== null) {
    carryFatigue = 2 * Math.ceil((creep.store.getUsedCapacity() as number) / 50);
  }
  creep.body.forEach(part => {
    if (part.hits > 0 && part.type === MOVE) {
      workingMoveParts++;
    } else if (part.type !== MOVE && part.type !== CARRY) {
      fatigueParts++;
    }
  });
  const totalFatigue = fatigueParts + carryFatigue;
  if (totalFatigue === 0) {
    return 100;
  }
  const speed = workingMoveParts / totalFatigue;
  return speed;
}

export function checkBodySpeed(body: BodyPartConstant[]) {
  let workingMoveParts = 0;
  let fatigueParts = 0;
  const carryFatigue = 0;

  body.forEach(part => {
    if (part === MOVE) {
      workingMoveParts++;
    } else if (part !== CARRY) {
      fatigueParts++;
    }
  });
  const totalFatigue = fatigueParts + carryFatigue;
  if (totalFatigue === 0) {
    return 100;
  }
  const speed = workingMoveParts / totalFatigue;
  return speed;
}

export function simpleRangedAttack(creep: Creep, target: Creep | StructureExtension | StructureSpawn) {
  const meleRangeEnemies = findInRange(creep, global.EN_CREEPS, 1);
  if (meleRangeEnemies.length > 0) {
    creep.rangedMassAttack();
    return;
  }

  let longRangeEnemies = findInRange(creep, global.EN_CREEPS, 3) as (Creep | StructureExtension | StructureSpawn)[];
  if (longRangeEnemies.length > 0) {
    creep.rangedAttack(longRangeEnemies[0]);
  }
  longRangeEnemies = findInRange(creep, [target], 3);
  if (longRangeEnemies.length > 0) {
    creep.rangedAttack(longRangeEnemies[0]);
  }
}

export function flee(creep: Creep, targets: Creep[], range: number) {
  const result = searchPath(
    creep,
    targets.map(i => ({ pos: i, range })),
    { flee: true }
  );
  if (result.path.length > 0) {
    const direction = getDirection(result.path[0].x - creep.x, result.path[0].y - creep.y);
    creep.move(direction);
  }
}
