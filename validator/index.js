const { body } = require("express-validator");

exports.createPostValidator = (req, res, next) => {
  // title
  req.check("title", "Write a title").notEmpty();
  req.check("title", "Title must be between 4 to 150 characters").isLength({
    min: 4,
    max: 150,
  });
  // body
  req.check("body", "Write a body").notEmpty();
  req.check("body", "Body must be between 4 to 2000 characters").isLength({
    min: 4,
    max: 2000,
  });
  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware
  next();
};

exports.userSignupValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 2000,
    }),
  body("password", "Password is required").notEmpty(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

exports.userSigninValidator = [
  body("email", "Email must be between 3 to 32 characters")
    .matches(
      /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    )
    .withMessage("Please type your valid email address")
    .isLength({
      min: 4,
      max: 32,
    }),
  body("password", "Invalid Social Login Token!").notEmpty(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Your social login token is invalid!"),
];

exports.passwordResetValidator = (req, res, next) => {
  // check for password
  req.check("newPassword", "Password is required").notEmpty();
  req
    .check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long")
    .matches(
      /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    )
    .withMessage("must contain a number")
    .withMessage("Password must contain a number");

  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware or ...
  next();
};
