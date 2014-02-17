#pragma strict

var CurtainImg : Texture2D;
var ClappingImg : Texture2D;

function Start () {

}

function Update () {
//Put quit message here//

}


function OnGUI (){

//GUILayout.Label("Choose a game");// make this a GUITEXT?

if(	GUI.Button(Rect(Screen.width/1.5 - (CurtainImg.width/5)/2 ,50,CurtainImg.width/5, CurtainImg.height/5), CurtainImg)){
Application.LoadLevel("Curtains");
}
if(	GUI.Button(Rect(Screen.width/1.5 - (ClappingImg.width/3)/2,50 + CurtainImg.height/5,ClappingImg.width/3, ClappingImg.height/3),ClappingImg)){
Application.LoadLevel("Clapping");

}

if(	GUI.Button(Rect(300,200,200, 200),"Quit")){
Application.Quit();

}

}

