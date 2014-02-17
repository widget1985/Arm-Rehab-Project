#pragma strict
/*
//TODO
//Written by Widget, 2013

var FadeOutOption : boolean;

//
*/
@script RequireComponent(AudioSource)

var BlackTexture : Texture2D;
var ArduinoAdjustMult : float;
var ArduinoAdjustSub : float;
//user settings
private var repeatSong : boolean;
var songSelection : int;
var songs : AudioClip[];
var RepsBeforeReward : int = 2;
var incrementalReward : boolean;
var incrementValue : int = 2;
var GameRunning : boolean;
//
var Rhand : GameObject;
var Lhand : GameObject;

var ArduinoCtrl : boolean;

var  targetValue : float;

var moveMultiplyer : float = 2;
var curatinOffset = 0.5;
var speed = 1;

//No longer using tada for claps
var Tada : AudioClip;
//replace tada with clap sounds array
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
var outerLimit : float = -1.0;//do not adjust your tv set

private var r: float = 00.0; private var g: float = 100.0; private var b : float= 50.0; //Background color

var ArduinoValue : float;

var hands : GameObject[]; var maracas : GameObject[];var cymbals : GameObject[];

private var integerText = "";
private var  Track = "";
var DisplayGUI : boolean = true;

var stringToEdit : String = "Write notes here";

@System.NonSerialized
    var currentSlide : int = 0;
    var slideReady : boolean;



function Start () {
	
	GameRunning = false;
	atEndGame = false;
	TextTarget = GameObject.Find("GUI Text");
}

function SkyBoxTint(){
	RenderSettings.skybox.SetColor("_Tint", Color( r/255, g/255, b/255, 0.5) );
}

function GetValue(pinValue : int){
//print(pinValue + "   " + (pinValue/1024));
//Do some math?
ArduinoValue =  (1.0*pinValue)/1024.00;//Normalize between 0 and 1;
}

function Update ()
{

	if (Input.GetKeyDown(KeyCode.R)){
	Invoke("EndGame",0);
	}
	if(Input.GetKeyDown(KeyCode.K)){
	DisplayGUI = !DisplayGUI;
	}
	
	if(DisplayGUI){
	SkyBoxTint(); 
	}
	
	if( ArduinoCtrl == true ){
	targetValue = ArduinoValue - 1.0;
	targetValue = ( 1.0 * targetValue * ArduinoAdjustMult) - ArduinoAdjustSub;
	//reversi
	//targetValue = ( )
	
//	print(targetValue);
	}
	
	else{
	var mousePos = Input.mousePosition ;
	mousePos.z = 1; // select distance = 10 units from the camera
	var newPos  = (Camera.main.ScreenToWorldPoint(mousePos));
	targetValue	= newPos.x;
	print(targetValue);
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
	Rhand.transform.rotation = Quaternion.Euler(0,-targetValue * 35,0);
	Lhand.transform.rotation = Quaternion.Euler(0,targetValue * 35,0);
  }
}

function Clap(){

	TotalClaps++;
	//Make some noize
	audio.PlayOneShot(ClapSounds[clapSelection]);
	if(TotalClaps == 1 && !audio.isPlaying){ //Clap once to begin
	Invoke("PlaySong", 0);
	Invoke("EndGame", songs[songSelection].length + 1);
	}
	if(FXPrefab){
		var FX = Instantiate(FXPrefab);
		FX.AddComponent ("TimedObjectDestructor");
		FX.transform.position.z  -= 5;
	}
	
	if(TextTarget){	
	TextTarget.guiText.text = "" + (TotalClaps) +" Claps!"; 
	}

}

function EndGame(){
//Play Horray sound
//ask to play again or play the curtain game
atEndGame = true;

}


var atEndGame : boolean;

