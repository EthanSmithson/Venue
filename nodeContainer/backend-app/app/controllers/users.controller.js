const Users = require("../models/users.model.js");
const User = require("../models/users.model.js");

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a User
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
    });
  
    // Save User in the database
    User.create(user, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      else res.json({status: 1});
    });
};

// Retrieve all User from the database (with condition).
exports.findAll = (req, res) => {
  
};

// Find a single User with a email
exports.findOne = (req, res) => {
    User.findByEmail(req.params.email, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.json({
              status: 2
            });
          } else {
            res.status(500).send({
              message: "Error retrieving User with email " + req.params.email
            });
          }
        } else res.json({ status: 1, message: "This User Exists!" });
      });
};

exports.loginUser = (req, res) => {
  User.loginUser((req.params), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.json({
          status: 2
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with email " + req.params.email
        });
      }
    } else res.json({ status: 1, message: "This User Exists!" });
  });
}

exports.confirmed = (req, res) => {
  User.isConfirmed((req.params), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.json({
          status: 2
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with email " + req.params.email
        });
      }
    } else res.json({ status: 1, message: "This User is Confirmed!" });
  });
}

exports.emailConfirmed = (req, res) => {
  User.emailConfirm((req.params), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        var path = require('path');
        res.sendFile(path.resolve('../../nodeContainer/backend-app/emailTemplates/confirmedEmailMessage.html'));
      } else {
        res.status(500).send({
          message: "Error retrieving User with email " + req.params.email
        });
      }
    } else res.json({ status: 1, message: "This User is Confirmed!" });
  });
}

exports.changePassword = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  if (req.body.myNewPassword != req.body.reMyNewPassword) {
    res.status(400).send({
      message: 3
    })
    return
  }

  console.log(req.body);

  Users.changePassword((req.body), (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred."
      });
    else res.json({status: 1});
  });
}

exports.createPackage = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Users.addPackage((req.body), (err, data) => {
    if ( err && err.errno == 1062) {
      res.json({dupe: 1});
    } else if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred."
      });
    else res.json({status: 1});
  });
}

exports.findId = (req, res) => {
  User.findId((req.params), (err, data) => {
    console.log(req.params);
    if (err) {
      if (err.kind === "not_found") {
        res.json({
          status: 2
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with email " + req.params
        });
      }
    } else res.json( data );
  });
}

exports.getPackages = (req, res) => {
  User.getPackages((req.params), (err, data) => {
    console.log(req.params);
    if (err) {
      if (err.kind === "not_found") {
        res.json({
          status: 2
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with ID " + req.params
        });
      }
    } else res.json( data );
  });
}