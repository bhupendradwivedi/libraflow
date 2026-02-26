export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateAuthToken();
    res.status(statusCode).cookie('token',token, {
        expires: new Date (Date.now() + process.env.COOKIE_EXP* 24 * 60 * 60 * 1000),
        httpOnly: true,
    })
    .json({
        success: true,
        message,
        token,
        user,
    })

    

}
