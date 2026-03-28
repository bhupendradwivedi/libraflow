 export const sendToken = (user, statusCode, message, res) => {
const token = user.generateAuthToken(); 

    const options = {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true, 
        sameSite: 'none', 
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
        user,
        token, // Yeh line sabse zaroori hai frontend ke liye
    });
};