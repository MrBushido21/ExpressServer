import jwt  from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.token || '')

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secretKey')
            req.userId = decoded._id
            next()
        } catch(e) {
            return res.status(403).json({
                message: 'Дуля тобі'
            })
        }
    } else {
       return res.status(403).json({
            message: 'Дуля тобі'
        })
    }
}