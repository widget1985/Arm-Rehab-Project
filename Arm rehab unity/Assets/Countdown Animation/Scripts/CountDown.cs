using UnityEngine;
using System.Collections;

public class CountDown : MonoBehaviour {
	public float disappearAfterTime = 1.0f;
	
	// Use this for initialization
	void Start () {
		Invoke("SelfDestroy",disappearAfterTime);
	}
	
	void SelfDestroy(){
		Destroy(gameObject);
	}
	
}
