const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { generateToken } = require("../controllers/userController");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Vérifie si l'utilisateur existe
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Si pas existant, crée un nouvel utilisateur
          user = await User.create({
            nom: profile.name.familyName || "GoogleUser",
            prenom: profile.name.givenName || "GoogleUser",
            email: profile.emails[0].value,
            motDePasse: Math.random().toString(36).slice(-8), // mot de passe aléatoire
            role: "Client",
            isVerified: true,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize / Deserialize (nécessaire pour passport)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
