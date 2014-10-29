using UnityEngine;
using UnityEditor;
using CorruptedSmileStudio.JukeBox;

/// <summary>
/// Custom inspector for JukeBox component
/// </summary>
[CustomEditor(typeof(Jukebox))]
public class JukeBoxInspector : Editor
{
    bool showPlaylistSection = false;
    Vector2 songSection = new Vector2();
    Vector2 playlistSection = new Vector2();

    Jukebox box;
    /// <summary>
    /// Performs the custom Inspector.
    /// </summary>
    public override void OnInspectorGUI()
    {
        box = (Jukebox)target;
        #region PlaylistAssign
        showPlaylistSection = EditorGUILayout.Foldout(showPlaylistSection, "Playlists");
        if (showPlaylistSection)
        {
            GUI.SetNextControlName("PlaylistAdd");
            if (GUILayout.Button("Add Playlist"))
            {
                box.playlists.Add(new PlayList(""));
            }
            playlistSection = EditorGUILayout.BeginScrollView(playlistSection);
            for (int i = 0; i < box.playlists.Count; i++)
            {
                EditorGUILayout.BeginHorizontal();
                {
                    EditorGUILayout.BeginVertical(GUILayout.Width(80));
                    {
                        GUILayout.Label("Name:");
                    }
                    EditorGUILayout.EndVertical();
                    EditorGUILayout.BeginVertical();
                    {
                        box.playlists[i].name = GUILayout.TextField(box.playlists[i].name);
                    }
                    EditorGUILayout.EndVertical();
                }
                EditorGUILayout.EndHorizontal();
                #region SongSection
                box.playlists[i].showSongs = EditorGUILayout.Foldout(box.playlists[i].showSongs, "Assign Songs");
                if (box.playlists[i].showSongs)
                {
                    GUI.SetNextControlName("SongAdd");
                    if (GUILayout.Button("Add Song"))
                    {
                        GUI.FocusControl("SongAdd");
                        box.playlists[i].songs.Add(new Song());
                    }
                    songSection = EditorGUILayout.BeginScrollView(songSection);
                    {
                        for (int x = box.playlists[i].songs.Count - 1; x >= 0; x--)
                        {
                            EditorGUILayout.BeginHorizontal();
                            {
                                EditorGUILayout.BeginVertical(GUILayout.Width(80));
                                {
                                    GUILayout.Label("Artist");
                                    GUILayout.Label("Title");
                                    GUILayout.Label("Clip");
                                }
                                EditorGUILayout.EndVertical();
                                EditorGUILayout.BeginVertical();
                                {
                                    box.playlists[i].songs[x].artist = EditorGUILayout.TextField(box.playlists[i].songs[x].artist);
                                    box.playlists[i].songs[x].title = EditorGUILayout.TextField(box.playlists[i].songs[x].title);
                                    box.playlists[i].songs[x].clip = (AudioClip)EditorGUILayout.ObjectField(box.playlists[i].songs[x].clip, typeof(AudioClip), false);
                                }
                                EditorGUILayout.EndVertical();
                            }
                            EditorGUILayout.EndHorizontal();
                            EditorGUILayout.BeginHorizontal();
                            {
                                if (box.playlists[i].songs[x].clip != null)
                                {
                                    GUILayout.Label("Length: " + GetTime(box.playlists[i].songs[x].clip.length));
                                }
                                else
                                {
                                    GUILayout.Label("Length: 0:00");
                                }
                                if (GUILayout.Button("X", GUILayout.Width(20)))
                                {
                                    GUI.FocusControl("SongAdd");
                                    box.playlists[i].songs.RemoveAt(x);
                                }
                            }
                            EditorGUILayout.EndHorizontal();
                            EditorGUILayout.Space();
                        }
                    }
                    EditorGUILayout.EndScrollView();
                }
                #endregion
                EditorGUILayout.Space();
                if (GUILayout.Button("Delete Playlist", GUILayout.Width(120)))
                {
                    GUI.FocusControl("PlaylistAdd");
                    box.playlists.RemoveAt(i);
                }
            }
            EditorGUILayout.EndScrollView();
        }
        #endregion
        EditorGUILayout.Space();
        #region MainSettings
        EditorGUILayout.BeginHorizontal();
        {
            EditorGUILayout.BeginVertical(GUILayout.Width(90));
            {
                GUILayout.Label("Play on Start");
            }
            EditorGUILayout.EndVertical();
            EditorGUILayout.BeginVertical();
            {
                box.playOnStart = EditorGUILayout.Toggle(box.playOnStart);
            }
            EditorGUILayout.EndVertical();
        }
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        {
            EditorGUILayout.BeginVertical(GUILayout.Width(90));
            {
                GUILayout.Label("Playlist");
            }
            EditorGUILayout.EndVertical();
            EditorGUILayout.BeginVertical();
            {
                box.currentPlaylist = EditorGUILayout.IntSlider(box.currentPlaylist, 0, box.playlists.Count - 1);
            }
            EditorGUILayout.EndVertical();
        }
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        {
            EditorGUILayout.BeginVertical(GUILayout.Width(90));
            {
                GUILayout.Label("Volume");
            }
            EditorGUILayout.EndVertical();
            EditorGUILayout.BeginVertical();
            {
                box._volume = EditorGUILayout.Slider(box._volume, 0, 100);
            }
            EditorGUILayout.EndVertical();
        }
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        {
            EditorGUILayout.BeginVertical(GUILayout.Width(90));
            {
                GUILayout.Label("Keep Between Scenes");
            }
            EditorGUILayout.EndVertical();
            EditorGUILayout.BeginVertical();
            {
                box.keepBetweenScenes = EditorGUILayout.Toggle(box.keepBetweenScenes);
            }
            EditorGUILayout.EndVertical();
        }
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        {
            EditorGUILayout.BeginVertical(GUILayout.Width(90));
            {
                GUILayout.Label("Repeat");
            }
            EditorGUILayout.EndVertical();
            EditorGUILayout.BeginVertical();
            {
                box.repeat = EditorGUILayout.Toggle(box.repeat);
            }
            EditorGUILayout.EndVertical();
        }
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        {
            EditorGUILayout.BeginVertical(GUILayout.Width(90));
            {
                GUILayout.Label("Random");
            }
            EditorGUILayout.EndVertical();
            EditorGUILayout.BeginVertical();
            {
                box.random = EditorGUILayout.Toggle(box.random);
            }
            EditorGUILayout.EndVertical();
        }
        EditorGUILayout.EndHorizontal();

        if (!box.random && box.playlists.Count > 0)
        {
            EditorGUILayout.BeginHorizontal();
            {
                EditorGUILayout.BeginVertical(GUILayout.Width(90));
                {
                    GUILayout.Label("Start Song");
                }
                EditorGUILayout.EndVertical();
                EditorGUILayout.BeginVertical();
                {
                    box.currentSong = EditorGUILayout.IntSlider(box.currentSong, 0, box.playlists[box.currentPlaylist].songs.Count - 1);
                }
                EditorGUILayout.EndVertical();
            }
            EditorGUILayout.EndHorizontal();
        }

        EditorGUILayout.BeginHorizontal();
        {
            EditorGUILayout.BeginVertical(GUILayout.Width(90));
            {
                GUILayout.Label("Load from File");
            }
            EditorGUILayout.EndVertical();
            EditorGUILayout.BeginVertical();
            {
                box.loadFromFile = EditorGUILayout.Toggle(box.loadFromFile);
            }
            EditorGUILayout.EndVertical();
        }
        EditorGUILayout.EndHorizontal();

        if (box.loadFromFile)
        {
            EditorGUILayout.BeginHorizontal();
            {
                EditorGUILayout.BeginVertical(GUILayout.Width(90));
                {
                    GUILayout.Label("Folder to Load");
                }
                EditorGUILayout.EndVertical();
                EditorGUILayout.BeginVertical();
                {
                    box.folderToLoad = EditorGUILayout.TextField(box.folderToLoad);
                }
                EditorGUILayout.EndVertical();
            }
            EditorGUILayout.EndHorizontal();
            EditorGUILayout.BeginHorizontal();
            {
                EditorGUILayout.BeginVertical(GUILayout.Width(90));
                {
                    GUILayout.Label("Load as 3D sound.");
                }
                EditorGUILayout.EndVertical();
                EditorGUILayout.BeginVertical();
                {
                    box.loadAs3D = EditorGUILayout.Toggle(box.loadAs3D);
                }
                EditorGUILayout.EndVertical();
            }
            EditorGUILayout.EndHorizontal();
        }
        #endregion
        #region RuntimeView
        if (EditorApplication.isPlaying)
        {
            if (GUILayout.Button("Next Song"))
            {
                box.NextTrack();
            }
            if (GUILayout.Button("Previous Song"))
            {
                box.PreviousTrack();
            }
            if (GUILayout.Button("Stop"))
            {
                box.Stop();
            }
            if (GUILayout.Button("Play"))
            {
                box.Play();
            }
            GUILayout.Label("Current Song: " + box.CurrentSong());
        }
        #endregion
        if (GUI.changed)
            EditorUtility.SetDirty(target);
    }

    /// <summary>
    /// Returns the time as minutes:seconds from a length of time in seconds.
    /// </summary>
    /// <param name="time">The length of time in seconds</param>
    /// <returns>Minutes:Seconds</returns>
    static string GetTime(float time)
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