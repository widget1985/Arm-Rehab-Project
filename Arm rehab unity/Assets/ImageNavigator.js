#pragma strict

import  System.IO;


var fileDirs : String[];
var MovieScreen : GameObject;
var bunch : Texture2D[];
var ImageDir : String[,] = new String[20,200];

var ButtonImages : Texture2D[] = new Texture2D[5];
var currentTexture : Texture2D;
var IncrementalNum : int = 0;

var GalleryNum : int = 0;
var showChoices : boolean;

function Awake () {
   //THIS MAY ALL NOT BE NESSESARY
	var oneLevelUp = Application.dataPath + "/../";
	//var dirInfo = new System.IO.DirectoryInfo(oneLevelUp).GetFiles();
	fileDirs = Directory.GetDirectories(Application.dataPath+"/Resources");
    for (var i : int = 1; i < fileDirs.length; i++){
    
   		var filePaths : String[] = Directory.GetFiles(fileDirs[i],"*.jpg");
   		
		for (var j : int = 0; j < filePaths.length; j++){  
				if(filePaths[j] != null){
					var dingbat : String = Path.GetFullPath(filePaths[j])	;
				    var alength : int = (Application.dataPath+"/Resources").length +1;
					dingbat = dingbat.Remove(0,alength);
			   		var pathf = dingbat.Replace('\\', '/');
					ImageDir[i,j] = pathf;
			}
	    }    
	}
	
	//Invoke("LoadThumbImages", 2);
}

function Update(){
	
	if(Input.GetKeyDown(KeyCode.K)){
		showChoices = ! showChoices;
	}
	if(Input.GetKeyDown(KeyCode.LeftArrow) || Input.GetKeyDown(KeyCode.A)){
		 ReverseImg();
		 print("Last Image");
	}
	
}

function ChangeGallery( num : int){

	GalleryNum = num;

}


function ShowChoices(showem : boolean){

//showChoices = showem;

}

function ReverseImg(){

IncrementalNum = IncrementalNum - 2  ;// DOES THIS WORK?????
ChangeImg();
print("Last Image");
}



function ChangeImg(){
	
	var Gallery: String = GalleryNum.ToString();
	var textures : Object[] = Resources.LoadAll(Gallery, Texture2D);
	if(IncrementalNum < textures.length){
	
		var texture : Texture2D  = textures[IncrementalNum] as Texture2D;
		currentTexture = texture;
		IncrementalNum++;
		
	}
	else{
		IncrementalNum = 0;
		ChangeImg();
	}	
		
	if(currentTexture != null){
		MovieScreen.renderer.material.mainTexture = currentTexture;
	}
}
