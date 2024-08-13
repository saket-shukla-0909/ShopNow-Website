// Create token and save in the cookie
export default (user, statuscode, res) =>{


    // Create JWT Token
    const Token = user.getJwtToken();

    // Option for cookie
    const options = {
        expires: new Date(Date.now() +process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
    };

    res.status(statusCode).cookie("token", token, options).json({
        token,
    })
}