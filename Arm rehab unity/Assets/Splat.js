#pragma strict 
 
   
var Clone : GameObject;
var i : float = 0.1;

function Start () {

InvokeRepeating("Spawn",1, 0.1);
//InvokeRepeating("Boom",1,0.01);
}

function Update () {
 if(i > 1000){
 CancelInvoke();
 }
}

function Spawn(){

var evil =Instantiate(Clone, this.transform.position , Quaternion.identity);

evil.transform.rotation = Quaternion.Euler (Random.Range(0, 360),Random.Range(0.5, 360),Random.Range(0.5, 360));


//var state = evil.GetComponent("Animator") as Animator;
//state.speed =  Random.Range(0.01, i );

//evil.transform.localScale = Vector3(Random.Range(0.5, 1),Random.Range(0.5, i/10),Random.Range(0.5, i/5));
i = i + 0.4;



}


var radius = 10.0;
	var power = 10.0;
	function Boom () {
		// Applies an explosion force to all nearby rigidbodies
		var explosionPos : Vector3 = transform.position;
		var colliders : Collider[] = Physics.OverlapSphere (explosionPos, radius);
		
		for (var hit : Collider in colliders) {
			if (!hit)
				continue;
			
			if (hit.rigidbody)
				hit.rigidbody.AddExplosionForce(power, explosionPos, radius, 3.0);
		}
	}