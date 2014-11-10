#pragma strict
/************************************
This script sets everything up, Persists through all scenes, sends and records values.


***********************************/


import System.Linq;
import System.IO;
import System.Collections;
//import System.Collections.Generic;


public enum LvlState {
    Setup,
	Wait,
	Begin,
	InProgress,
    End,
}

var stringToEdit : String = "Write Notes Here";
var handValue : int = 0;
var timeCases : int = 0;
var timeValue : float = 0.0;
var timeStrings : String[] = ["One Minute"," Five Minutes " , " Ten Mintues"];

var handStrings : String[] = ["Left", "Right", "Both"];  
var DisplayGUI : boolean = true;
var fontSize : int = 26;
var GameManagerObject : GameObject;
var LevelOneName : String = "Curtains";
var LevelTwoName : String = "Clapping";
var BlackScreen : boolean = false;
var ReverseClap : boolean = false;

//Music Stuff
var songSelection : int; // Handle with setup
var songs : AudioClip[]; //Handle with setup

private var integerText = "";
private var  Track = ""; 
public var Threshold : float;   //by SEDA

public var state : LvlState = LvlState.Setup;

var previousChoices : String;


private var startTime : float;
var textTime : String;


function Start() {
	startTime = Time.time;
	Invoke("GetFilePaths", 5);
}

function Update(){

 if (Input.GetKeyDown(KeyCode.P)){ //P for PLAY!
	if(!audio.isPlaying){
	 PlaySong();
	}
	else{audio.Pause();}
 }


if (Input.GetKeyDown(KeyCode.Escape)){ //esc goes back to start
	EndExercise();//Check for first level, then offer to quit.
	}
  if (Input.GetKey(KeyCode.LeftShift) && Input.GetKeyDown(KeyCode.Q)){
  Application.Quit();  //CAPITAL Q FOR QUIT
  }
}

var currentLevel : int;

function Awake () {
		DontDestroyOnLoad (transform.gameObject);
		//SUPER UGLY EDITOR LEVELISLOADED WORKAROUND
		//InvokeRepeating("CheckLevel", 1 , 1);
	}

function CheckLevel(){
	if(Application.isLoadingLevel){
	 return;
	}
	 if (Application.loadedLevel != currentLevel ){
		 currentLevel = Application.loadedLevel;
		 print("NewLevelWorkaround!");
		 OnLevelWasLoaded(currentLevel);
	 }
}

function GetValue(pinValue : int){
//print(pinValue + "   " + (pinValue/1024)); 
  //print((pinValue/1024));
  ArduinoValue = (1.0*pinValue)/1024.00;  
   //ArduinoValue =(-0.74*2.8)+(2.8*pinValue)/1024.00;  //SEDA
}

function StateChange( ){

  switch (state) {

        case LvlState.Setup:
        break;

        case LvlState.Wait:
        break;

        case LvlState.Begin:
        break;

        case LvlState.InProgress:
        break;

        case LvlState.End:
        break;

        default:
        state = LvlState.Setup;
        break;
	}
}

public function BeginCountDown(){
 //Display timer?
 print("Messagee Received!");

 if(Application.loadedLevelName == LevelOneName){
 	//start writevalue, and write some strings to start it.
 	//Invoke("EndExercise",timeValue*60);//Come up with a better TimeValue variable name

 	audio.Stop();
 	audio.clip = songs[songSelection];
 	audio.loop = true;
 	//Limit to 5 or ten minutes instead  //timeValue = ((audio.clip.length + 0.000) / 60.000);
 	//print(audio.clip.length/60 + "setting time value to "+timeValue);
 	//startTime = Time.time;
 	//PlaySong();  //MUSIC NOW HANDLED BY JUKEBOX
 	Invoke("EndExercise",timeValue * 60);// audioclips are in seconds

 	print("CountDownBegun");
 }//lvl 1

 else if(Application.loadedLevelName == LevelTwoName){
	print("time fixer running");
	startTime = Time.time;
 	audio.Stop();
 	audio.clip = songs[songSelection];
 	audio.loop = true;
 	
 	//Limit to 5 or ten minutes instead  //timeValue = ((audio.clip.length + 0.000) / 60.000);

 	//print(audio.clip.length/60 + "setting time value to "+timeValue);
 	//startTime = Time.time;

 	Invoke("EndExercise",timeValue * 60);// audioclips are in seconds

 	//PlaySong();
 	print("CountDownBegun");

 }//else if lvl 2
 state = LvlState.InProgress; //doesn't do nuttin yet
}


function EndExercise (){
 //Make sure we close the txt file?  Write an end?
 audio.Stop();
 state = LvlState.End;
 Application.LoadLevel(0);//assume init menu is level 0
 //setup is done on level loaded
}

