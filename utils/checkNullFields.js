const checkNullFields = (...args) => {
    return args.some(arg => !arg);
}

module.exports = checkNullFields;