'use strict';


const errors = require('../errors');
const ValueError = errors.ValueError;

const permissions = {
    denied: parseInt('0000', 2),    // 0
    view:   parseInt('0001', 2),    // 1
    edit:   parseInt('0010', 2),    // 2
    create: parseInt('0100', 2),    // 4
    delete: parseInt('1000', 2),    // 8
};

const knownPermission = function (permission) {
    if (!permissions.hasOwnProperty(permission)) throw new ValueError(`unknown permission: "${permission}"`);
    return true;
};

const getPermission = function (user, item, itemType) {
    // TODO: get from DB
    return permissions.denied;
};

const removePermissionAction = function (oldPerm, remPerm) {
    const addedPerm = addPermissionAction(oldPerm, remPerm);

    return addedPerm ^ remPerm; // bitwise XOR
};

const removePermission = function (user, item, itemType, permissionName) {
    knownPermission(permissionName);
    const hasPerm = getPermission(user, item, itemType);
    const definedPerm = permissions[permissionName];
    const newPerm = removePermissionAction(hasPerm, definedPerm);

    // TODO: write newPerm to DB
    return newPerm === newPerm;
};

const addPermissionAction = function (oldPerm, addPerm) {
    return oldPerm | addPerm; // bitwise OR
};

const addPermission = function (user, item, itemType, permissionName) {
    knownPermission(permissionName);
    const hasPerm = getPermission(user, item, itemType);
    const definedPerm = permissions[permissionName];
    const newPerm = addPermissionAction(hasPerm, definedPerm);

    // TODO: write newPerm to DB
    return newPerm === newPerm;
};

const hasPermissionCheck = function (hasPerm, checkPerm) {
    return (checkPerm & hasPerm) === checkPerm; // bitwise AND
};

const hasPermission = function (user, item, itemType, permissionName) {
    knownPermission(permissionName);
    const hasPerm = getPermission(user, item, itemType);
    const definedPerm = permissions[permissionName];

    return hasPermissionCheck(hasPerm, definedPerm);
};

exports.hasPermission = hasPermission;
exports.addPermission = addPermission;
exports.removePermission = removePermission;