function OnLevelWasLoaded(level : int){  //lets assume the main menu is 0 and the game is 1.

	var newFileName : String;
	print("The level index is "+level);

  switch (level){
		case 0:
		state = LvlState.Setup;
		break;

	case 1:
	startTime = Time.time;
		state = LvlState.Wait;
		GameManagerObject = GameObject.Find("GameManager");
		if(GameManagerObject){
			print("GameManagerFound!");
			newFileName = "_"+"_Curtains_"+handStrings[handValue]+"";
			GameManagerObject.SendMessage("CreateFile",newFileName);
			var imageNavigatorObject= GameObject.Find("ImageNavigator");

	if(imageNavigatorObject) {
		imageNavigatorObject.SendMessage("SetGallery",galleryValue);
	}
	else{print("WTF?  no imageNavigator?");}
	}
	else{print("WTF?  no gamemanager?");}
	print("CaseOne");
	break;

	case 2:
		print("CaseTwo");
		startTime = Time.time;
		state = LvlState.Wait;
		GameManagerObject = GameObject.Find("GameManager");
		if(GameManagerObject){
			print("GameManagerFound!");
			newFileName = "_"+"_Clapping_"+handStrings[handValue]+"";
			GameManagerObject.SendMessage("CreateFile",newFileName);
			var clapperScript = GameManagerObject.GetComponent(Clapper);
			clapperScript.BlackScreen = BlackScreen;
			clapperScript.Reversi = ReverseClap;
		}
		else{print("WTF?  no gamemanager?");}

	break;

	case 3:
	break;

	 default:
	 print("Invaid Level");
	 break;

	}
}

function PlaySong(){
print("Trying to play song");
//audio.clip = songs[songSelection];
if(!audio.isPlaying){
	//audio.clip = songs[songSelection];
	//	audio.Play(); DEPRECIATED  use Jukebox asset INSTEAD
	}
	//Display song name somehow
}

private var scrollPosition : Vector2;
private var levelValue : int = 0;
private var galleryValue : int = 0;
private var windowRect : Rect = Rect ( Screen.width/2,Screen.height/2, 200	, 200);
var ArmStretchToggle = false;
function OnGUI(){

//Maybe use GUIWindows instead?
	if(state == LvlState.Setup){
		GUILayout.BeginArea (Rect (10,10,800,520));
		GUI.skin.label.wordWrap = true;
		GUILayout.Label(previousChoices);

		handValue = GUILayout.SelectionGrid (handValue, handStrings, 3);
		levelValue = GUILayout.SelectionGrid(levelValue, ["Curtain game", "Clapping Game"],2);
	//GUILayout.EndArea ();
	//GUILayout.BeginArea (Rect (10,85,800,800));
		timeCases = GUILayout.SelectionGrid (timeCases, timeStrings, 3);
		
	
		if(timeCases == 0){timeValue = 1;}//Is there a better way?
		else if (timeCases == 1){timeValue = 5;}
		else if (timeCases == 2){timeValue = 10;}
		//timeValue = timeCases*5 + 5; //Dumb
		//SHoW SOME PICTURES.
		if(levelValue == 0){
		 GUILayout.BeginHorizontal();

		for(var thumbImage : Texture2D in thumbImagesBuiltinArray){
		//if(GUILayout.Button(thumbImage, GUILayout.Width(100), GUILayout.Height(100))){}
		}
		 galleryValue = GUILayout.SelectionGrid( galleryValue, thumbImagesBuiltinArray,7,GUILayout.Width(800), GUILayout.Height(110));
		 GUILayout.EndHorizontal();
		// stringToEdit = GUILayout.TextField (stringToEdit, 500);
		}
		else{
		BlackScreen = GUILayout.Toggle(BlackScreen,"Black Screen?");
		}
		
		ArmStretchToggle = GUILayout.Toggle(ArmStretchToggle,"Record Max Arm Threshold");
  		if(ArmStretchToggle){
  		windowRect = GUI.Window (0, windowRect, DoMyWindow, "Open and close your arms!");
  		}
  		
         GUILayout.BeginHorizontal();   //by SEDA
		 //GUILayout.Label("ROM Threshold:");   //by SEDA, to ask the user to enter a threshold value.
//		 Threshold = GUILayout.TextField (Threshold, GUILayout.Width(50));  //by SEDA 
		 GUILayout.EndHorizontal();
       
	//else if(levelValue == 1){
	GUILayout.Label("Tracklist:");
	scrollPosition = GUILayout.BeginScrollView ( scrollPosition, GUILayout.Width (800), GUILayout.Height (200));
		for(var i : int; i < songs.length; i++){
			GUILayout.Label(i+". "+songs[i].name);
		}
			GUILayout.EndScrollView ();
		//int handling
//		var chr = Event.current.character;
//	    if (chr < "0"[0] || chr > "9"[0]) {
//	        Event.current.character = "\0"[0];
//	    }
	         //Track Number
		 GUILayout.BeginHorizontal();
		 GUILayout.Label("Track to Play");
		 Track = GUILayout.TextField (Track, GUILayout.Width(50));
		 if (int.TryParse(Track, songSelection)){
		 audio.clip = songs[songSelection];
		 }

		// repeatSong = GUILayout.Toggle(repeatSong, " Repeat ");
		 GUILayout.EndHorizontal();
		//Now just 5 or ten minutes    // timeValue = songs[songSelection].length / 60;
		// print("       "+songs[songSelection].length+"");
		 //}//levlvalue==2

		if(GUILayout.Button("Load Level")){
		previousChoices += "" + timeValue + " min-"+ handStrings[handValue] +"  ";
		Application.LoadLevel (levelValue + 1);
		state = LvlState.Wait;
		//Display loading screen
		}

	//if(GUILayout.Button("Get Dirs")){GetFilePaths();}

	 GUILayout.EndArea ();

	}//Setup

	if(state == LvlState.Wait){
		if(currentLevel == 1){
	 		GUI.skin.button.fontSize = fontSize;

			if(GUILayout.Button("StartGame")){
				startTime = Time.time;
				BeginCountDown();
				state = LvlState.InProgress;
			}//StartgameButton
		}
		else if(currentLevel == 2){
			GUILayout.Label("Clap to start song!"); //should go away when we change level state
		}
	}//Wait
	if(state == LvlState.InProgress){
		var guiTime = (timeValue*60) - (Time.time - startTime);
		//The gui-Time is the difference between the actual time and the start time.
		var minutes : int = guiTime / 60; //Divide the guiTime by sixty to get the minutes.
		var seconds : int = guiTime % 60;//Use the euclidean division for the seconds.
		var fraction : int = (guiTime * 100) % 100;
 		textTime = String.Format ("{0:00}:{1:00}:{2:00}", minutes, seconds, fraction);
		//text.Time is the time that will be displayed.
		GUI.skin.label.fontSize = 20;
		GUI.Label(Rect(10,40,400,400) ,"Time Remaining "+textTime);
		GUI.skin.label.fontSize = 12;
	}//inprogress

}//onGUi

