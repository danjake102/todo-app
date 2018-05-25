const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Todo = require('../models/todo-list');
const checkAuth = require('../auth/checkAuth');
const config = require('../config');


router.get('/user', (req, res) => {
    User.find({}).then((user) => {
        res.send(user);
    });
});


router.post('/user/createUser', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({
               error: err
            });
         }
        const user = new User({
            username: req.body.username,
            password: hash,
            email: req.body.email
            
         });
         user.save().then((user) => {
            res.send({
                "id": user._id,
                "username": user.username,
                "email": user.email,
                "status": user.status
            });
        });
    })
})


router.post('/login', (req, res) => {
    User.findOne({username: req.body.username}).exec().then((user) => {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    failed: 'Unauthorized Access'
                });
            }
            if(result) {
                const JWTToken = jwt.sign({
                    id: user._id
                },
                config.secret,
                    {
                    expiresIn: '2h'
                    });
                return res.status(200).json({
                    auth: 'Auth success',
                    token: JWTToken
                });
            }
            return res.status(401).json({
                failed: 'wrong password'
            });
       });
    })
    .catch(error => {
       res.status(500).json({
          error: 'cannot find username'
       });
    });
 });

 router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });

router.put('/user/:id', (req, res) => {
    User.findByIdAndUpdate({_id: req.params.id}, req.body).then((user) => {
        User.findOne({_id: req.params.id}).then((user) => {
            res.send(user);
        });
    });
});

router.delete('/user/:id', (req, res) => {
    //res.send({type: 'DELETE'});
    User.findByIdAndRemove({_id: req.params.id}).then((user) => {
        res.send(user);
    });
});

//add To do list

router.get('/user/todo-list/', checkAuth, (req, res) => {
    
    Todo.find({userId: req.userId}).then((todo) => {
        res.send(todo);
    });
});

router.post('/user/todo-list', checkAuth, (req, res) => {
    const todo = new Todo({
        userId: req.userId,
        todo: req.body.todo
     });
     todo.save().then((todo) => {
        res.send({
            "userId": todo.userId,
            "todo": todo.todo
        });
    });
})

router.put('/user/todo-list/:id', checkAuth, (req, res) => {
    Todo.findByIdAndUpdate({_id: req.params.id}, req.body).then((todo) => {
        Todo.findOne({userId: req.params.id}).then((todo) => {
            res.send(todo);
        });
    });
});

router.delete('/user/todo-list/:id', (req, res) => {
    Todo.findByIdAndRemove({_id: req.params.id}).then((todo) => {
        res.send(todo);
    });
});

module.exports = router;