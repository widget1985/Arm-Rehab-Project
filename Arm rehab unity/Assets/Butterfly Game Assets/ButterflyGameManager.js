//import System;
import System.IO;
//import System.Collections;
//http://forum.unity3d.com/threads/34015-Newbie-guide-to-Unity-Javascript-%28long%29

public var NumberCaught : int = 0;

var Scoreboard : GameObject;

var Spawner : Transform;  //Legacy
var leftSpawner : Transform;
var rightSpawner : Transform;

//Level Properties
var gameLength : float = 15.0; // default is 15
var PlannedButterflys : int = 36 ; //  Make this a multiple of 6! or nine
var ButterflysRemaining : int;
var ButterflyPrefab : GameObject;  // get more of these?
var Net : GameObject;

//make a class for game and level properties, for now, do this
var difficulty : int;
var ButterflySpeed : float = 1;
var ButterFlyFrequency : float = 5;//in seconds
var ButterflyNetSide : int ;// 0 is right, 1 is left

var AffectedHand : int;

var HandBeingUsed : int;


var BeeLevel : int = 0; //0 is no bees, 1 is.....

//For GUI
var selStrings : String[] = ["right", "left"];


var GameRunning : boolean = true; // actually use CancelInvoke();

//all positions?  Nine or Six?
//This should be an ARRAYY!!!

var leftTop : Transform; var  leftMid : Transform; var leftBottom : Transform;
//no middle (yet)
var rightTop  : Transform; var rightMid : Transform; var rightBottom : Transform;

var hideGUI : boolean;

var SideToSpawn : int;  //0 is right, 1 is Left? 
var Countdown : GameObject;
var countdownPosition : Transform;

var CapturedData : int[] = new int[7];//

//WHAT THIS GAME NEEDS IS MORE COWBELL
//A to do list by widget
/*
Choose left or right side for butterfly net
choose duration of game
choose game mode
choose game difficulty
game length, default = 15 minutes

1.  get all ~9 or six spots
2. Keep track of quadrants where butter flys are caught
*/

function Start () {
	//find the scoreboard??
	ButterflysRemaining = PlannedButterflys;
	Spawner = GameObject.Find("Butterfly spawner _ t").GetComponent(Transform);//remove me
	hideGUI = false;
	if(Net == null){
	Net = GameObject.Find("NetCollider"); 
	}//InvokeRepeating("SpawnButterfly", 3.0, 5.0);
}

static function SaveTextFile ( fileName : String, fileContent : String ) {
   var sw : StreamWriter = new StreamWriter ( fileName );
   sw.Write ( fileContent );
   sw.Close ();
   print ( "Saved " + fileName );
}


function GameStart (){
	hideGUI = true;
	SetNetPosition(ButterflyNetSide);
	Instantiate(Countdown, countdownPosition.position, countdownPosition.rotation);
	InvokeRepeating("ChooseFlower", 3.0, 5.0);
	Net.SendMessage("GameStart"); //level?

//Start timer

}

function LevelStart (){
//what goes here?
}

function SetNetPosition(Side : int){
	//move the net to left or right
	// 0 is right, 1 is left

	Net.SendMessage("SetNetPosition", Side);
}


function GameEnd (){

 CancelInvoke();//is this enough?
 //display score
 for( var i=0 ; i<CapturedData.Length; i++){
 
 print(CapturedData[i] + " Captures at "+ i + " position " );
 }

   //DETROY ALL THE BUTTERFLYS TRIGUN
	//display score?
	//Say great job
	//level up?
	//Do next level

}

function Update () {

	Scoreboard.guiText.text = NumberCaught.ToString();
	if (ButterflysRemaining <= 0){
	GameEnd();
	}
	
	if (Input.GetKeyDown(KeyCode.P)){
	
	//Session data, Date, time, 
	
	CreateAFile();
	
	}

}

