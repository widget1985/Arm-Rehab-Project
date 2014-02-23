import System;
import System.IO;

var ArduinoValue : float = 0 ;
var fileLocation;
var fileName = "/ArmDatA.txt"; //Add date to filename in start?
var StartedRecording : boolean = false;
var RangeOfMovement : float = 120.0;
var fullPath : String;
var CreatedFile : boolean = false;

/*
function CreateFile(){
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
CreatedFile = true;
WriteDate(); 
print("FileCreated at" + fileLocation);

}
*/

function CreateFile(name : String){
fileName = System.DateTime.Now.ToString("MM-dd-yyyy")+"_"+System.DateTime.Now.ToString("hh-mm") + name +".txt";
fileLocation = Application.dataPath;
//fileLocation = "C:/Data";
print(fileLocation);
fullPath = fileLocation + "/"+fileName;

//var srs = File.CreateText(fileLocation + "/testfile.txt");
//srs.Close();
var ding = File.CreateText(fileLocation + "/"+fileName);
ding.Close();
//Write Date
//System.IO.File.WriteAllText(fileLocation + "/"+fileName,"");
CreatedFile = true;
WriteDate(); 

print("File Created at" + fileLocation + " and is called " +fileName );
}

function SetFileName (){

fileName = System.DateTime.Now.ToString("MM-dd-yyyy")+"_"+System.DateTime.Now.ToString("hhmm") +"ArmData.txt";
}
function SetFileName ( NameInput : String){

fileName = System.DateTime.Now.ToString("MMddyyyy")+"_"+System.DateTime.Now.ToString("hhmm") +"NameInput";
}

function WriteDate(){
if (!CreatedFile){
print("file Not created!");
return;}
System.IO.File.AppendAllText(fileLocation + fileName, " " +  System.DateTime.Now.ToString("MM/dd/yyyy")); 
}

function GetString(stringText : String){
if (!CreatedFile){return;}
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

//Switch this to a timed or invoke function.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function Update () {
//System.IO.File.AppendAllText(fileLocation + "/DINGBAT2.txt", ArduinoValue.ToString());
//System.IO.File.AppendAllText(fileLocation + "/DINGBAT2.txt", " " + Time.time.ToString());
if (!CreatedFile){
//print("file Not created!");
return;}
else{
WriteDatatoFile();
//srs.Close();
}
}

function WriteDatatoFile(){
if (!CreatedFile){
print("file Not created!");
return;}
System.IO.File.AppendAllText(fullPath, ArduinoValue.ToString());
System.IO.File.AppendAllText(fullPath, " " + Time.time.ToString());
System.IO.File.AppendAllText(fullPath, " " + System.DateTime.Now.ToString("hh:mm:ss"));
//
System.IO.File.AppendAllText(fullPath, "\r\n" );
}

