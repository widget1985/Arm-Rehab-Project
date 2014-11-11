//Written by Widget, 2013
/*
//To do:
var FadeOutOption : boolean;
*/

private var Protocol;
public var Reversi : boolean = false;
public var BlackScreen : boolean = false;// Handle with setup
public var outerLimit : float = -1.0;// Handle with setup //do not adjust your tv set
var thresh : float;    //SEDA 
var repNumber : int = 0;
var numberGui : GameObject;
var RCurtain : GameObject;
var LCurtain : GameObject;
var moveMultiplyer : float = 1.0;
var curatinOffset = -0.5;
var ImageNavigator : GameObject;

var minValue : float;//
var maxValue : float;//When to change slides

var BlackTexture : Texture2D;
var DarkScreenObject : GameObject;

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
var changeSlideValue = 0.1; //originally 0.1

//Slide Stuff
var slides : Texture2D[]  = new Texture2D[1];
var screen : GameObject;


@System.NonSerialized
   var currentSlide : int = 0;
   var slideReady : boolean;

function EndGame(){
atEndGame = true;
}

function Start () {
  Protocol = GameObject.Find("Protocol");
  ImageNavigator = GameObject.Find("ImageNavigator");
  if (Protocol){//check agaist nulls for testing
  thresh = Protocol.GetComponent(ProtocolTimer).Threshold; //Seda
  	Protocol.SendMessage("BeginCountDown");
print("CountdownCall Sent To Protocol");
  }
//ImageNavigator.SendMessage("ShowChoices",true);
//Depreciated, replace with something else
	screen.renderer.material.mainTexture = slides[currentSlide];
//screen.pixelInset = new Rect(-slides[currentSlide].width/2, -slides[currentSlide].height/2, slides[currentSlide].width, slides[currentSlide].height);
	currentSlide++;
	numberGui.guiText.text = "Start!";
	
	if(BlackScreen) {
	//DarkScreenObject.SetActive(true);//Doesn't work for whatever reason.
	DarkScreenObject.renderer.enabled = true; 
	print("DARKNESS");
	}
	else {
	DarkScreenObject.renderer.enabled = false;
		print("LIGHT");

	}
}

function GetValue(pinValue : int){
//print(pinValue + "   " + (pinValue/1024)); 
  //print((pinValue/1024));
  ArduinoValue = (1.0*pinValue)/1024.00;  
   //ArduinoValue =(-0.74*2.8)+(2.8*pinValue)/1024.00;  //SEDA
}

// FadeInOut
public var fadeOutTexture : Texture2D;
public var fadeSpeed = 0.3; 

 
private var drawDepth = -1000;
 
private var alpha = 1.0; 
 
private var fadeDir = -1;

function Update () {
	if(Input.GetKeyUp(KeyCode.A)) {
	ArduinoCtrl = ! ArduinoCtrl;
	}
	if(!Reversi) {
	Curtain();
	}
	else{
	ReverseCurtain();
	}
}//update

