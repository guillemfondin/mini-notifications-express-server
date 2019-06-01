const express = require("express");
const Expo = require("expo-server-sdk").default;
const cors = require("cors");

const expo = new Expo();
const expressServer = express();

expressServer.use(cors());
expressServer.listen(process.env.PORT || 3000, () => {
  console.log("Serveur en écoute sur : " + process.env.PORT || 3000);
  expressServer.get("/", function(req, res) {
    const token = req.query.token;
    if (!Expo.isExpoPushToken(token)) {
      res.send({err: "Token invalide"})
    } else {
      let messages = [
        {
          to: token,
          sound: "default",
          body: "La météo du jour !",
          data: {
            city: "Palaiseau"
          }
        }
      ];

      expo.sendPushNotificationsAsync(messages).then(ticket => {
        res.send({ticket: ticket});
        console.log(ticket);
      }).catch(err => {
        res.send({err: "Erreur d'envoi"})
      })
    }
  })
});