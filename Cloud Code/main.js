const FIREBASE_API_KEY = 'Your_Firebase_Cloud_Messaging_API_Key_Here';


Parse.Cloud.job('sendPush', (request) => {
  sendNotification();
});

Parse.Cloud.define('sendPush', async (request) => {
  sendNotification();
});

async function sendNotification() {

  var tokenList = [];

  const queryInstallation = new Parse.Query(Parse.Installation);
  queryInstallation.exists('deviceToken');

  const result = await queryInstallation.find({ useMasterKey: true });
  for (var i = 0; i < result.length; ++i) {
    var deviceToken = result[i].get('deviceToken');
    if (deviceToken.trim() != '') {
      tokenList.push(deviceToken);
    }
  }
  var today = new Date();

  var jsonMessage = {
    'notification': {
      'title': 'Back4App Guide Notification',
      'body': 'Test Message on Flutter'
    },
    'data': { 'key1': 'value1', 'sendDate': today.toISOString(),
    'notification': {
      'title': 'Back4App Guide Notification',
      'body': 'Test Message on Flutter'
      }
    },
    //'to': tokenList[0]            //one device
    'registration_ids': tokenList  // multiple devices
  }

  //Call Firebase Cloud Messaging REST API
  try {
    const response = await Parse.Cloud.httpRequest({
      url: 'https://fcm.googleapis.com/fcm/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + FIREBASE_API_KEY
      },
      body: JSON.stringify(jsonMessage),
    });
    console.log('Firebase API - Notification was sent successfully');
  } catch (error) {
    console.error('Firebase API - Notification failed to send with error: ' + JSON.stringify(error));
  }
}