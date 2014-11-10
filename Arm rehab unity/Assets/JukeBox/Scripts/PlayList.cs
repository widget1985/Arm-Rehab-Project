namespace CorruptedSmileStudio.JukeBox
{
    using System.Collections.Generic;

    /// <summary>
    /// Contains the required fields in order to maintain separate playlits.
    /// </summary>
    [System.Serializable]
    public class PlayList
    {
        /// <summary>
        /// The name of the playlist.
        /// </summary>
        public string name;
        /// <summary>
        /// The songs within the play list.
        /// </summary>
        public List<Song> songs;
        /// <summary>
        /// Used in the inspector to display the song section for the playlist.
        /// </summary>
        [UnityEngine.HideInInspector]
        [System.NonSerialized]
        public bool showSongs = false;

        /// <summary>
        /// Creates a new playlist
        /// </summary>
        /// <param name="playlistName">The playlist name.</param>
        public PlayList(string playlistName)
        {
            songs = new List<Song>();
            name = playlistName;
        }
    }
}