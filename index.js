import express from "express";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js"
import cors from "cors"
import * as UserControllers from "./Controllers/UserControllers.js";
import multer from "multer";


mongoose
.connect('mongodb+srv://oleglis:qwert78yui@oleglis.zqlqieh.mongodb.net/HAKI?retryWrites=true&w=majority')
.then(() => {console.log('Db ok');})
.catch((err) => {console.log('Db error', err);})

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hi Oleg')
})

app.post('/register', registerValidator, UserControllers.register)

app.post('/login', UserControllers.login)

app.get('/me', checkAuth, UserControllers.getMe)


app.patch('/user/avatar/:id', upload.single('avatar'), UserControllers.updateAva)
app.patch('/user/bg/:id', upload.single('bg'), UserControllers.updateBg)


app.post('/user/favouriteAnime/:id', UserControllers.updateFavouriteAnime)
app.delete('/user/favouriteAnime/:id', UserControllers.removeFavouriteAnime)


app.listen(5000, (err) => {
    if(err) {
        console.log(err);
    }

    console.log('Server is work');
})
