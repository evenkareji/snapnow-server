export var generateCode = function (length) {
    var code = '';
    var schema = '0123456789';
    for (var i = 0; i < length; i++) {
        code += schema.charAt(Math.random() * schema.length);
    }
    return code;
};
//# sourceMappingURL=generateCode.js.map