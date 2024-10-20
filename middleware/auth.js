const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
   
    const accessToken = req.cookies.accessToken
    
    

    if(!accessToken) {
        console.log("No accessToken");
        return refresh(req, res, next)
        
    }
    

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                if(err.name === "TokenExpiredError") {
                    return refresh(req, res, next)
                    
                } 
                
                return res.status(403).json({ success: false, message: "Forbidden" })
            }
            console.log(decoded.userInfo.role);

            if (!req.body.userInfo) {
                req.body.userInfo = {};
            }
            
            req.body.userInfo.role = decoded.userInfo.role
            console.log(req.body.userInfo.role);
            
            next()
        }
    )
}

const refresh = (req, res, next) => {
   const refreshToken = req.cookies.refreshToken
  

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: "No Refresh token" });
            }

            const accessToken = jwt.sign(
                {userInfo:{ id: decoded._id, role: decoded.role }},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1m" }
            )

            res.cookie('accessToken', accessToken, {
                maxAge: 1 * 60 * 1000,
                httpOnly: true,
                //secure: true, // cookie will be sent only over HTTPS
                //sameSite: "none"
            });

            if (!req.body.userInfo) {
                req.body.userInfo = {};
            }

            req.body.userInfo.role = decoded.userInfo.role

            next()
        }
    )

}
module.exports = authMiddleware