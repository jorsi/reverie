const Entity = require('../../common/entities/entity');
const Component = require('../../common/components/component');

/*
 *  Spirit Entity
 */

Entity.register('spirit', [
    'position',
    'transform',
    'move'
]);