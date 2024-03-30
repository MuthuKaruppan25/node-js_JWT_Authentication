const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import cors middleware
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors()); // Use cors middleware to accept requests from all origins

let refreshTokenList = []
const posts = [
    {
        username: "Akash",
        title: "Post 1"
    },
    {
        username: "Mano",
        title: "Post 2"
    }
];

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefershToken(user);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    return accessToken;
}

function generateRefershToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFERESH_ACCESS_TOKEN);
    return refreshToken;
}

app.post("/token",(req, res)=>{
    const refreshToken = req.body.refreshToken
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokenList.includes(refreshToken)) return res.sendStatus(403)
   
    jwt.verify(refreshToken,process.env.REFERESH_ACCESS_TOKEN,(err , user)=>{
     if(err) return res.sendStatus(403)
     console.log(user)
     const accessToken = generateAccessToken({name: user.name})
     res.json({accessToken : accessToken })
    })
})
   

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

