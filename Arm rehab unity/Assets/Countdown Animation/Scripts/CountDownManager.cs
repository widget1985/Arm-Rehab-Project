using UnityEngine;
using System.Collections;

public class CountDownManager : MonoBehaviour
{
	//Store the whole countdown objects
	public GameObject[] countDownObjects;
	
	//Define the countdown starting number, it should between 0-9!
	public int startNumber = 3;
	
	//Define the countdown ending number, it should between 0-9!
	public int endNumber = 0;
	
	//Define whether display the "GO!" logo at the end
	public bool displayGoAtTheEnd = true;
	
	//Define when will start to countdown
	public float startAfterSeconds = 0.0f;
	
	//Time counter
	private float myTime = 0.0f;
	
	//Cache the trasform of object
	private Transform myTrans;
	
	//Define the direction , 1 means from less to more, -1 means from more to less.
	private int direction = -1;
	
	//Define acctually countdown objects
	private GameObject[] countdown;
	
	//Define the trigger of spawn countdown object
	private bool canSpawn  = false;
	private int number;
	// Use this for initialization
	void Start ()
	{
		//Cache the transform
		myTrans = transform;
		
		//If the number out of range, tell the user.
		if(startNumber>9 || startNumber<0 || endNumber >9 || endNumber <0){
			print("StartNumber and EndNumber should between 0-9! Please reinput the numbers.");			
		}
		//Make sure the start and end frame is between 0-9 integer
		startNumber = Mathf.Clamp(startNumber,0,9);
		endNumber = Mathf.Clamp(endNumber,0,9);
		
		
		//Define the correct direction
		if( endNumber > startNumber ){
			direction = 1;
		}
		
		number = startNumber;
		//Whether need to show "GO!" at last
		if(displayGoAtTheEnd){
			
			//Define the acctually countdown objects array
			countdown = new GameObject[Mathf.Abs(endNumber - startNumber) + 2];
			for(int i=0 ; i<countdown.Length-1; i++){
				countdown[i] = countDownObjects[number];
				number += direction;
			}
			
			//If need to show "GO!" at last , add the "GO!" countdown object to the end of array.
			countdown[ countdown.Length -1 ] = countDownObjects[10];
			
		} else {
			//Define the acctually countdown objects array(do not need to show "GO!")
			countdown = new GameObject[Mathf.Abs(endNumber - startNumber) + 1];
			for(int i=0 ; i<countdown.Length; i++){
				countdown[i] = countDownObjects[number];
				number += direction;
			}
		}
		number = 0;
	}
	
	void Update(){
		//Time counter
		myTime+=Time.deltaTime;
		
		//Is it the time to start countdown
		if(myTime >= startAfterSeconds && !canSpawn){
			canSpawn = true;
			myTime =1000000.0f;
		}
		
		//Spawn one countdown object each second by the order
		if(myTime >= 1.0f && canSpawn){
			myTime = 0.0f;
			//If countdown is over, then distroy the object.
			if(number >= countdown.Length){
				SelfDestroy();
			} else {
				SpawnCountDown( number );
			}
				
			number++;
			
		}
	}
	
	//Self destroy function
	void SelfDestroy ()
	{
		Destroy (gameObject);
	}
	
	//Spawn countdown object at current position
	void SpawnCountDown(int number){
		GameObject countNum = Instantiate(countdown[number], myTrans.position,myTrans.rotation) as GameObject;
		countNum.transform.parent = myTrans;
	}
	
}
