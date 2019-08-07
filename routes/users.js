var express = require('express');
var router = express.Router();

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
const webpush = require('web-push');

// const USER_SUBSCRIPTIONS = require('../in-memory-db').USER_SUBSCRIPTIONS;
// console.log(USER_SUBSCRIPTIONS);
var USER_SUBSCRIPTIONS;

const vapidKeys = {
  publicKey:
    'BAonEp9mCq5JkdVC8zK9lPZDhHeFaeDLel1OFUzgOGOW7cTVscv8w9l8KQSgqhBBX0s6_oaz8ROyOxPg9IntTtc',
  privateKey: '-8bnfgSI8Fbv3yoldV-mZ_Ha8gfolsqTnwT8jtk8pDY'
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var connectionString =
  'HostName=mcsrg-test-initial.azure-devices.net;DeviceId=MyNote5Pro;SharedAccessKey=7GpWnwwQNIrA/nEEibFnkueo9SqlKpvsUTS3OEQHb1M=';

var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('inside get method');
  res.send("Hi from users")
  var temperature = 20 + Math.random() * 15;
  var message = new Message(
    JSON.stringify({
      temperature: temperature,
      humidity: 60 + Math.random() * 20
    })
  );

  // Add a custom application property to the message.
  // An IoT hub can filter on these properties without access to the message body.
  message.properties.add(
    'temperatureAlert',
    temperature > 30 ? 'true' : 'false'
  );

  console.log('Sending message: ' + message.getData());

  // Send the message.
  client.sendEvent(message, function(err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
    res.send();
  });
});
// router.post('/newsletter', sendNewsletter);
router.post('/newsletter', (req, res) => {
  USER_SUBSCRIPTIONS = req.body;
  console.log('===========================================================');
  console.log(USER_SUBSCRIPTIONS);
  console.log('===========================================================');
  res.send();
});

function sendNewsletter(subscription_string) {
  const notificationPayload = {
    notification: {
      title: 'SafeAuto Alert',
      body: 'High Acceleration!',
      icon: 'assets/icons/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Go to the site'
        }
      ]
    }
  };

  webpush.sendNotification(
    subscription_string,
    JSON.stringify(notificationPayload)
  );
}

router.post('/sendAcceleration', function(req, res, next) {
  const temp_Acceleration = parseInt(req.body.acceleration);
  if (temp_Acceleration > 5 && USER_SUBSCRIPTIONS != undefined) {
    sendNewsletter(USER_SUBSCRIPTIONS);
  }
  var message = new Message(
    JSON.stringify({
      acceleration: req.body.acceleration
    })
  );
  client.sendEvent(message, function(err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
    res.send();
  });
});
router.post('/sendGyroscopeData', function(req, res, next) {
  const temp_Acceleration = parseInt(req.body.gyroData);
  if (temp_Acceleration > 5 && USER_SUBSCRIPTIONS != undefined) {
    sendNewsletter(USER_SUBSCRIPTIONS);
  }
  var message = new Message(
    JSON.stringify({
      acceleration: req.body.acceleration
    })
  );
  client.sendEvent(message, function(err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
    res.send();
  });
});
module.exports = router;
