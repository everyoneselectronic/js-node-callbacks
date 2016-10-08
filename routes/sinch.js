var express = require('express');
var router = express.Router();

// var baseUrl = "#href[http://test.everyoneselectronic.co.uk/limmy/";

// var svamlResponse = {
//     "Instructions": [],
//     "Action": {
//         // "name" : "Hangup"
//     }
// };
// tellTime();

var svamlResponse =
	{
		instructions: [
			{
				"name": "Say",
				"text": "Welcome to the hotline",
				"locale": "en-US"
			}
		],
		action: {
			"name": "ConnectConf",
			"conferenceId": "myconference1",
			"cli": "",
			"suppressCallbacks": true
		}
	}

router.post('/', function (req, res, next) {
	//we know its a ICE event since we supress callbacks for other events
	// set the callerid to the calling number
	svamlResponse.action.cli = req.body.cli;
	//send back the response.
	res.json(svamlResponse);
});
module.exports = router;



function makeAudioObject(a) {
    var str = baseUrl + a + ".wav]";
    var ids = [str];

    // console.log(ids);

    var audio = {
        "name" : "PlayFiles",
        "ids" :  ids,
        "locale" : "en-US"
    }
    svamlResponse['Instructions'].push(audio);
}

function tellTime() {
    var myDate = new Date();
    var myHour = myDate.getHours();
    var myMinute = myDate.getMinutes();
    var minuteDivBy5 = myMinute / 5;
    var roundMinuteDivBy5 = Math.round(minuteDivBy5);
    myHour = myHour % 12 || 12; // Convert hour to 12 hour day, 1-12

    // Array of speech, starting with intro. Further sounds will be added to the end.
    makeAudioObject("intro");

    // If it's not on the hour...
    if (myMinute > 0) {

        // If not on a 5 min div, say "just left" or "coming up for"
        if (minuteDivBy5 != roundMinuteDivBy5) {
            if (roundMinuteDivBy5 < minuteDivBy5) {
                makeAudioObject("justleft");
                // console.log("justleft")
            } else {
                makeAudioObject("comingupfor");
                // console.log("comingupfor")
            }
        }

        // What minute? Past or from?
        if (roundMinuteDivBy5 == 6) { // if half past
            makeAudioObject("half");
            makeAudioObject("past");
            // console.log("half past");
        } else if (roundMinuteDivBy5 == 3) {
            makeAudioObject("quarter");
            makeAudioObject("past");
            // console.log("quarter past");
        } else if (roundMinuteDivBy5 == 9) {
            makeAudioObject("quarter");
            makeAudioObject("to");
            // console.log("quarter to");
        } else if (roundMinuteDivBy5 > 0 && roundMinuteDivBy5 < 7) {
            makeAudioObject((roundMinuteDivBy5 * 5) + "m");
            makeAudioObject("past");
            // console.log((roundMinuteDivBy5 * 5) + "m past");
        } else if (roundMinuteDivBy5 >= 7 && roundMinuteDivBy5 < 12) {
            makeAudioObject((60 - (roundMinuteDivBy5 * 5)) + "m");
            makeAudioObject("to");
            // console.log("etc");
        }

    }

    // What hour to say? If less than 33 mins, refer to this hour. More, refer to next hour.
    if (myMinute < 33) {
        makeAudioObject(myHour + "h");
        // console.log(myHour + "h");
    } else {
        if (myHour < 12) {
            makeAudioObject(myHour + 1 + "h");
            // console.log(myHour + 1 + "h");
        } else {
            makeAudioObject("1h");
            // console.log("1h");
        }
    }
}