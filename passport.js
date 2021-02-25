import passport from "passport";
import User from "./models/User";

passport.use(User.createStratege());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
