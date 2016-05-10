//Predefined Variables

var token = "MYTOKEN";
var launchURL = "https://api.tropo.com/1.0/sessions?action=create&token=";
var ftpAddress = "ftp.yourserver.com/recordings/"
var ftpUserName = "USERNAME";
var ftpPassword = "PASSWORD";
var queueNumber = "+13215556677";

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

function InboundLeg(mySessionID, myToken, myLaunchURL, myFTP, myUN, myPW, myNumber) { //For Inbound Portion of Call
	answer();
	startCallRecording("ftp://" + myUN + ":" + myPW + "@" + myFTP + "INBOUND-" + mySessionID + ".wav");
	wait(1500);

	say("Thank you for contacting the Call Center Template application.");
	wait(500);

	say("We are connecting you to an agent now.");

	httpGet(myLaunchURL + myToken + "&theConfID=" + mySessionID + "&theCall=agent&theAgentNumber=" + myNumber);

	conference(mySessionID);
	stopCallRecording();
	hangup();
}

function AgentLeg(mySessionID, myConfID, myFTP, myUN, myPW) { //For Agent Portion of Call
	log("xxxxxxxxxxLOGxxxxxxxxxx - " + mySessionID);
	startCallRecording("ftp://" + myUN + ":" + myPW + "@" + myFTP + "INBOUND-" + myConfID + "-AGENT-" + mySessionID + ".wav");
	wait(1500);

	say("Connecting you to a caller now");

	conference(myConfID);
	stopCallRecording();
}

//Call Type Logic:

var incoming = false; //Variable Constructor

if(currentCall){ //If the call is inbound, set incoming to true
	incoming = true;
}

var incoming = false; //Variable Constructor

if(currentCall){ //If the call is inbound, set incoming to true
 incoming = true;
}

if (incoming) {
	InboundLeg(currentCall.sessionId + "", token, launchURL, ftpAddress, ftpUserName, ftpPassword, queueNumber);
} else if (theCall == "agent") {
	call("+" + theAgentNumber);
	AgentLeg(currentCall.sessionId, theConfID, ftpAddress, ftpUserName, ftpPassword);
} else {
	log("xxxxxxxxxxLOGxxxxxxxxxx - ERROR: NO DIRECTION");
}
