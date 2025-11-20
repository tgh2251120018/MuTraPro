// src/middleware/authMiddleware.js
export function extractUserInfo(req, res, next) {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const accountType = req.headers['x-account-type'];

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user identification header.' });
  }

  req.user = { id: userId, role: userRole, accountType };
  next();
}

//export function extractUserInfo(req, res, next) {
    //const userId = req.headers['x-user-id'];
    //const userRole = req.headers['x-user-role'];
    //const accountType = req.headers['x-account-type'];

    //if (!userId) {
        //return res.status(401).json({
            //message: 'Unauthorized: Missing user identification header.',
        //});
    //}

    //req.user = {
        //id: userId,
        //role: userRole,
        //accountType: accountType,
    //};

    //next();
//}
