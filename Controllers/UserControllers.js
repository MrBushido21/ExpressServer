import jwt  from "jsonwebtoken";
import bcrypt  from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js"

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
    
        const password = req.body.password 
        const salt = await bcrypt.genSalt(10) 
        const hash = await bcrypt.hash(password, salt) // шифруємо пароль методом "сіль"

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            username: req.body.username,
            avatarUrl: req.body.avatarUrl,
            profileBg: req.body.profileBg
        })
    
        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, 'secretKey',
        {
            expiresIn: '30d' // термін життя токена
        }
        )

        const { passwordHash, ...userData } = user._doc
    
        res.json({
            ...userData, // _.doc тим самим ми повертаємо користувачу лише данні, а не все що повертає монго
            token
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Анлак, некст раз повезе("
        })
    }
    
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if(!user) {
            return res.status(404).json({
                message: "Брадок, cпробуй ще раз("
            })
        }

        const isValiedPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValiedPass) {
            return res.status(404).json({
                message: "Брадок, ти помилився десь("
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secretKey', {
            expiresIn: '30d' // термін життя токена
        })

        const { passwordHash, ...userData } = user._doc
    
        res.json({
            ...userData, // _.doc тим самим ми повертаємо користувачу лише данні, а не все що повертає монго
            token
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Анлак, некст раз повезе("
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if(!user) {
            return res.status(404).json({
                message: 'Брадок не знайден('
            })
        }
        
        const { passwordHash, ...userData } = user._doc
    
        res.json(userData)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Анлак, некст раз повезе("
        })
    }
}

export const updateAva = async (req, res) => {
    try {
        const userId = req.params.id
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,      
            { 
                avatarUrl: `https://expressserver-0rxb.onrender.com/uploads/${req.file.originalname}`
            },
            { new: true}
        )

        const { passwordHash, ...userData } = updatedUser._doc;
    
        res.json({
            ...userData,
        });

    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Анлак, некст раз повезе("
        })
    }
}
export const updateBg = async (req, res) => {
    try {
        const userId = req.params.id
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { 
                profileBg: `https://expressserver-0rxb.onrender.com/uploads/${req.file.originalname}`
            },
            { new: true}
        )

        const { passwordHash, ...userData } = updatedUser._doc;
    
        res.json({
            ...userData,
        });

    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Анлак, некст раз повезе("
        })
    }
}
export const updateFavouriteAnime = async (req, res) => {
    try {
        const userId = req.params.id;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    favouriteAnime: req.body.anime,
                    favouriteAnimeIds: req.body.id
                }
            },
            { new: true } // Отримати оновлений об'єкт
        );

        const { passwordHash, ...userData } = updatedUser._doc;
    
        res.json({
            ...userData,
        });

    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Анлак, некст раз повезе("
        })
    }
}
export const removeFavouriteAnime = async (req, res) => {
    try {
        const userId = req.params.id;
        const animeIdToRemove = req.body.id;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { 
                $pull: { 
                    favouriteAnimeIds: animeIdToRemove,
                    favouriteAnime: { mal_id: animeIdToRemove }
                }
            },
            { new: true } // Отримати оновлений об'єкт
        );

        const { passwordHash, ...userData } = updatedUser._doc;
    
        res.json({
            ...userData,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Анлак, некст раз повезе("
        });
    }
};
