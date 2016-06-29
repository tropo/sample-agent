//Predefined Variables

var token = "MYTOKEN";
var launchURL = "https://api.tropo.com/1.0/sessions?action=create&token=";
var ftpAddress = "ftp.tropo.com/recordings/"
var ftpUserName = "MYUSERNAME";
var ftpPassword = "MYPASSWPRD";
var queueNumber = "+13215556677";
var mySessionID = "";

function httpGet(url){ //Performs GET requests here
	connection = new java.net.URL(url).openConnection();
	connection.setDoOutput(false);
	connection.setDoInput(true);
	connection.setInstanceFollowRedirects(false);
	connection.setRequestMethod("GET");
	connection.setRequestProperty("Content-Type", "text/plain");
	connection.setRequestProperty("charset", "utf-8");
	connection.connect();

	dis = new java.io.DataInputStream(connection.getInputStream());
	while (dis.available() !== 0) {
		line = dis.readLine();
		this.eval(""+line);
	}
}

if (currentCall) {callLeg = "inbound";} //Assigns callLeg value if it's not already pre-defined.

if (callLeg == "inbound") {

	answer();
	mySessionID = currentCall.SessionId; //Assign SessionID to a friendly name, now that session exists.

	startCallRecording("ftp://" + ftpUserName + ":" + ftpPassword + "@" + ftpAddress + "INBOUND-" + mySessionID + ".wav");
	wait(1500);

	say("Thank you for contacting the Call Center Template application.");
	wait(500);

	say("We are connecting you to an agent now.");

	httpGet(launchURL + token + "&theConfID=" + mySessionID + "&callLeg=agent&theAgentNumber=" + queueNumber);

	log("xxxxxxxxxxLOGxxxxxxxxxx - SessionId = " + mySessionID); //Use this sessionId to control the current caller's hold state.

	var isOnHold = false;
	while (currentCall.isActive())
	{
		conference(mySessionID);
		say("You are now on hold");
		isOnHold = true;
		while (isOnHold && currentCall.isActive()) { //Loop hold logic.
			say("You are still on hold", {onSignal:function(event){isOnHold = false;}});
		}
		say("You are now off hold");
	}

	stopCallRecording();
	hangup();

} else if (callLeg == "agent") {

	call(queueNumber);
	mySessionID = currentCall.SessionId; //Assign SessionID to a friendly name, now that session exists.

	startCallRecording("ftp://" + ftpUserName + ":" + ftpPassword + "@" + ftpAddress + "INBOUND-" + theConfID + "-AGENT-" + mySessionID + ".wav");
	wait(1500);

	say("Connecting you to a caller now.");

	conference(theConfID);

	stopCallRecording();

}
