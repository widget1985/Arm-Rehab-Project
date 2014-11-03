#pragma strict
/*******************
Version 2.0!
Rewritten a little 3/21/2014 to read images from the data folder.
Needs some cleaning up.

**************/


import  System.IO;

var fileDirs : String[];
var MovieScreen : GameObject;
//var bunch : Texture2D[];
var ImageDir : String[,] = new String[20,200];

var currentTexture : Texture2D;
var IncrementalNum : int = 0;

var GalleryNum : int = 0;
var showChoices : boolean;

private var filesLocation : String = "C:/Data";
var image : Texture2D[];

public var images = new Array();
public var galleryNumber : int;
//SET I HERE

function GetFilePaths(){

var dInfo : DirectoryInfo = DirectoryInfo(filesLocation);
var subdirs: DirectoryInfo[] = dInfo.GetDirectories();
		for(var i = 0; i < dInfo.GetDirectories().Length; i++){
		//LoadThumbs(Directory.GetFiles(subdirs[i].FullName, "*.jpg", SearchOption.AllDirectories),0);
	}//LOADING TOOO MANY IMAGES CAN BE DANGEROUS
				LoadAll(Directory.GetFiles(subdirs[galleryNumber].FullName, "*.jpg", SearchOption.AllDirectories));
				print("images loading!");

}
var imagedex : int = 0;
var builtinArray : Texture2D[] = images.ToBuiltin(Texture2D) as Texture2D[];//please change the name of this variable

function LoadAll( filePaths : String[]) {
		for(var filePath : String in filePaths) {
			var load : WWW = new WWW("file:///"+filePath);
			
			 yield load;
			if (!String.IsNullOrEmpty(load.error)) {
				Debug.LogWarning(filePath + " error");
			} else {
//			print("GEttingImages?");
				images.Push(load.texture);
				//image[imagedex]= load.texture;
				//imagedex++;
				builtinArray = images.ToBuiltin(Texture2D) as Texture2D[];
				
			}
		}
		
	}

function Update(){
	/*
	if(Input.GetKeyDown(KeyCode.K)){
		showChoices = ! showChoices;
	}
	*/
	if(Input.GetKeyDown(KeyCode.LeftArrow) || Input.GetKeyDown(KeyCode.A)){
		 ReverseImg();
		 print("Last Image");
	}
	
}

function SetGallery(dirNum : int){
galleryNumber = dirNum;
GetFilePaths();

}

function ChangeGallery( num : int){ //Depreciated
	GalleryNum = num;
}

function ReverseImg(){
if(IncrementalNum > 1 && (builtinArray.length > 0)){
IncrementalNum = IncrementalNum - 2  ; //This works, but I have no idea why
ChangeImg();
print("Last Image");
}
}


function ChangeImg(){
//print("time to change the image");
if((builtinArray.length > 0)){  //Added to fix errant testng bugs, let me know if it broke anyhting
if(IncrementalNum < builtinArray.length) {
	
		var texture : Texture2D  = builtinArray[IncrementalNum] as Texture2D;
		currentTexture = texture;
		IncrementalNum++;
		
	}
	else {
		IncrementalNum = 0;
		ChangeImg();
		}	
		
		if(currentTexture != null) {
			MovieScreen.renderer.material.mainTexture = currentTexture;
		}
	}
}
//JUNK Sunk Below Here:
/*
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
*/
/*
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
*/