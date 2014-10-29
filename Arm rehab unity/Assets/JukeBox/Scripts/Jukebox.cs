using CorruptedSmileStudio.JukeBox;
using System.Collections.Generic;
using UnityEngine;
/// <summary>
/// The Jukebox MonoBehaviour class, handles playing and changing the song.
/// </summary>
[RequireComponent(typeof(AudioSource))]
public class Jukebox : MonoBehaviour
{
    /// <summary>
    /// The songs to be played.
    /// </summary>
    public List<PlayList> playlists = new List<PlayList>();
    /// <summary>
    /// The audio source from where the sound will be playing.
    /// </summary>
    private AudioSource source;
    /// <summary>
    /// The current song to be played.
    /// </summary>	
    public int currentSong = 0;
    /// <summary>
    /// The current playlist being used
    /// </summary>
    public int currentPlaylist = 0;
    /// <summary>
    /// Ensures that only one jukebox instance will be available throughout a gameplay.
    /// </summary>	
    private static Jukebox tmp;
    /// <summary>
    /// The actual volume of the music. Do not edit this to change voume
    /// </summary>
    public float _volume = 100.0f;
    /// <summary>
    /// Whether to play a random song instead of in order.
    /// </summary>
    public bool random = false;
    /// <summary>
    /// Repeat the current song
    /// </summary>
    public bool repeat = false;
    /// <summary>
    /// Delegate signature that will be called on song change.
    /// </summary>
    /// <param name="args">The JukeBoxArgs that contains the song title and artist.</param>
    /// <param name="sender">The Jukebox.</param>
    public delegate void SongChangeHandler(object sender, JukeBoxArgs args);
    /// <summary>
    /// Whether to start playing once the class has loaded.
    /// </summary>
    public bool playOnStart = false;
    /// <summary>
    /// The folder from which to search for files to load.
    /// </summary>
    public string folderToLoad = "";
    /// <summary>
    /// Whether to load from file at JukeBox start
    /// </summary>
    public bool loadFromFile = false;
    /// <summary>
    /// Raised on song changes.
    /// </summary>
    private event SongChangeHandler songChanged;
    /// <summary>
    /// Keeps the JukeBox between scenes
    /// </summary>
    public bool keepBetweenScenes = false;
    /// <summary>
    /// When loading user files. Loads them as 3D sound. 
    /// </summary>
    public bool loadAs3D = false;

    void Awake()
    {
        if (keepBetweenScenes)
        {
            if (tmp != null)
            {
                Destroy(gameObject);
                return;
            }
            else
            {
                DontDestroyOnLoad(gameObject);
                tmp = this;
            }
        }

        source = gameObject.GetComponent<AudioSource>();
        source.playOnAwake = false;
        source.loop = false;
        if (loadFromFile && folderToLoad != "")
            LoadMusicFolder(folderToLoad, playOnStart);
    }

    void OnDisable()
    {
        if (!keepBetweenScenes)
        {
            Stop();
        }
    }

    void Start()
    {
        if (playOnStart)
        {
            if (random)
                NextTrack();
            else
                Play();
        }
    }

