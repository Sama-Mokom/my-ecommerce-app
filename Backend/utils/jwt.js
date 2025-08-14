import jwt from 'jsonwebtoken';
import  dotenv  from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verify if JWT_SECRET exists in dot.env variables
if(!process.env.JWT_SECRET){
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const generateTokens = (payload)=>{
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'}
    );

    const refreshToken = jwt.sign(
        {userId: payload.userId },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'}
    );
    return {accessToken, refreshToken};
};

export const verifyAccessToken = (token) =>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    }catch (error){
        throw new Error('Invalid or expired token');
    };
};
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Invalid authorization header format');
  }

  return parts[1];
};
