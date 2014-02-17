#pragma strict

public var Target : Transform;
var StartPosition : Vector3;
public var speedAdjust : float = 1;

var behaviourType : int = 1 ;

var onetime = false;
var GameManager : GameObject;
var PositionNumber : int;
 
 var ParticleFX : GameObject;
 var flowerTime : float = 5.0;
 
 
 var scared : boolean;
/*TODO LIST:


1. Make butterflys run away from net
2. Set wait time to difficulty
3. BEES?


*/

//butterfly position show be by collum or row,   if the row matchs the net, it should stay, else, flee


function Awake () {
	//Locate Target:
	
	//var Target = GameObject.Find("Butterfly target").GetComponent(Transform);
	GameManager  = GameObject.Find("ButterflyGameManager");


	StartPosition  = this.transform.position;
//Make unique, scale, tint, etc.	

}

function GameStart (){

}

function GameEnd (){


}

function GetTarget(){
//Possibly surperflous function.
 Target = GameObject.Find("Butterfly target _ m").GetComponent(Transform); // make this random or something.  tags!  thats the ticket.....
 //get an array of all the targets (maybe even from the manager
 //choose a random number in that array
 //Bam!
}

function Update () {
	
	if(scared){
	behaviourType = 4;
	}
	else{
	//behaviourType = 3;  //or
	Invoke("ResetBehavior", Random.Range(1,6));
	}
	
	if (behaviourType == 3){
	Invoke("ResetBehavior", 3.0); //make this more random?
	}
	
	if(Target != null){
	switch(behaviourType)
		{
		case 1:
		 this.transform.position = Vector3.Lerp(this.transform.position, Target.transform.position, Time.deltaTime * speedAdjust);
		   break;
		   
		   case 2:
		   if (!onetime)
			{
				wait();
				onetime = true;
			}
				//wait for awhile
		   break;
		   
		case 3:
			this.transform.position = Vector3.Lerp(this.transform.position, StartPosition, Time.deltaTime * speedAdjust * 1);
			
			// return
			//StartPosition
		    break;
		    
		  case 4:
		  this.transform.position = Vector3.Lerp(this.transform.position, StartPosition, Time.deltaTime * speedAdjust * 1);
			
			// return
			//StartPosition
		    break;
		  
		default:
		  Destroy(this.gameObject);
		  //Because fuck you buttryfly
		}
	 
 }//if target
 else{
//	 print(Target + " Lost butterfly");
	 GetTarget();
 }
}

function ResetBehavior(){
behaviourType = 1;
}

function OnTriggerEnter(collider : Collider){
  //print(collider.name);
	if(collider.tag == "Butterfly target"){
	behaviourType = 2;
  //Maybe use invoke here?
}
if(collider.tag == "ButterflyNet"){
print("Gotcha!");

//guiText.text = "Hello";
//GameManager.GetComponent(ButterflyGameManager).NumberCaught++;
//USE sendMessage Instead
Instantiate(ParticleFX, transform.position, Quaternion.identity);
GameManager.GetComponent(ButterflyGameManager).SendMessage("ButterflyCaught", PositionNumber);

	behaviourType = 10;
}


}

function wait(){
	//make this random
	yield WaitForSeconds(flowerTime);
	behaviourType = 3;

}



function CoastIsClear(){

scared = false;
}

function Flee(){

//Do some sort of dance in place
	//Get net position.   

	var notResting;
	var netPosition;
	
	//print("Flee!!!!");
	//If not on a flower, flee immediatly, if on a flower, flutter for a sec then take off.   Must give just enough time for net to reach.
	scared = true;
	var PanicTime = 1;
	yield WaitForSeconds(PanicTime);
	behaviourType = 3; //return to base
	
	if(netPosition == notResting){
	
	
	
	}
	

}
