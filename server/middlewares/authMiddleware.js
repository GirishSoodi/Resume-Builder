import jwt from 'jsonwebtoken'

const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = decoded.userId;

      next();

    } catch (error) {
      console.error('Not authorized, token failed')
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

export default protect;  

