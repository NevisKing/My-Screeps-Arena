import {
  Creep,
  Resource,
  Source,
  Structure,
  StructureContainer,
  StructureSpawn,
  StructureTower
} from "game/prototypes";

declare global {
  namespace NodeJS {
    interface Global {
      ROLES: Map<string, any>;
      INITIALIZE_MAIN: boolean;
      TICK: number;
      MY_CREEPS: Creep[];
      EN_CREEPS: Creep[];
      MY_WORKERS: Creep[];
      EN_WORKERS: Creep[];
      MY_FIGHTERS: Creep[];
      EN_FIGHTERS: Creep[];
      MY_SPAWNS: StructureSpawn[];
      EN_SPAWNS: StructureSpawn[];
      MY_STRUCTS: Structure[];
      EN_STRUCTS: Structure[];
      MY_TOWERS: StructureTower[];
      EN_TOWERS: StructureTower[];
      // var BODY_DROPS: BodyPart[];
      CONTAINERS: StructureContainer[];
      RESOURCES: Resource[];
      SOURCES: Source[];
      generalSpawn: {};
      ROOM_DEFAULT_COSTS: {};
      ENERGY_AVAILABLE: number;
      ENERGY_CAPACITY: number;
      GROUP_NR: number;
      MY_DAMAGE: number;
      EN_DAMAGE: number;
      MY_HEALING: number;
      EN_HEALING: number;
      MY_ECON: number;
      EN_ECON: number;
      UNDER_ATTACK: boolean;
      CREEP_NUM: number;
      EN_AVG_SPEED: number;
    }
  }
}
export default global;
