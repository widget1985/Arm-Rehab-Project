//#pragma strict  //LETS GET LOOSE
/*
//TODO
//Written by Widget, 2013

var FadeOutOption : boolean;

//
*/

@script RequireComponent(AudioSource)
private var Protocol;

public var BlackScreen : boolean = false;// Handle with setup
public var outerLimit : float = -1.0;// Handle with setup //do not adjust your tv set
public var Reversi : boolean = false;

var atEndGame : boolean;

var BlackTexture : Texture2D;

var DarkScreenObject : GameObject;
var ArduinoAdjustMult : float;
var ArduinoAdjustSub : float;
//user settings
private var repeatSong : boolean;
var songSelection : int; // Handle with setup
var songs : AudioClip[]; //Handle with setup

private var GameRunning : boolean = true;
//
var Rhand : GameObject;
var Lhand : GameObject;

var ArduinoCtrl : boolean;

var targetValue : float;

var moveMultiplyer : float = 2;
var curatinOffset = 0.5;
var speed = 1;

var ClapSounds : AudioClip[];
var clapSelection : int;

var TextTarget : GameObject;

var FXPrefab : GameObject;
var FXnumbers : GameObject[];
var FXMuscialNotes : GameObject;//animate this later?

var hasClapped : boolean;
var ClapNumber : int;  //NOTE: Right now number can't go above 9.   
var TotalClaps : int;
//not sure how to use this, but it is made NOT to be reset.
var innerLimit : float = 0.7;



private var r: float = 00.0; private var g: float = 100.0; private var b : float= 50.0; //Background color

var ArduinoValue : float;

var hands : GameObject[]; var maracas : GameObject[];var cymbals : GameObject[];

private var integerText = "";
private var  Track = "";
private var DisplayGUI : boolean = false;

private var stringToEdit : String = "Write notes here";

@System.NonSerialized
var mousePos;//moved out of update
var newPos;//moved out of update

function Start () {
	Protocol = GameObject.Find("Protocol");
	//GameRunning = false;
	atEndGame = false;
	TextTarget = GameObject.Find("GUI Text");
	ChangeHandModel(0);
	if(Reversi) {
	TextTarget.guiText.text = "Open Your Arms!";
	}
	if(BlackScreen) {
	//DarkScreenObject.SetActive(true);//Doesn't work for whatever reason.
	DarkScreenObject.renderer.enabled = true; 
		}
	else{
		DarkScreenObject.renderer.enabled = false;

	}
}

function GetValue(pinValue : int){
//print(pinValue + "   " + (pinValue/1024));//Do some math?
ArduinoValue =  (1.0*pinValue)/1024.00;//Normalize between 0 and 1;
}

function Update ()
{
	
	
if(Input.GetKeyUp(KeyCode.A)){
ArduinoCtrl = ! ArduinoCtrl;
}

if(Reversi){
	 MoveHandsOut();
 }
 else{
 MoveHandsIn();
 }
}

function MoveHandsIn(){
 if( ArduinoCtrl == true ){
		targetValue = ArduinoValue - 1.0;
		targetValue = ( 1.0 * targetValue * ArduinoAdjustMult) - ArduinoAdjustSub;
		//print(targetValue);
	}
	
	else{
		 mousePos = Input.mousePosition ;
		mousePos.z = 1; // select distance = 10 units from the camera
		 newPos  = (Camera.main.ScreenToWorldPoint(mousePos));
		targetValue	= newPos.x;
	//	print(targetValue);  //Might need investigation
	}
	
	if(GameRunning){
	
	    if(targetValue > 1){				
    
   			targetValue = 1;
	    }
	if (targetValue > innerLimit){
   
	   	 targetValue = innerLimit;
    
	    if(!hasClapped){
		    Clap();
		    hasClapped = true;
	    }
    }
    
    if(hasClapped && targetValue < 0){
	    hasClapped = false;
    }
    //print(newPos.x);
	Rhand.transform.rotation = Quaternion.Euler(0,-targetValue * 35,0);  //MAGIC NUMBERS!!!!! FIX 
	Lhand.transform.rotation = Quaternion.Euler(0,targetValue * 35,0);
  }

}

function MoveHandsOut(){
 
 if( ArduinoCtrl == true ){
		//targetValue = ArduinoValue - 1.0;
		targetValue = ArduinoValue;
		targetValue = ( 1.0 * targetValue * ArduinoAdjustMult) - ArduinoAdjustSub;
		print(targetValue);
	}
	
	else{
		 mousePos = Input.mousePosition ;
		mousePos.z = 1; // select distance = 10 units from the camera
		 newPos  = (Camera.main.ScreenToWorldPoint(mousePos));
		targetValue	= newPos.x;
		print(targetValue);  //Might need investigation
	}
	
	if(GameRunning){
	
	    if(targetValue > innerLimit){				
    
   			targetValue = innerLimit;
	    }
	    if (targetValue < outerLimit){
   
	   	 targetValue = outerLimit;
    
	    if(!hasClapped){
		    Clap();
		    hasClapped = true;
	    }
    }
    
    if(hasClapped && targetValue > 0) {
	    hasClapped = false;
    }
    //print(newPos.x);
	Rhand.transform.rotation = Quaternion.Euler(0,-targetValue * 35,0);  //MAGIC NUMBERS!!!!! FIX 
	Lhand.transform.rotation = Quaternion.Euler(0,targetValue * 35,0);
  }
}