var ArbitaryResetValue : float = 0.7;
var ArduinoValue : float;

function DoMyWindow (windowID : int) {
	Debug.Log(Threshold);
		//if(Threshold<ArduinoValue){
			Threshold = ArduinoValue;
			//}
//			if(ArduinoValue >= ArbitaryResetValue){//this should be a range!// I have no idea what i was doing here
//			Threshold = 0	;
//			}
			GUILayout.Label("threshold is "+Threshold);//Should be set to degrees
		
		if (GUILayout.Button("Click when done")){
			ArmStretchToggle = false;
			}
			// Make the windows be draggable.
		GUI.DragWindow (Rect (0,0,10000,10000));
}


private var filesLocation : String = "C:/Data";
var image : Texture2D[];

public var images = new Array();
public var thumbImages = new Array();
function GetFilePaths(){

var dInfo : DirectoryInfo = DirectoryInfo(filesLocation);
var subdirs: DirectoryInfo[] = dInfo.GetDirectories();
	for (var sd in subdirs){
		print("subdirsname: "+ sd.Name + "  fullname "+ sd.FullName);
	}
			for(var i = 0; i < dInfo.GetDirectories().Length; i++){
			//print (dInfo.GetDirectories().Length);
			//print (subdirs[i].FullName);
			var f = subdirs[i];
			 LoadThumbs(Directory.GetFiles(subdirs[i].FullName, "*.jpg", SearchOption.AllDirectories),0);  //.OrderBy( f => f.Name )
		}//LOADING TOOO MANY IMAGES CAN BE DANGEROUS
		//LoadAll(Directory.GetFiles(subdirs[2].FullName, "*.jpg", SearchOption.AllDirectories));

}
//var builtinArray : Texture2D[] = images.ToBuiltin(Texture2D) as Texture2D[];//please change the name of this variable
var thumbImagesBuiltinArray : Texture2D[] = thumbImages.ToBuiltin(Texture2D) as Texture2D[];

function LoadThumbs(filePaths : String[], firstImage : int) {

			var load : WWW = new WWW("file:///"+filePaths[firstImage]);
			//print(filePaths[firstImage]);
			 //yield load;//this is what broke image loading order before
			if (!String.IsNullOrEmpty(load.error)) {
				Debug.LogWarning(filePaths[firstImage] + " error");
				print("IAMERROR");
				//LoadThumbs(filePaths, firstImage + 1);  //Repeat somhow, cases, returns, whiles,
			} else { //print("GEttingImages?");
				thumbImages.Push(load.texture);
				//thumbImages.Sort();
				//image[imagedex]= load.texture;
				//imagedex++;
				thumbImagesBuiltinArray = thumbImages.ToBuiltin(Texture2D) as Texture2D[];
			}
}

    /*
function LoadAll( filePaths : String[]) {
		for(var filePath : String in filePaths) {
			var load : WWW = new WWW("file:///"+filePath);

			 yield load;
			if (!String.IsNullOrEmpty(load.error)) {
				Debug.LogWarning(filePath + " error");
			} else {
				images.Push(load.texture);

				builtinArray = images.ToBuiltin(Texture2D) as Texture2D[];
			}
		}

	}

*/
