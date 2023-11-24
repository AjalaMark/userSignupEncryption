import bcrypt from "bcrypt";
import userModel from "../models/model.js";

class Controller {
  static dashboard = (req, res) => {
    const valid_msg = req.session.valid_msg;
    delete req.session.valid_msg;
    const valid_name = req.session.valid_name;
    delete req.session.valid_name;

    res.render("dashboard.ejs", { valid_msg, valid_name });
  };

  // static test_get = (req, res) => {
  //   res.send("From controller");
  // };

  static signup_get = (req, res) => {
    const signup_msg = req.session.signup_msg;
    delete req.session.signup_msg;
    const signup_user_email = req.session.signup_user_email;
    delete req.session.signup_user_name;
    res.render("signup.ejs", { signup_msg, signup_user_email });
  };

  static signup_post = async (req, res) => {
    try {
      const formData = req.body;
      console.log(formData);
      const userMatched = await userModel.findOne({ email: formData.email });

      if (!userMatched) {
        const hasedPassword = await bcrypt.hash(formData.password, 12);
        console.log(hasedPassword);

        const userToSave = new userModel({
          name: formData.name,
          email: formData.email,
          password: hasedPassword,
        });

        const userSaved = await userToSave.save();

        req.session.msg_new = "Welcome new user";
        req.session.user_new = userSaved.name;

        // res.send(userSaved);

        //res.send("user is a brand new user");
        res.redirect("/login");
      } else {
        req.session.ex_msg = "This user already exists";
        req.session.ex_user_name = userMatched.name;

        res.redirect("/login");
      }
    } catch (error) {
      console.log(`the error below was encountered \n ${error}`);
    }
  };

  static login_get = (req, res) => {
    const ex_msg = req.session.ex_msg;

    delete req.session.ex_msg;

    const ex_user_name = req.session.ex_user_name;

    delete req.session.ex_user_name;

    /*    req.session.password_msg = "Please enter correct password";
          req.session.name_matched = userMatched.name; */

    const msg_new = req.session.msg_new;
    delete req.session.msg_new;

    const user_new = req.session.user_new;
    delete req.session.user_new;

    const password_msg = req.session.password_msg;
    delete req.session.password_msg;

    const name_wrong_password = req.session.name_wrong_password;

    res.render("login.ejs", {
      ex_msg,
      ex_user_name,
      user_new,
      msg_new,
      password_msg,
      name_wrong_password,
    });
  };

  static login_post = async (req, res) => {
    try {
      const formData = req.body;

      const userMatched = await userModel.findOne({ email: formData.email });

      if (!userMatched) {
        req.session.signup_msg = "Please Signup First";
        req.session.signup_user_email = formData.email;

        res.redirect("/signup");
      } else {
        const passwordMatched = await bcrypt.compare(
          formData.password,
          userMatched.password
        );
        if (passwordMatched) {
          // res.send("user is validated, login successful");
          // res.redirect("/dashboard");
          req.session.isValidated = true;
          req.session.valid_msg = "User is validated, login successful";
          req.session.valid_name = userMatched.name;
          res.redirect("/dashboard");
        } else {
          // res.send("incorrect password");
          req.session.password_msg = "Please enter correct password";
          req.session.name_wrong_password = userMatched.name;
          res.redirect("/login");
        }
      }
    } catch (error) {
      console.log(
        `Cannot verify user details due to the error below \n ${error}`
      );
    }
  };

  static logout_post = (req, res) => {
    req.session.destroy((error) => {
      if (error) throw error;
      res.redirect("/login");
    });
  };
}

export default Controller;