function OnGUI () {

	if(atEndGame){
		GUILayout.BeginArea(new Rect(0, 0, Screen.width, Screen.height));
		GUILayout.FlexibleSpace();
		
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		 
		GUILayout.Label("Begin again, or play a different game?");
		 
		GUILayout.FlexibleSpace();
		
		GUILayout.EndHorizontal();
		GUILayout.FlexibleSpace();
		
		GUILayout.BeginHorizontal();
		if(GUILayout.Button("Start over")){
		print("reload Level");
				Application.LoadLevel(Application.loadedLevel);
		}
		if(GUILayout.Button("Play Curtain Game")){
				print("load curtain Level");
				Application.LoadLevel("Curtains");
		}
		
		GUILayout.EndHorizontal();
		
		GUILayout.FlexibleSpace();
		GUILayout.EndArea();
	}

	if(DisplayGUI){

GUI.DrawTexture (Rect (0, 0, Screen.width, Screen.height), BlackTexture);	
 stringToEdit = GUILayout.TextField (stringToEdit, 100);

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
		 repeatSong = GUILayout.Toggle(repeatSong, " Repeat ");
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
//				    if (int.TryParse(integerText, incrementValue)){
//				   // print(incrementValue);
//				    }
//				    else{
//				    incrementValue = 2;
//				    }
//			    }
//		 GUILayout.EndHorizontal();
       
        /*
	    GUILayout.Label("BackgroundColor");		r = GUILayout.HorizontalSlider(r,0,255,GUILayout.Width(255));	g = GUILayout.HorizontalSlider(g,0,255,GUILayout.Width(255));	b = GUILayout.HorizontalSlider(b,0,255,GUILayout.Width(255));
		*/
		//Start Game:
	if(GUILayout.Button("StartGame")){
		GameRunning = true;
		DisplayGUI = false;
		BroadcastMessage("GetString",stringToEdit);
		BroadcastMessage("StartRecord", 1);
	}
	}//DisplayGui
//	GUILayout.EndArea ();
}


function StopSong(){
//THis is a placeholder for actuall edited songs. //audio.Stop(); //var notes : gameObject = GameObject.Find("MusicalNotes");//Destroy(notes);
 FXMuscialNotes.SetActive(false);
}

function PlaySong(){
if(!audio.isPlaying){
	//FXMuscialNotes.SetActive(true);
	if(repeatSong){
				
		audio.PlayOneShot(songs[songSelection]);
	}
	
	else{
		
		audio.PlayOneShot(songs[songSelection]);
		//songSelection++;
		}
	}
	//Display song name somehow
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



function OldClap(){
	 FXMuscialNotes.SetActive(false); //No music notes while clapping

	if(RepsBeforeReward == ClapNumber){
		//Invoke("StopSong",0);//Find another way to stop the songs
		Invoke("PlaySong",1);
		Invoke("StopSong", 15);//Find another way to stop the songs
		if ( (RepsBeforeReward + incrementValue) <= 9){//maxincrementValue
			RepsBeforeReward = RepsBeforeReward + incrementValue;//Stop this at some point
		}
		ClapNumber = 0;
	}
	else{		//Make some noize
		audio.PlayOneShot(Tada);
	}

	//Make an effect happen.
	if(FXPrefab){
		var FX = Instantiate(FXPrefab);
		FX.AddComponent ("TimedObjectDestructor");
		FX.transform.position.z  -= 5;
	}
	if(TextTarget && (RepsBeforeReward != ClapNumber) ){
	
	TextTarget.guiText.text = "Clap "+ (RepsBeforeReward - ClapNumber) +" More Times!"; 
	}
	
	if((ClapNumber < FXnumbers.length)){
	
		var numdisplay = Instantiate(FXnumbers[ClapNumber]);
		var NumTarget = GameObject.Find("NumTarget");
		// TODO  //Find all other numbers and destroy them
		if (NumTarget){
		numdisplay.transform.rotation = NumTarget.transform.rotation;
		numdisplay.transform.position = NumTarget.transform.position;	
		numdisplay.AddComponent ("TimedObjectDestructor");
		//numdisplay.AddComponent(TBD) // make a script to scale and float up the number FX.
		}
	}
	else{
		//reset!
		ClapNumber = 0;
		TotalClaps++;
	}
	ClapNumber++;
	TotalClaps++;
	
}//claps