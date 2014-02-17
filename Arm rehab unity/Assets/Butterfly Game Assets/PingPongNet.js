#pragma strict

//delete this script, put everything into the Child, make everything reference the parent.


private var StartPositionY : float;

function Start () {
StartPositionY = this.transform.position.y;
}


//Check if net is on the side !!

function Update () {
transform.position = Vector3(transform.position.x,Mathf.PingPong(Time.time, 2 ) + StartPositionY,transform.position.z);// To speed it up, useTime.time*2`.
}

