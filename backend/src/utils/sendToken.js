export const sendToken = (user, statusCode, message, res) => {
    const accessToken = user.generateAuthToken(); 
    const refreshToken = user.generateRefreshToken();

    // Cookie settings - Localhost Friendly
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 din
        httpOnly: true, 
        secure: false,   // Localhost par HTTP hota hai, isliye false zaroori hai
        sameSite: 'lax', // Localhost par 'lax' sabse best kaam karta hai
        path: "/",       // Taaki cookie poore site par mile
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