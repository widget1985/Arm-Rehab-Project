using UnityEngine; using System.Collections;



//RENAME THIS CLASS

public class HingeScriptClamp : MonoBehaviour {

    public float speed = 25;
    private float currentRot;
	
	public float StartAngle = -60;
	public float NetHeightRotationSpeed = 10.0f;
	float rotationvalue = 0;
    public float EndAngle = -145; 
	
	
	void Start(){
		//tumbleweeds
	}	
	
	
	void SetPosition(int position){
		
		switch(position){
			
		case 0 :
			//right side
			break;
			
		case 1 :
			//left side
			
			break;
			
		default:
			//defult to last?
			break;
		}
		
		
		
	}
	
    // Update is called once per frame
    void Update ()
    {
     
    //Obtain mouse wheel input
    float mouseWheel = Input.GetAxis("Mouse ScrollWheel") * speed;
     
    if(mouseWheel != 0)
    {
    //Increment rotation by mouseWheel value
    currentRot = Mathf.Lerp (currentRot, currentRot - mouseWheel, Time.time);
     
    //Clamp it to between 0 and 45 degs (Thanks whydoidoit!!!)
    currentRot = ClampAngle(currentRot, EndAngle, StartAngle);
     
    //Apply rotation
			
    transform.localEulerAngles = new Vector3(0, currentRot, transform.localEulerAngles.z);
			
	//		Mathf.PingPong(Time.time, 3), transform.position.y, transform.position.z);
    }
		else{
			 rotationvalue = Mathf.PingPong( Time.time * NetHeightRotationSpeed, 45.0f);
			 transform.localEulerAngles = new Vector3(0, currentRot, rotationvalue);
			
		}
     
    }
     
    float ClampAngle(float angle, float min, float max)
    {
	    bool inverse = false;
	    var tmin = min;
	    var tangle = angle;
	    if(min > 180)
	    {
		    inverse = !inverse;
		    tmin -= 180;
	    }
	    if(angle > 180)
	    {
		    inverse = !inverse;
		    tangle -= 180;
	    }
	    var result = !inverse ? tangle > tmin : tangle < tmin;
	    if(!result)
		    angle = min;
	     
	    inverse = false;
	    tangle = angle;
	    var tmax = max;
	    if(angle > 180)
	    {
		    inverse = !inverse;
		    tangle -= 180;
	    }
	    if(max > 180)
	    {
		    inverse = !inverse;
		    tmax -= 180;
	    }
	     
	    result = !inverse ? tangle < tmax : tangle > tmax;
	    if(!result)
		    angle = max;
	    return angle;
    }

}