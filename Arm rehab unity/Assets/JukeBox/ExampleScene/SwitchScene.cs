using UnityEngine;
using System.Collections;

/// <summary>
/// Test for switching scenes and keeping jukebox playing.
/// </summary>
public class SwitchScene : MonoBehaviour
{
    /// <summary>
    /// The scene index to switch to
    /// </summary>
    public int scene;

    void OnGUI()
    {
        GUI.Label(new Rect(200, 0, 180, 25), "Scene: " + Application.loadedLevel);
        if (GUILayout.Button("Switch Scene"))
        {
            Application.LoadLevel(scene);
        }
    }
}