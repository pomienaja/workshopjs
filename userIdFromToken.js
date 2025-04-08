var jwt=require('jsonwebtoken');

const getUserIdFromToken = (token) => {
    const decoded = jwt.verify(token,`${process.env.JWT_SECRET}`);
    return decoded.userId;
}
module.exports=getUserIdFromToken;
