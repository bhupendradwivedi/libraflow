export const sendToken = (user, statusCode, message, res) => {
    const accessToken = user.generateAuthToken(); 
    const refreshToken = user.generateRefreshToken();

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 D
        httpOnly: true, 
        path: "/",
        secure: true,     
        sameSite: "none"   
    };
    res.status(statusCode)
       .cookie("refreshToken", refreshToken, cookieOptions) 
       .json({
            success: true,
            message,
            user,
            accessToken, 
       });
};