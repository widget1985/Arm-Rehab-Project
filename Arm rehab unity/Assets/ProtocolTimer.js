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

var GameManagerObject;

public var state : LvlState = LvlState.Setup;

var previousChoices : String;

function Awake () {
		DontDestroyOnLoad (transform.gameObject);
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

function OnLevelWasLoaded(level : int){  //lets assume the main menu is 0 and the game is 1.

switch (level){
case 0:
state = LvlState.Setup;
break;

case 1:
state = LvlState.Wait;
GameManagerObject = GameObject.Find("GameManager");
break;

default:
print("Invaid Level");
break;

}

}

function OnGUI(){
//Maybe use GUIWindows instead?
	if(!LvlState.Setup){

		GUILayout.Label("previousChoices");

		handValue = GUILayout.SelectionGrid (handValue, handStrings, 3);

		timeCases = GUILayout.SelectionGrid (timeCases, timeStrings, 3);

		timeValue = timeCases*5 + 5; //Dumb
		
		 stringToEdit = GUILayout.TextField (stringToEdit, 500);

	if(GUILayout.Button("LoadLevel")){
	previousChoices += "" + timeValue + " min-"+ handStrings[handValue] +"   \r\n";
	Application.LoadLevel ("Curtains");
	}
	}//Setup
	if(LvlState.Wait){
	GUILayout.Button("StartGame");
	
	
	}
	
	
}//onGUi
  
  //Don't destroy on Load
  
  /*
  5 min-Left Hand 1 
10 min-Both Hands 1 
5 min-Left Hand 2 
10 min-Both Hands 2 
5 min-Left Hand 3 

*/