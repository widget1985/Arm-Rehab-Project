    function Update() {
    var mousePos = Input.mousePosition;
    mousePos.z = 1; // select distance = 10 units from the camera
//    Debug.Log(Camera.main.ScreenToWorldPoint(mousePos));
    var newPos  = (Camera.main.ScreenToWorldPoint(mousePos));
    this.transform.position.z = newPos.z;
    }