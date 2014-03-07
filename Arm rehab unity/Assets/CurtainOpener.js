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
var targetValue : float;

var RepAmount;
var SessionTime;
var FadeOutTimer : int = 5;
var FadeOutPlane : GameObject;
//var DisplayGUI : boolean = true;
var GameRunning : boolean = true;
var Tada : AudioClip;
var changeSlideValue = 0.1;

//Slide Stuff
var slides : Texture2D[]  = new Texture2D[1];
   var screen : GameObject;

 @System.NonSerialized
    var currentSlide : int = 0;
    var slideReady : boolean;


function EndGame(){
//What is this for anymore?
//Play Horray sound  
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
  ArduinoValue =  (1.0*pinValue)/1024.00;  
}

// FadeInOut

public var fadeOutTexture : Texture2D;
public var fadeSpeed = 0.3;
 
var drawDepth = -1000;
 
private var alpha = 1.0; 
 
private var fadeDir = -1;
 


function fadeIn(){
print("Fading_In");
	fadeDir = -1;	
}
  
function fadeOut(){
print("Fading_Out");
	fadeDir = 1;	
}


function Update ()
{

if( (Input.GetKeyDown(KeyCode.Escape))){
//  atEndGame = true;
Protocol.SendMessage("EndExercise");

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
    	   //  Invoke("fadeIn", FadeOutTimer);

    }    
    //var step = speed * Time.deltaTime;			// Move our position a step closer to the target.
	//transform.position = Vector3.MoveTowards(transform.position, target.position, step);
    RCurtain.transform.position.x = Mathf.MoveTowards(RCurtain.transform.position.x, Mathf.Exp(targetValue * moveMultiplyer) + curatinOffset, .4);
    LCurtain.transform.position.x = Mathf.MoveTowards(LCurtain.transform.position.x, -Mathf.Exp(targetValue * moveMultiplyer) - curatinOffset, 0.4);

//Slides Stuff
    if(currentSlide == slides.Length)//Does this work or matter anymore?
	{
		currentSlide = 0;
		audio.PlayOneShot(Tada);
	}
//	print("mathsround  "+Mathf.RoundToInt(newPos.x));
     if(targetValue <= changeSlideValue && !slideReady)  //WARNING< MAGIC NUMBERS FOR SLIDE CUE
     {
     //Change the slide
       ImageNavigator.SendMessage("ChangeImg");
      print("Chnage the slide!");
        
        Invoke("fadeIn", 0);
     
       repNumber++;
     var LvlState;
     if(repNumber <= 1 && Protocol.GetComponent(ProtocolTimer) != null){
     //Have a null value cather here.
    
     var poop = Protocol.GetComponent(ProtocolTimer).state;
 //Protocol.GetComponent(ProtocolTimer).state = LvlState.Wait;
     }
     else if (repNumber >= 1){
   // Protocol.GetComponent(ProtocolTimer).state = LvlState.InProgress;

     }
     
     if (numberGui){  
       numberGui.guiText.text = repNumber.ToString() + " reps";
     }
		CancelInvoke("fadeOut");
	//	CancelInvoke("fadeIn");
       slideReady = true;
       
       
     }
     else if(targetValue > .75){//this used to be rounded to int, why did i do tht?
     slideReady = false;
     CancelInvoke("fadeIn");
      if(!IsInvoking("fadeOut")){
     Invoke("fadeOut", FadeOutTimer);
     }
     }    
}

var atEndGame : boolean;

function OnGUI(){



	if(atEndGame){
		GUILayout.BeginArea(new Rect(0, 0, Screen.width, Screen.height));
		GUILayout.FlexibleSpace();
		
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		 
		//GUILayout.Label("Again, or play a different game?");
		 
		GUILayout.FlexibleSpace();
		
		GUILayout.EndHorizontal();
		GUILayout.FlexibleSpace();
		
		GUILayout.BeginHorizontal();
		
		if(GUILayout.Button("Start over")){
		  print("reload Level");
		  Application.LoadLevel(Application.loadedLevel);
		
		}
		
		GUILayout.EndHorizontal();		
		GUILayout.FlexibleSpace();
		GUILayout.EndArea();
	}
	else{
	alpha += fadeDir * fadeSpeed * Time.deltaTime;	
	alpha = Mathf.Clamp01(alpha);	
 
	GUI.color.a = alpha;
 
	GUI.depth = drawDepth;
	FadeOutPlane.renderer.material.mainTexture = fadeOutTexture;
    FadeOutPlane.renderer.material.color.a = alpha;
	//GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeOutTexture);
	
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

