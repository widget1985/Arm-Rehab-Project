#pragma strict




var ProtocolObject : GameObject;
private var tmp : GameObject ;


function Awake(){
tmp = GameObject.Find("Protocol");
if (tmp == null){
var createdObject = Instantiate(ProtocolObject);
createdObject.name = "Protocol";
}
else{
Destroy(this.gameObject);
}
}