import jwt from 'jsonwebtoken';
export var generateToken = function (payload, expired) {
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: expired,
    });
};
//# sourceMappingURL=tokens.js.map