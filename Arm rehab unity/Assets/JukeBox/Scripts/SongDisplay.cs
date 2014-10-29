using UnityEngine;
using CorruptedSmileStudio.JukeBox;

/// <summary>
/// Used as an example song displayer on song change.
/// </summary>
[RequireComponent(typeof(Jukebox))]
public class SongDisplay : MonoBehaviour
{
    /// <summary>
    /// The JukeBox component
    /// </summary>
    private Jukebox box;
    /// <summary>
    /// Whether the title is showing at the moment.
    /// </summary>
    private bool showTitle = false;
    /// <summary>
    /// What the current title is.
    /// </summary>
    private string songTitle = "";
    /// <summary>
    /// The time to display the title for.
    /// </summary>
    public float secondsForTitle = 2.0f;
    /// <summary>
    /// The GUISkin to use for displaying the title.
    /// </summary>
    public GUISkin skin;
    /// <summary>
    /// The width of the title box
    /// </summary>
    private float boxWidth = 0;

    /// <summary>
    /// Gets the JukeBox component and ensures that the SongChange delegate is set.
    /// </summary>
    void Start()
    {
        box = gameObject.GetComponent<Jukebox>();
        box.AddHandler(SongTitle);
    }
    /// <summary>
    /// The delegate to be called from the Jukebox component
    /// </summary>
    /// <param name="title">The song Title.</param>
    void SongTitle(object sender, JukeBoxArgs args)
    {
        CancelInvoke();
        songTitle = args.ToString();
        boxWidth = songTitle.Length * 8;
        showTitle = true;
        Invoke("TurnOffTitle", secondsForTitle);
    }
    /// <summary>
    /// Turns off the song title display.
    /// </summary>
    void TurnOffTitle()
    {
        showTitle = false;
    }
    /// <summary>
    /// Used to show the song title.
    /// </summary>
    void OnGUI()
    {
        GUI.skin = skin;
        if (showTitle)
        {
            GUI.Box(new Rect((Screen.width / 2.0f) - (boxWidth / 2), Screen.height - 60.0f, boxWidth, 60.0f), songTitle);
        }
    }
}