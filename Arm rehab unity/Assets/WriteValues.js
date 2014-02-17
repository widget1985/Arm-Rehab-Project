import System;
import System.IO;

var ArduinoValue : float = 0 ;
var fileLocation;
var fileName = "/ArmData.txt"; //Add date to filename in start?
var StartedRecording : boolean = false;
var RangeOfMovement : float = 120.0;
var fullPath : String;

function Start () {
SetFileName ();
fileLocation = Application.dataPath;
//fileLocation = "C:/Data";
print(fileLocation);
fullPath = fileLocation + "/"+fileName;

var srs = File.CreateText(fileLocation + "/testfile.txt");
srs.Close();
var ding = File.CreateText(fileLocation + "/"+fileName);
ding.Close();
//Write Date
System.IO.File.WriteAllText(fileLocation + "/"+fileName,"HelloWurld");

WriteDate(); 
}

function SetFileName (){
fileName = System.DateTime.Now.ToString("MMddyyyy")+"_"+System.DateTime.Now.ToString("hhmm") +"ArmData.txt";
}

function WriteDate(){
System.IO.File.AppendAllText(fileLocation + fileName, " " +  System.DateTime.Now.ToString("MM/dd/yyyy")); 
}

function GetString(stringText : String){
print("String received");
System.IO.File.AppendAllText(fullPath, "\r\n" );
System.IO.File.AppendAllText(fullPath, stringText);
System.IO.File.AppendAllText(fullPath, "\r\n" );
}

public function StartRecord(signal : int){
StartedRecording = true;
}
public function StartRecord(){
StartedRecording = true;
}

function GetValue(pinValue : int){
//print(pinValue + "   " + (pinValue/1024));
//Do some math?
	if(StartedRecording){
	ArduinoValue =  RangeOfMovement*(1.0*pinValue)/1024.00;
	}
}

//Switch this to a timed or invoke function.
function Update () {
//System.IO.File.AppendAllText(fileLocation + "/DINGBAT2.txt", ArduinoValue.ToString());
//System.IO.File.AppendAllText(fileLocation + "/DINGBAT2.txt", " " + Time.time.ToString());
WriteDatatoFile();
//srs.Close();
}

function WriteDatatoFile(){

System.IO.File.AppendAllText(fullPath, ArduinoValue.ToString());
System.IO.File.AppendAllText(fullPath, " " + Time.time.ToString());
System.IO.File.AppendAllText(fullPath, " " + System.DateTime.Now.ToString("hh:mm:ss"));
//
System.IO.File.AppendAllText(fullPath, "\r\n" );
}