function Clap(){

	TotalClaps++;
	audio.PlayOneShot(ClapSounds[clapSelection]); //Make some noize
	if(TotalClaps == 2 ){ //Clap once to begin
	Protocol.SendMessage("BeginCountDown");
	print("CountdownCall Sent To Protocol");	//Invoke("PlaySong", 0); //Send to protocol 	//Invoke("EndGame", songs[songSelection].length + 1);
	}
	if(FXPrefab){
		var FX = Instantiate(FXPrefab);
		FX.AddComponent ("TimedObjectDestructor");
		FX.transform.position.z  -= 5;
	}
	if(!Reversi){
	TextTarget.guiText.text = "" + (TotalClaps) +" Claps!"; 
	}
	else{
	TextTarget.guiText.text = "" + (TotalClaps) +" Reps!";
	}

}


function OnGUI () {
	if(DisplayGUI){

GUI.DrawTexture (Rect (0, 0, Screen.width, Screen.height), BlackTexture);	
// stringToEdit = GUILayout.TextField (stringToEdit, 100);

		GUILayout.Label("Tracklist:");
		for(var i : int; i < songs.length; i++){
			GUILayout.Label(i+". "+songs[i].name);
		}
		//int handling
//		var chr = Event.current.character;
//	    if (chr < "0"[0] || chr > "9"[0]) {
//	        Event.current.character = "\0"[0];
//	    }
	         //Track Numeber
		 GUILayout.BeginHorizontal();
		 GUILayout.Label("Track to Play");
		 Track = GUILayout.TextField (Track, GUILayout.Width(50));
		 if (int.TryParse(Track, songSelection)){}
		// repeatSong = GUILayout.Toggle(repeatSong, " Repeat ");
		 GUILayout.EndHorizontal();	    
	    //pick Instrument
	     GUILayout.BeginHorizontal();
		 GUILayout.Label("Instrument");
		 var selStrings : String[] = ["Hands", "maracas", "Cymbals"];
		 clapSelection = GUILayout.SelectionGrid (clapSelection, selStrings, 2);
		 ChangeHandModel(clapSelection);
	     GUILayout.EndHorizontal();
	    //increment value (default 2)
//		 GUILayout.BeginHorizontal();
//		 	GUILayout.Label("incrementValue, default is 2 ");
//		    integerText = GUILayout.TextField (integerText, GUILayout.Width(50));
//			    if(integerText != null ){
//				    if (int.TryParse(integerText, incrementValue)){   // print(incrementValue);
//				    }
//				    else{ incrementValue = 2;}
//			    }
//		 GUILayout.EndHorizontal();
       
        /*
	    GUILayout.Label("BackgroundColor");		r = GUILayout.HorizontalSlider(r,0,255,GUILayout.Width(255));	g = GUILayout.HorizontalSlider(g,0,255,GUILayout.Width(255));	b = GUILayout.HorizontalSlider(b,0,255,GUILayout.Width(255));
		*/
		//Start Game:
	if(GUILayout.Button("StartGame")){
		GameRunning = true;
		//DisplayGUI = false;
		//BroadcastMessage("GetString",stringToEdit);
		//BroadcastMessage("StartRecord", 1);
	}
	}//DisplayGui
//	GUILayout.EndArea ();
}

function StopSong(){
FXMuscialNotes.SetActive(false); //THis is a placeholder for actuall edited songs. //audio.Stop(); //var notes : gameObject = GameObject.Find("MusicalNotes");//Destroy(notes);
 
}

function PlaySong(){
}

function SkyBoxTint(){
	RenderSettings.skybox.SetColor("_Tint", Color( r/255, g/255, b/255, 0.5) ); //this is not really used or cared about.
}

function ChangeHandModel(model : int){
	//print("Changeing Model to " + model);
	switch(model){
		case 0 :
		
		for(var hand : GameObject in hands){
			hand.SetActive(true);
		}
		for(var maraca : GameObject in maracas){
			maraca.SetActive(false);
		}
		for(var cymbal : GameObject in cymbals){
			cymbal.SetActive(false);
		}
		
		break;
		
		case 1 :
		for(var hand : GameObject in hands){
			hand.SetActive(true);
		}
		for(var maraca : GameObject in maracas){
			maraca.SetActive(true);
		}
		for(var cymbal : GameObject in cymbals){
			cymbal.SetActive(false);
		}
		
		break;
		case 2 :
			for(var hand in hands){
				hand.SetActive(true);
			}
			for(var maraca in maracas){
				maraca.SetActive(false);
			}
			for(var cymbal in cymbals){
				cymbal.SetActive(true);
			}
		break;
		
		default:
		//just the hands
			for(var hand : GameObject in hands){
				hand.SetActive(true);
			}
			for(var maraca : GameObject in maracas){
				maraca.SetActive(false);
			}
			for(var cymbal : GameObject in cymbals){
				cymbal.SetActive(false);
			}
	
	}
//	print("Changeing Model to " + model);

}