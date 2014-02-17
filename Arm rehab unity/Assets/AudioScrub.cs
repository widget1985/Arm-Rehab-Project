
    using UnityEngine;
    using System.Collections;
     
    public class AudioScrub : MonoBehaviour {
       
        private float scrollPos = 0f;
       private int daOldValue;
	private int theOldValue;
        private void Start() {
            audio.Play();    
        }
 
	public bool ArduinoCtrl;
public float ArduinoValue;
public float targetValue;
	public float ArduinoAdjustMult = 2.0f;
	public float ArduinoAdjustSub = 1.0f;
	
	void GetValue(int pinValue){
		ArduinoValue =  (1.0f*pinValue)/1024.00f;
		//print ("C#valueget");
	}
	
		 void Update(){
		
		
		if(ArduinoCtrl == true){
			
		targetValue = ArduinoValue;
			targetValue = ( 1.0f * targetValue * ArduinoAdjustMult) - ArduinoAdjustSub;
			float theValue = (targetValue + 1.0f) * 7.0f;
		
		int theInt = Mathf.RoundToInt(theValue);
//		Debug.Log(" "+theValue  + "mod"+ (theInt) );
		
			if (theInt != theOldValue){
			
			audio.Play();
	        audio.pitch = (targetValue + 2.0f) ;
			theOldValue = theInt;	
			}		
		}
		else{
		 Vector3 mousePos = Input.mousePosition ;

    mousePos.z = 1; // select distance = 10 units from the camera
	Vector3 newPos  = Camera.main.ScreenToWorldPoint(mousePos);
    // this.transform.position.z = Mathf.Lerp(this.transform.position.z,  newPos.z , Time.time);
    //print(mousePos.x + " is the mouse pos " + newPos.x + " is the mouse to world point");
    
 
		//audio.Play();
      //  audio.pitch = (newPos.x + 1.0f) ;
		float daValue = (newPos.x + 1.0f) * 7.0f;
		
		int daInt = Mathf.RoundToInt(daValue);
		//Debug.Log(" "+daValue  + "mod"+ (daInt) );
		
		if (daInt != daOldValue){
		
		audio.Play();
        audio.pitch = (newPos.x + 2.0f) ;
			daOldValue = daInt;
			
		}
		}
   }//update	
}


