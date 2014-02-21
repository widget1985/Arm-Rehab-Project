//Written by Widget, 2013
/*
//To do:
var FadeOutOption : boolean;


*/

private var Protocol;
var repNumber : int = 0;
var numberGui : GameObject;
var RCurtain : GameObject;
var LCurtain : GameObject;
var moveMultiplyer : float = 2;
var curatinOffset = 0.5;
var ImageNavigator : GameObject;

var minValue : float;//
var maxValue : float;//When to change slides

var BlackTexture : Texture2D;

//Maybe split this out?
var ArduinoCtrl : boolean;
var ArduinoAdjustMult : float = 2.0;
var ArduinoAdjustSub : float = 1.0;

var ArduinoValue : float;
var  targetValue : float;

var RepAmount;
var SessionTime;

//var DisplayGUI : boolean = true;
var GameRunning : boolean = true;
var Tada : AudioClip;

//Slide Stuff
var slides : Texture2D[]  = new Texture2D[1];
   var screen : GameObject;

 @System.NonSerialized
    var currentSlide : int = 0;
    var slideReady : boolean;


function EndGame(){

//Play Horray sound
//ask to play again or play the curtain game
atEndGame = true;

}

function Start () {
Protocol = GameObject.Find("Protocol");
ImageNavigator = GameObject.Find("ImageNavigator");
//ImageNavigator.SendMessage("ShowChoices",true);
//Depreciated, replace with something else
	screen.renderer.material.mainTexture = slides[currentSlide];
		//screen.pixelInset = new Rect(-slides[currentSlide].width/2, -slides[currentSlide].height/2, slides[currentSlide].width, slides[currentSlide].height);
		currentSlide++;
		numberGui.guiText.text = "Start!";
}

function GetValue(pinValue : int){
//print(pinValue + "   " + (pinValue/1024));
//Do some math?
ArduinoValue =  (1.0*pinValue)/1024.00;
}

function Update ()
{

if (Input.GetKey(KeyCode.LeftShift) && Input.GetKeyDown(KeyCode.Q)){
Application.Quit();
}

if(Input.GetKeyDown(KeyCode.P) || (Input.GetKeyDown(KeyCode.Escape))){
atEndGame = true;

}

	if( ArduinoCtrl == true ){
		targetValue = ArduinoValue - 1.0;
		targetValue = ( 1.0 * targetValue * ArduinoAdjustMult) - ArduinoAdjustSub;
//		print(targetValue);
	}
	else{
	  var mousePos = Input.mousePosition ;
	  mousePos.z = 1; // select distance = 10 units from the camera
	  var newPos  = (Camera.main.ScreenToWorldPoint(mousePos));
	  targetValue	= newPos.x;
	}
    // this.transform.position.z = Mathf.Lerp(this.transform.position.z,  newPos.z , Time.time);
    //print(mousePos.x + " is the mouse pos " + newPos.x + " is the mouse to world point");  
    if(targetValue > 1.0){
    	targetValue = 1.0;
    }    
    //var step = speed * Time.deltaTime;		
	// Move our position a step closer to the target.
	//transform.position = Vector3.MoveTowards(transform.position, target.position, step);
    RCurtain.transform.position.x = Mathf.MoveTowards(RCurtain.transform.position.x, Mathf.Exp(targetValue * moveMultiplyer) + curatinOffset, .4);
    LCurtain.transform.position.x = Mathf.MoveTowards(LCurtain.transform.position.x, -Mathf.Exp(targetValue * moveMultiplyer) - curatinOffset, 0.4);

//Slides Stuff
    if(currentSlide == slides.Length)
	{
		currentSlide = 0;
		audio.PlayOneShot(Tada);
	}
//	print("mathsround  "+Mathf.RoundToInt(newPos.x));
     if(Mathf.RoundToInt(targetValue) == 0.000 && !slideReady)
     {
     //Change the slide
     ImageNavigator.SendMessage("ChangeImg");
     
     repNumber++;
     var LvlState;
     if(repNumber <= 1){
     var poop = Protocol.GetComponent(ProtocolTimer).state;
 //Protocol.GetComponent(ProtocolTimer).state = LvlState.Wait;
     }
     else if (repNumber >= 1){
   // Protocol.GetComponent(ProtocolTimer).state = LvlState.InProgress;

     }
     
     if (numberGui){  
     numberGui.guiText.text = repNumber.ToString() + " reps";
     
     }

       slideReady = true;
     }  
     else if(Mathf.RoundToInt(targetValue) > .75){
     slideReady = false;
     }    
}

var atEndGame : boolean;

function OnGUI(){

	if(atEndGame){
		GUILayout.BeginArea(new Rect(0, 0, Screen.width, Screen.height));
		GUILayout.FlexibleSpace();
		
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		 
		GUILayout.Label("Again, or play a different game?");
		 
		GUILayout.FlexibleSpace();
		
		GUILayout.EndHorizontal();
		GUILayout.FlexibleSpace();
		
		GUILayout.BeginHorizontal();
		if(GUILayout.Button("Start over")){
		print("reload Level");
		Application.LoadLevel(Application.loadedLevel);
		
		}
		if(GUILayout.Button("Play Clapping Game")){
				print("load curtain Level");
						Application.LoadLevel("Clapping");

		}
		
		GUILayout.EndHorizontal();		
		GUILayout.FlexibleSpace();
		GUILayout.EndArea();
	}
/*
	if(DisplayGUI){
	//GUI.DrawTexture (Rect (0, 0, Screen.width, Screen.height), BlackTexture);	
    if(GUILayout.Button("StartGame")){
    	BroadcastMessage("GetString",stringToEdit);
		BroadcastMessage("StartRecord", 1);
		GameRunning = true;
		ImageNavigator.SendMessage("ShowChoices",false);
		DisplayGUI = false;
		
	}
  }
  */
}

