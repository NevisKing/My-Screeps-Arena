/* eslint-disable no-var */
import { ATTACK, BodyPartConstant, HEAL, RANGED_ATTACK, WORK } from "game/constants";
import {
  Creep,
  OwnedStructure,
  Resource,
  Source,
  StructureContainer,
  StructureSpawn,
  StructureTower
} from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { checkCreepSpeed, computeCreepDamage, computeCreepHealing } from "./generalCombat";
import { creepCost } from "./generalSpawn";
// import {  } from "arena";
import { RoleType } from "./utilities";

/**
 * ONLY CALL ON TICK START
 */
export function updateGlobals(): void {
  global.MY_CREEPS = getObjectsByPrototype(Creep).filter(i => i.my);
  global.EN_CREEPS = getObjectsByPrototype(Creep).filter(i => !i.my);
  global.MY_WORKERS = global.MY_CREEPS.filter(i =>
    i.body.some(bodyPart => bodyPart.type === WORK && bodyPart.hits > 0)
  );
  global.EN_WORKERS = global.EN_CREEPS.filter(i =>
    i.body.some(bodyPart => bodyPart.type === WORK && bodyPart.hits > 0)
  );
  global.MY_FIGHTERS = global.MY_CREEPS.filter(i =>
    i.body.some(
      bodyPart =>
        (bodyPart.type === ATTACK || /* bodyPart.type === HEAL || */ bodyPart.type === RANGED_ATTACK) &&
        bodyPart.hits > 0
    )
  );
  global.EN_FIGHTERS = global.EN_CREEPS.filter(i =>
    i.body.some(
      bodyPart =>
        (bodyPart.type === ATTACK || bodyPart.type === HEAL || bodyPart.type === RANGED_ATTACK) && bodyPart.hits > 0
    )
  );
  global.MY_SPAWNS = getObjectsByPrototype(StructureSpawn).filter(i => i.my);
  global.EN_SPAWNS = getObjectsByPrototype(StructureSpawn).filter(i => !i.my);
  global.MY_STRUCTS = getObjectsByPrototype(OwnedStructure).filter(i => i.my);
  global.EN_STRUCTS = getObjectsByPrototype(OwnedStructure).filter(i => !i.my);
  global.MY_TOWERS = getObjectsByPrototype(StructureTower).filter(i => i.my);
  global.EN_TOWERS = getObjectsByPrototype(StructureTower).filter(i => !i.my);
  global.CONTAINERS = getObjectsByPrototype(StructureContainer);
  global.RESOURCES = getObjectsByPrototype(Resource);
  global.SOURCES = getObjectsByPrototype(Source);
  // this is a way to handle arena specific imports, afaik you can not do logic gated importing in js, but by checking if things are defined, you can determine if other logic should execute
  // in this case only in ctf modes this code will execute.
  //
  global.MY_DAMAGE = 0;
  global.EN_DAMAGE = 0;
  global.MY_HEALING = 0;
  global.EN_HEALING = 0;
  global.MY_ECON = 0;
  global.EN_ECON = 0;
  global.MY_CREEPS.forEach((c: Creep) => {
    global.MY_DAMAGE += computeCreepDamage(c);
    global.MY_HEALING += computeCreepHealing(c);
    global.MY_ECON += creepCost(c.body);
  });
  global.EN_CREEPS.forEach((c: Creep) => {
    global.EN_DAMAGE += computeCreepDamage(c);
    global.EN_HEALING += computeCreepHealing(c);
    global.EN_ECON += creepCost(c.body);
  });

  global.UNDER_ATTACK = global.EN_FIGHTERS.some((creep: Creep) => {
    return creep.x < global.MY_SPAWNS[0].x + 8 && creep.x > global.MY_SPAWNS[0].x - 8;
  });
  let temp = 0;
  global.EN_FIGHTERS.forEach((c: Creep) => {
    temp += checkCreepSpeed(c);
  });
  global.EN_AVG_SPEED = temp / global.EN_FIGHTERS.length;
}

export function BulkParts(part: BodyPartConstant, count: number): BodyPartConstant[] {
  return Array(count).fill(part) as BodyPartConstant[];
}

export function CountCreeps(creepType: RoleType) {
  const myCreeps = getObjectsByPrototype(Creep).filter(i => i.my && i.class && i.class === creepType);
  return myCreeps.length;
}
