using CorruptedSmileStudio.JukeBox;
using UnityEngine;

/// <summary>
/// A Music player frontend, can skip songs, change _volume and seek through songs.
/// </summary>
[RequireComponent(typeof(Jukebox))]
public class MusicPlayer : MonoBehaviour
{
    /// <summary>
    /// The JukeBox component
    /// </summary>
    private Jukebox box;
    /// <summary>
    /// What the current title is.
    /// </summary>
    private string songTitle = "";
    private float length;
    private string time;
    /// <summary>
    /// The GUISkin to use for displaying the title.
    /// </summary>
    public GUISkin skin;
    /// <summary>
    /// Shows the music player.
    /// </summary>
    public bool showPlayer = true;

    private float seekTime = 0.0f;
    private float volume = 0.0f;

    /// <summary>
    /// The Button that indicates play
    /// </summary>
    public GUIContent playButton;
    /// <summary>
    /// The Button that indicates pause
    /// </summary>
    public GUIContent pauseButton;
    /// <summary>
    /// The Button that indicates stop
    /// </summary>
    public GUIContent stopButton;
    /// <summary>
    /// The Button that indicates shuffle
    /// </summary>
    public GUIContent shuffleButton;
    /// <summary>
    /// The Button that indicates non-shuffle
    /// </summary>
    public GUIContent shuffleOffButton;
    /// <summary>
    /// The Button that indicates repeat on
    /// </summary>
    public GUIContent repeatOnButton;
    /// <summary>
    /// The Button that indicates repeat off
    /// </summary>
    public GUIContent repeatOffButton;
    /// <summary>
    /// The Button that indicates next
    /// </summary>
    public GUIContent nextButton;
    /// <summary>
    /// The Button that indicates previous
    /// </summary>
    public GUIContent backButton;

    /// <summary>
    /// Gets the JukeBox component and ensures that the SongChange delegate is set.
    /// </summary>
    void Start()
    {
        useGUILayout = false;
        box = gameObject.GetComponent<Jukebox>();
        volume = box.Volume;
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

        time = GetTime(args.Length);

        length = args.Length;
    }
    /// <summary>
    /// Used to show the song title.
    /// </summary>
    void OnGUI()
    {
        if (showPlayer)
        {
            GUI.skin = skin;
            GUI.BeginGroup(new Rect(Screen.width / 2 - 200, Screen.height / 2 - 100, 400, 200));
            {
                GUI.Box(new Rect(0, 0, 400, 200), "");
                if (GUI.Button(new Rect(385, 0, 15, 20), new GUIContent("--", "Minimise")))
                {
                    showPlayer = false;
                }
                GUI.Label(new Rect(5, 20, 390, 60.0f), songTitle);

                GUI.Label(new Rect(5, 100, 390, 20), string.Format("{0}/{1}", GetTime(box.Time), time));

                seekTime = GUI.HorizontalSlider(new Rect(5, 150, 390, 20), box.Time, 0, length);

                if (GUI.Button(new Rect(5, 170, 40, 25), backButton))
                {
                    box.PreviousTrack();
                    seekTime = 0;
                }
                if (box.random)
                {
                    if (GUI.Button(new Rect(50, 170, 40, 25), shuffleOffButton))
                    {
                        box.random = false;
                    }
                }
                else
                {
                    if (GUI.Button(new Rect(50, 170, 40, 25), shuffleButton))
                    {
                        box.random = true;
                    }
                }
                if (box.repeat)
                {
                    if (GUI.Button(new Rect(95, 170, 40, 25), repeatOffButton))
                    {
                        box.repeat = false;
                    }
                }
                else
                {
                    if (GUI.Button(new Rect(95, 170, 40, 25), repeatOnButton))
                    {
                        box.repeat = true;
                    }
                }
                if (GUI.Button(new Rect(140, 170, 40, 25), stopButton))
                {
                    box.Stop();
                    seekTime = 0;
                }
                if (box.IsPlaying)
                {
                    if (GUI.Button(new Rect(185, 170, 40, 25), pauseButton))
                    {
                        box.Pause();
                    }
                }
                else
                {
                    if (GUI.Button(new Rect(185, 170, 40, 25), playButton))
                    {
                        box.Play();
                    }
                }
                GUI.Label(new Rect(275, 165, 100, 25), box.Volume.ToString("F0"));
                volume = GUI.HorizontalSlider(new Rect(230, 185, 120, 25), box.Volume, 0, 100);

                if (GUI.Button(new Rect(355, 170, 40, 25), nextButton))
                {
                    box.NextTrack();
                    seekTime = 0;
                }
                if (seekTime != box.Time)
                {
                    box.Time = seekTime;
                }
                if (volume != box.Volume)
                {
                    box.Volume = volume;
                }
            }
            GUI.EndGroup();

            if (GUI.tooltip != "")
            {
                Rect tooltip = new Rect(Input.mousePosition.x + 15.0f, Screen.height - Input.mousePosition.y + 2.0f, 100, 25);
                GUI.Box(tooltip, GUI.tooltip);
            }
        }
        else
        {
            if (GUI.Button(new Rect(0, Screen.height - 20, 110, 20), "Music Player"))
            {
                showPlayer = true;
            }
        }
    }
    /// <summary>
    /// Returns the time as minutes:seconds from a length of time in seconds.
    /// </summary>
    /// <param name="time">The length of time in seconds</param>
    /// <returns>Minutes:Seconds</returns>
    string GetTime(float time)
    {
        // Length / 60 = minutes. Point numbers * 60 how many seconds.
        int minutes = Mathf.FloorToInt(time / 60);
        float seconds = Mathf.CeilToInt(time - (minutes * 60));

        if (seconds == 60)
        {
            minutes++;
            seconds = 0;
        }

        return string.Format("{0}:{1}", minutes.ToString().PadLeft(2, '0'), seconds.ToString().PadLeft(2, '0'));
    }
}