    /// <summary>
    /// Plays the next song, if there is no next song plays the first song again.
    /// </summary>
    public void NextTrack()
    {
        Stop();
        if (playlists[currentPlaylist].songs.Count > 0)
        {
            if (!repeat)
            {
                if (random)
                {
                    System.Random ran = new System.Random();

                    int newSong = currentSong;
                    do
                    {
                        newSong = ran.Next(0, playlists[currentPlaylist].songs.Count);
                    } while (newSong == currentSong);
                    currentSong = newSong;
                }
                else
                {
                    currentSong++;
                    if (currentSong > playlists[currentPlaylist].songs.Count - 1)
                        currentSong = 0;
                }
            }
            Play();
        }
    }
    /// <summary>
    /// Plays the previous song, if there is no previous song plays the last song in the list.
    /// </summary>
    public void PreviousTrack()
    {
        Stop();
        if (playlists[currentPlaylist].songs.Count > 0)
        {
            if (!repeat)
            {
                if (random)
                {
                    System.Random ran = new System.Random();

                    int newSong = currentSong;
                    do
                    {
                        newSong = ran.Next(0, playlists[currentPlaylist].songs.Count);
                    } while (newSong == currentSong);
                    currentSong = newSong;
                }
                else
                {
                    currentSong--;
                    if (currentSong < 0)
                        currentSong = playlists[currentPlaylist].songs.Count - 1;
                }
            }
            Play();
        }
    }
    /// <summary>
    /// Stops playback.
    /// </summary>
    public void Stop()
    {
        CancelInvoke();
        source.Stop();
        source.clip = null;
    }
    /// <summary>
    /// Starts playing the song at currentSong in the song list.
    /// </summary>
    public void Play()
    {
        CancelInvoke();
        if (playlists.Count > 0 && playlists[currentPlaylist].songs.Count > currentSong && currentSong >= 0)
        {
            currentSong = Mathf.Clamp(currentSong, 0, playlists[currentPlaylist].songs.Count - 1);

            if (playlists[currentPlaylist].songs[currentSong].clip != null)
            {
                source.clip = playlists[currentPlaylist].songs[currentSong].clip;
                SetVolume();
                source.Play();
                Invoke("NextTrack", playlists[currentPlaylist].songs[currentSong].clip.length);
                ShowTitle();
            }
            else
            {
                Debug.LogError(string.Format("Songs element {0} is missing an Audio Clip.", currentSong));
                NextTrack();
            }
        }
    }
    /// <summary>
    /// Starts playing the currentSong in the currentPlaylist
    /// </summary>
    /// <param name="shuffle">Whether to shuffle songs.</param>
    /// <param name="repeat">Whether to repeat the current song.</param>
    public void Play(bool shuffle, bool repeat)
    {
        random = shuffle;
        this.repeat = repeat;
    }
    /// <summary>
    /// Starts playing the track in the currentPlaylist
    /// </summary>
    /// <param name="track">The track number to play (starts at 0)</param>
    /// <param name="shuffle">Whether to shuffle songs</param>
    /// <param name="repeat">Whether to repeat the song</param>
    public void Play(int track, bool shuffle, bool repeat)
    {
        currentSong = track;
        Play(shuffle, repeat);
    }
    /// <summary>
    /// Pauses the jukebox.
    /// </summary>
    public void Pause()
    {
        CancelInvoke();
        if (source.isPlaying)
        {
            source.Pause();
        }
        else
        {
            if (source.clip)
            {
                source.Play();
                Invoke("NextTrack", playlists[currentPlaylist].songs[currentSong].clip.length - source.time);
            }
            else
            {
                Play();
            }
        }
    }
    /// <summary>
    /// Whether there is a song playing or not.
    /// </summary>
    public bool IsPlaying
    {
        get
        {
            return source.isPlaying;
        }
    }
    /// <summary>
    /// The _volume of the music.
    /// </summary>
    public float Volume
    {
        get
        {
            return _volume;
        }
        set
        {
            if (_volume != value)
            {
                _volume = value;
                SetVolume();
            }
        }
    }
    /// <summary>
    /// Returns a formatted string of the current song.
    /// </summary>
    /// <returns>Returns a string of the [Artist] - [Song]</returns>
    public string CurrentSong()
    {
        return playlists[currentPlaylist].songs[currentSong].ToString();
    }
    /// <summary>
    /// The current playlist name
    /// </summary>
    /// <returns>The current Playlist</returns>
    public string CurrentPlaylist()
    {
        return playlists[currentPlaylist].name;
    }
    /// <summary>
    /// Call the SongChange method. Checks if the method has been set. Only calls if been set.
    /// </summary>
    private void ShowTitle()
    {
        if (source.isPlaying)
        {
            if (songChanged != null)
            {
                songChanged(this, new JukeBoxArgs(playlists[currentPlaylist].songs[currentSong].title, playlists[currentPlaylist].songs[currentSong].artist, playlists[currentPlaylist].songs[currentSong].clip.length));
            }
        }
    }
    /// <summary>
    /// Sets the _volume of the source to Volume.
    /// </summary>
    private void SetVolume()
    {
        if (source != null)
        {
            source.volume = _volume / 100.0f;
        }
    }
    /// <summary>
    /// Gets all files in .ogg format within the specified folder. Adds them to the song list.
    /// Should work with Standalones and phones. Consoles and WebPlayers not supported.
    /// </summary>
    /// <param name="folder">The folder to search for music files.</param>
    /// <param name="autoStart">Whether to auto start playing music. If it is currently playing music, it won't start.</param>
    public void LoadMusicFolder(string folder, bool autoStart = false)
    {
#if UNITY_STANDALONE_OSX || UNITY_STANDALONE_WIN || UNITY_EDITOR || UNITY_IPHONE || UNITY_ANDROID
        if (System.IO.Directory.Exists(folder))
        {
            string[] files;
#if UNITY_STANDALONE_OSX || UNITY_STANDALONE_WIN|| UNITY_EDITOR
            files = System.IO.Directory.GetFiles(folder, "*.ogg");
#elif UNITY_IPHONE || UNITY_ANDROID
        files = System.IO.Directory.GetFiles(folder, "*.mp3");
#endif
            PlayList userList = new PlayList("User Songs");
            userList.songs.Capacity = files.Length;
            playlists.Add(userList);
            int place = playlists.Count - 1;
            foreach (string audioFile in files)
            {
                StartCoroutine(LoadSongFromURL(audioFile, autoStart, place));
            }
        }
        else
        {
            Debug.LogError("Folder: " + folder + " does not exist");
        }
#endif
    }
    /// <summary>
    /// Uses WWW to load music files into the jukebox.
    /// </summary>
    /// <param name="url">The path to the song.</param>
    /// <param name="autoStart">Whether to auto play the first song loaded.</param>
    /// <returns>Yield</returns>
    private System.Collections.IEnumerator LoadSongFromURL(string url, bool autoStart, int listPlace)
    {
        WWW web = new WWW(@"file://" + url);

        yield return web;

        if (web.error == null)
        {
            Song song = new Song();
            song.clip = web.GetAudioClip(loadAs3D);

            web.Dispose();

            song.artist = "";
            song.title = url.Substring(url.LastIndexOf(System.IO.Path.DirectorySeparatorChar) + 1);
            song.title = song.title.Substring(0, song.title.LastIndexOf('.')).Replace('_', ' ');
            playlists[listPlace].songs.Add(song);
            Debug.Log("Assigning file: " + url + " at position: " + (playlists[listPlace].songs.Count - 1).ToString());
        }
        else
        {
            Debug.LogWarning("Error reading music file: " + url + " with error: " + web.error);
        }
        if (autoStart && !source.isPlaying)
            Play();
    }
    /// <summary>
    /// Adds a event handler for song changes.
    /// </summary>
    /// <param name="handler">A method that is going to receive events.</param>
    public void AddHandler(SongChangeHandler handler)
    {
        songChanged += handler;
        if (source.isPlaying)
        {
            handler(this, new JukeBoxArgs(playlists[currentPlaylist].songs[currentSong].title, playlists[currentPlaylist].songs[currentSong].artist, playlists[currentPlaylist].songs[currentSong].clip.length));
        }
    }
    /// <summary>
    /// Removes a event handler for song changes.
    /// </summary>
    /// <param name="handler">A method that was going to receive events.</param>
    public void RemoveHandler(SongChangeHandler handler)
    {
        songChanged -= handler;
    }
    /// <summary>
    /// The current time that the clip has played.
    /// </summary>
    public float Time
    {
        get
        {
            return source.time;
        }
        set
        {
            if (source.clip)
            {
                CancelInvoke();
                source.time = value;
                if (playlists[currentPlaylist].songs[currentSong].clip.length - source.time <= 0)
                {
                    NextTrack();
                }
                else
                {
                    Invoke("NextTrack", playlists[currentPlaylist].songs[currentSong].clip.length - source.time);
                }
            }
        }
    }
    /// <summary>
    /// Draws an icon to show where the JukeBox is.
    /// </summary>
    void OnDrawGizmos()
    {
        Gizmos.DrawIcon(transform.position, "../JukeBox/Gizmos/JukeBox.psd");
    }
    /// <summary>
    /// Sets the current playlist via the index, if it is available.
    /// </summary>
    /// <param name="playlistIndex">The index of the playlist in the list of playlists.</param>
    public void SetPlaylist(int playlistIndex)
    {
        if (playlistIndex < 0)
        {
            currentPlaylist = 0;
        }
        else if (playlistIndex > playlists.Count - 1)
        {
            currentPlaylist = playlists.Count - 1;
        }
        else
        {
            currentPlaylist = playlistIndex;
        }
    }
    /// <summary>
    /// Sets the current playlist via the name, if it can be found.
    /// </summary>
    /// <param name="playlistName">The name of the playlist</param>
    public void SetPlaylist(string playlistName)
    {
        playlistName = playlistName.ToLower();
        for (int i = 0; i < playlists.Count; i++)
        {
            if (playlists[i].name.ToLower() == playlistName)
            {
                currentPlaylist = i;
                break;
            }
        }
    }
    /// <summary>
    /// Keeps the JukeBox Component Between Scenes
    /// </summary>
    public bool KeepBetweenScenes
    {
        get
        {
            return keepBetweenScenes;
        }
        set
        {
            keepBetweenScenes = value;
            if (keepBetweenScenes)
            {
                DontDestroyOnLoad(gameObject);
                if (tmp)
                {
                    Destroy(tmp);
                }
                tmp = this;
            }
        }
    }
}