function ReverseCurtain(){

	changeSlideValue = thresh; //ROUGH DRAFT.  MIGHT NEED grace range

	if( ArduinoCtrl == true ) {
		targetValue = ArduinoValue - 1.0;// HERE REVERSI
		targetValue = ( 1.0 * targetValue * ArduinoAdjustMult) - ArduinoAdjustSub;
	}
	else{
	  var mousePos = Input.mousePosition ;
	  mousePos.z = 1; // select distance = 10 units from the camera
	  var newPos  = (Camera.main.ScreenToWorldPoint(mousePos));
	  targetValue	= newPos.x;
	}
    // this.transform.position.z = Mathf.Lerp(this.transform.position.z,  newPos.z , Time.time);
    //print(mousePos.x + " is the mouse pos " + newPos.x + " is the mouse to world point");  
    if(targetValue > 1.0) {
    	targetValue = 1.0;
    }
    
    RCurtain.transform.position.x = Mathf.MoveTowards(RCurtain.transform.position.x, Mathf.Exp(targetValue * moveMultiplyer) + curatinOffset, .4);
    LCurtain.transform.position.x = Mathf.MoveTowards(LCurtain.transform.position.x, -Mathf.Exp(targetValue * moveMultiplyer) - curatinOffset, 0.4);
 
//Slides Stuff
    if(currentSlide == slides.Length) {//Does this work or matter anymore?
		currentSlide = 0;		audio.PlayOneShot(Tada);
	}
     if(targetValue >= changeSlideValue && !slideReady) { //WARNING< MAGIC NUMBERS FOR SLIDE CLUE.######################## REVERSI     
     //Change the slide
       ImageNavigator.SendMessage("ChangeImg");
      print("Change the slide!");
        
        Invoke("fadeIn", 0);
       repNumber++;    	 
	      
	     if (numberGui  && !BlackScreen){  
	       numberGui.guiText.text = repNumber.ToString() + " reps"; //display number of reps
	     }
		CancelInvoke("fadeOut");
       slideReady = true;
       
     }
     else if(targetValue < .4) {
     slideReady = false;
     CancelInvoke("fadeIn");
      if(!IsInvoking("fadeOut")){
     Invoke("fadeOut", FadeOutTimer);
     }
     }  
}

function Curtain() {
	if( ArduinoCtrl == true ){
		targetValue = ArduinoValue - 1.0;
		targetValue = ( 1.0 * targetValue * ArduinoAdjustMult) - ArduinoAdjustSub;
		//print(targetValue); //
	}
	else{
	  var mousePos = Input.mousePosition ;
	  mousePos.z = 1; // select distance = 10 units from the camera
	  var newPos  = (Camera.main.ScreenToWorldPoint(mousePos));
	  targetValue = newPos.x;
	}
    // this.transform.position.z = Mathf.Lerp(this.transform.position.z,  newPos.z , Time.time);
    //print(mousePos.x + " is the mouse pos " + newPos.x + " is the mouse to world point");  
    if(targetValue > 1.0){
    	targetValue = 1.0;
    }    
    
    //var step = speed * Time.deltaTime;			// Move our position a step closer to the target.
	//transform.position = Vector3.MoveTowards(transform.position, target.position, step);
    RCurtain.transform.position.x = Mathf.MoveTowards(RCurtain.transform.position.x, Mathf.Exp(targetValue * moveMultiplyer) + curatinOffset, 0.4);
    LCurtain.transform.position.x = Mathf.MoveTowards(LCurtain.transform.position.x, -Mathf.Exp(targetValue * moveMultiplyer) - curatinOffset, 0.4);
 
//Slides Stuff
    if(currentSlide == slides.Length) {//Does this work or matter anymore?
		currentSlide = 0;
		audio.PlayOneShot(Tada);
	}
//	print("mathsround  "+Mathf.RoundToInt(newPos.x));
     if(targetValue <= changeSlideValue && !slideReady)  //WARNING< MAGIC NUMBERS FOR SLIDE CLUE.
      
     {
      ImageNavigator.SendMessage("ChangeImg");     //Change the slide
      print("Change the slide!");
        
     Invoke("fadeIn", 0);
     
     repNumber++;
     
     
     if (numberGui && !BlackScreen){  
       numberGui.guiText.text = repNumber.ToString() + " reps";
     }
		CancelInvoke("fadeOut");
	//	CancelInvoke("fadeIn");
       slideReady = true;
       
     }
     else if(targetValue > .75){//this used to be rounded to int, why did i do tht?
     	slideReady = false;
    	CancelInvoke("fadeIn");
    	
        if(!IsInvoking("fadeOut")) {
     		Invoke("fadeOut", FadeOutTimer);
     	}
     }  
}

var atEndGame : boolean;

function OnGUI(){
	if(atEndGame){
	//preprotocol old stuff was here
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
}

function fadeIn() {
	fadeDir = -1;	//print("Fading_In");
}
  
function fadeOut() {
	fadeDir = 1;	//print("Fading_Out");
}