//Happen at the end of a seesion, could make this happen DURING a session incase of crashes
function CreateAFile(){


var TodaysDate = System.DateTime.UtcNow.ToString();

     var sw = new StreamWriter("Data"+ TodaysDate + ".txt");
     sw.WriteLine("Data for " + TodaysDate);
     
     //Session Data
     //which side is the butterfly net
     //which side is the affected hand
     //which side is the patient using to move.
     // level (tbd); difficulty : int
     
     
     sw.WriteLine("");
     //game data
     //has been caught or not, Time to catch since appeared on screeen, Positon of capture.  
     //non variables: length of game
     
		sw.WriteLine(this.name);
		sw.Write("");
		sw.WriteLine(Time.time);
		sw.WriteLine(" date and time  ");
	//	sw.Write( System.DateTime.UtcNow.ToString());
		sw.Close();
		//this inserts a tab.
		//+ "\t" +
}

function PauseButterflys(){
//print("Butterflys paused");
//cancel the butterfly invoke
}

function UnPauseButterflys(){

}

function ChooseFlower(){
	
	var PositionNumber : int;	
	var randomNumber : int = UnityEngine.Random.Range(1,6); //Fing a

	/*
	add a value to all positions, if value runs out skip to next position in the line.  Sorta Random.
	
	*/
	
	PositionNumber = randomNumber;
	
	ButterflysRemaining--;
	
	switch(PositionNumber)
	{
	
		//first 3 left, last three right)
				case 1:
				
						SpawnButterfly(leftSpawner, leftTop, PositionNumber );
				break;
				
				case 2:
				
						SpawnButterfly(leftSpawner, leftMid, PositionNumber );
		
				break;
				
				case 3:
						SpawnButterfly(leftSpawner, leftBottom, PositionNumber );
		
				break;
				
				case 4:
						SpawnButterfly(rightSpawner, rightTop, PositionNumber );
		
				break;
				
				case 5:
						SpawnButterfly(rightSpawner, rightMid, PositionNumber );
		
				break;
				
				case 6:
						SpawnButterfly(rightSpawner, rightBottom, PositionNumber );
		
				break;
				
				
		default:
		//choose one at random
		break;
	}
}
//From ButterflyBehavior
function ButterflyCaught(caughtPosition : int){

NumberCaught++;

CapturedData[caughtPosition]++;

//Keep trak of positions here.

}

//OVERLOADING TIME
function SpawnButterfly(){
	
	
	if(ButterflyPrefab != null  && GameRunning){
		var ButterflyClone = Instantiate(ButterflyPrefab, Spawner.position, Quaternion.identity);
		//Give the butterfly some preset settings later.
	}
	else{
		print("prefab is null!");
	}

}

function SpawnButterfly(SpawnPoint : Transform, targetFlower : Transform, PositionNumber : int){
	if(ButterflyPrefab != null  && GameRunning){
		var ButterflyClone = Instantiate(ButterflyPrefab, SpawnPoint.position, Quaternion.identity);
		
		ButterflyClone.GetComponent.< ButterflyBehavior >().Target = targetFlower;
		
		ButterflyClone.GetComponent.< ButterflyBehavior >().speedAdjust = ButterflySpeed;
		//Give the butterfly some preset settings later.
	}
	else{
		print("prefab is null!");
	}

}


//var AffectedHand : String[] = ["right", "left"];

//var HandBeingUsed : String[] = ["right", "left"];


function OnGUI(){
//display options
	if(!hideGUI){
	
	GUILayout.Label("ButterflyNetSide");
	ButterflyNetSide = GUILayout.SelectionGrid(ButterflyNetSide,selStrings,2,"toggle");
	GUILayout.Label("AffectedHand");
	AffectedHand = GUILayout.SelectionGrid(ButterflyNetSide,selStrings,2,"toggle");
	GUILayout.Label("HandBeingUsed");
	HandBeingUsed = GUILayout.SelectionGrid(ButterflyNetSide,selStrings,2,"toggle");
	
	
	
	 if(GUILayout.Button ("Start game")) {
	            GameStart();
	        }
	
	}
	
	
}