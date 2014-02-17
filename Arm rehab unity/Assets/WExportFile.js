import System;
import System.IO;

//this is the script which enables you to save and load text files in your project
//simply call the static functions Save.SaveTextFile(...) or Save.LoadTextFile(...) from anywhere within this project

static function SaveTextFile ( fileName : String, fileContent : String ) {
   var sw : StreamWriter = new StreamWriter ( fileName );
   sw.Write ( fileContent );
   sw.Close ();
   print ( "Saved " + fileName );
}

static function LoadTextFile ( fileName : String ) {
   var t : String = "";
   var line : String = "-";
   try {
      var sr : StreamReader = new StreamReader ( fileName );
      line = sr.ReadLine();
         while (line != null) {
            t += line;
			line = sr.ReadLine();
			if ( line != null ) {
				t += "\n";
			}
         }
      sr.Close();
      print ( "Loaded " + fileName );
   }
   catch (e) {
      print ( "Error: " + fileName );
   }
   return t;
}