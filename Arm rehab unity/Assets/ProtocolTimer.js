#pragma strict


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
var timeStrings : String[] = [" Five Minutes " , " Ten Mintues"];
var handStrings : String[] = ["Left", "Right", "Both"];
var DisplayGUI : boolean = true;
var fontSize : int = 26;
var GameManagerObject : GameObject;

public var state : LvlState = LvlState.Setup;

var previousChoices : String;

function Update(){

  if (Input.GetKey(KeyCode.LeftShift) && Input.GetKeyDown(KeyCode.Q)){
  Application.Quit();  //CAPITAL Q FOR QUIT
  }
  if(Input.GetKey(KeyCode.A)){//A is a dumb key to press
  //EndExercise ();
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
	
	
function StateChange( ){//No uses YET

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

function BeginCountDown(){
 //Display timer?
 state = LvlState.InProgress; //doesn't do nuttin yet
 //start writevalue, and write some strings to start it.
 Invoke("EndExercise",timeValue*60);
}

function EndExercise (){
 //Make sure we close the txt file?  Write an end?
 state = LvlState.End;
 Application.LoadLevel(0);//assume init menu is level 0
 //setup is done on level loaded
}




function OnLevelWasLoaded(level : int){  //lets assume the main menu is 0 and the game is 1.


print("The level index is "+level);

  switch (level){
case 0:
state = LvlState.Setup;
break;

case 1:
state = LvlState.Wait;
GameManagerObject = GameObject.Find("GameManager");
if(GameManagerObject){
print("GameManagerFound!");
var newFileName : String = "_"+""+handStrings[handValue]+""; 
GameManagerObject.SendMessage("CreateFile",newFileName);
}
else{print("WTF?  no gamemanager?");}

break;

case 2:
break;


 default:
 print("Invaid Level");
 break;

 }

}

function OnGUI(){



//Maybe use GUIWindows instead?
	if(state == LvlState.Setup){
		GUI.skin.label.wordWrap = true;
		GUILayout.Label(previousChoices);

		handValue = GUILayout.SelectionGrid (handValue, handStrings, 3);

		timeCases = GUILayout.SelectionGrid (timeCases, timeStrings, 3);

		timeValue = timeCases*5 + 5; //Dumb
		
		// stringToEdit = GUILayout.TextField (stringToEdit, 500);

	if(GUILayout.Button("LoadLevel")){
	previousChoices += "" + timeValue + " min-"+ handStrings[handValue] +"   \r\n";
	Application.LoadLevel ("Curtains");
	state = LvlState.Wait;
	}
	
	}//Setup
	
	if(state == LvlState.Wait){
 GUI.skin.button.fontSize = fontSize;
	if(GUILayout.Button("StartGame")){
	startTime = Time.time;
	BeginCountDown();	
	
	state = LvlState.InProgress;
	}
	}
	if(state == LvlState.InProgress){
	var guiTime = (timeValue*60) - (Time.time - startTime);
//The gui-Time is the difference between the actual time and the start time.
var minutes : int = guiTime / 60; //Divide the guiTime by sixty to get the minutes.
var seconds : int = guiTime % 60;//Use the euclidean division for the seconds.
var fraction : int = (guiTime * 100) % 100;
 
textTime = String.Format ("{0:00}:{1:00}:{2:00}", minutes, seconds, fraction);
//text.Time is the time that will be displayed.
GUILayout.Label( "Time Remaining "+textTime);
	}
	
	
}//onGUi
  
private var startTime : float;
var textTime : String;
//First define two variables. One private and one public variable. Set the first variable to be a float.
//Use for textTime a string.
function Start() {
startTime = Time.time;
}

  
  //Don't destroy on Load
  
  /*
  5 min-Left Hand 1 
10 min-Both Hands 1 
5 min-Left Hand 2 
10 min-Both Hands 2 
5 min-Left Hand 3 

*/