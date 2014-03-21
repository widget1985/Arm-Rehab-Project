using UnityEngine;

using System.Collections;
using System.Collections.Generic;
using System.IO;

public class LoadAllFromFolder : MonoBehaviour {
	
	public string filesLocation = @"C:/images";
	public List<Texture2D> images = new List<Texture2D>();
	
	public IEnumerator Start () {
		DirectoryInfo dInfo = new DirectoryInfo(filesLocation);
		DirectoryInfo[] subdirs = dInfo.GetDirectories();
		//string subdir;
		for(int i = 0; i < dInfo.GetDirectories().Length; i++){
		print (subdirs[i].FullName);
			yield return StartCoroutine(
				"LoadAll",
				Directory.GetFiles(subdirs[i].FullName, "*.jpg", SearchOption.AllDirectories)
				);
	}

		yield return StartCoroutine(
			"LoadAll",
			Directory.GetFiles(filesLocation, "*.jpg", SearchOption.AllDirectories)
			);
	}
	
	public IEnumerator LoadAll (string[] filePaths) {
		foreach (string filePath in filePaths) {
			WWW load = new WWW("file:///"+filePath);
			yield return load;
			if (!string.IsNullOrEmpty(load.error)) {
				Debug.LogWarning(filePath + " error");
			} else {
				images.Add(load.texture);
			}
		}
	}
}