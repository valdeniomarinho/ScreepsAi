var target_count_2 = 0;
var room_dest;

var roleBuilder = {

    /**
     * @param {Creep}
     *            creep *
     */
    run: function (creep) {
        
        var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        var const_sites = creep.room.find(FIND_CONSTRUCTION_SITES)
        var const_sites_sorted = _.sortBy(const_sites, s => s.progress)
        
        if (!const_sites_sorted.length > 1) {
            targets = creep.pos.findClosestByPath(const_sites_sorted)
        }
        
        
        
        var targetE = creep.pos.findClosestByPath(FIND_STRUCTURES, {
             filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION) &&
                    structure.energy < structure.energyCapacity;
                }
        });

        if (creep.memory.room_dest != null && creep.room.name != creep.memory.room_dest) {
            room_dest = creep.memory.room_dest;
            var roomName = String(room_dest);
            creep.moveTo(new RoomPosition(25, 25, roomName));
        } else {

            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
            }

            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }

            if (creep.memory.building) {
                if (targets) {
                    creep.say("⛏")
                     
                    if (creep.build(targets) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else if (targetE) {
                    if (creep.transfer(targetE, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetE, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else {
                var sources = creep.pos.findClosestByPath(FIND_SOURCES);

                if ((creep.room.energyAvailable > 300 && targets && creep.room.storage != undefined) && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                    if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    creep.say("⛏")
                    if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;