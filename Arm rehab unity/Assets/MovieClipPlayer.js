#pragma strict

/*
//Notes:
You can't seek movie clips in Unity
You can Fast foward or slow down by manipulating the attached audio clip though

*/


var ClipLength : float;
private var TotalRepNumber : int;
var RepNumber : int;
var movTexture : MovieTexture;


function Start () {
renderer.material.mainTexture = movTexture;

}

function Update () {

}



function PlayClip(){
	movTexture.Play();
	Invoke("PauseClip",ClipLength);

}


function PauseClip(){
	movTexture.Pause();
}

