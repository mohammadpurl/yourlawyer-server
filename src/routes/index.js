const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const authRouter = require("./auth");

const error = require("./../middlewares/error.js");
// const { isLoggined, getRelatedPatient} = require('./../middlewares/auth.js')
router.use("/auth", authRouter);

/**
 * @swagger
 * /:
 *  get:
 *      summary: index of routes
 *      tags: [indexpage]
 *      description: get all need data for index page
 *      parameters:
 *          -   in: header
 *              neme: accessToken
 *              example: Bearer YourToken
 *
 *      responses:
 *          200:
 *              description:success
 *          404:
 *              description: not found
 *
 *
 */
router.use(error);
module.exports = router;
