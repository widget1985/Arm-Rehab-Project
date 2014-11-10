using UnityEngine;

namespace CorruptedSmileStudio.JukeBox
{
    /// <summary>
    ///	A class that represents a song.
    ///	</summary>
    [System.Serializable]
    public class Song
    {
        /// <summary>
        ///	The audio clip to play.
        ///	</summary>
        public AudioClip clip;
        /// <summary>
        ///	The name of the artist
        ///	</summary>
        public string artist;
        /// <summary>
        ///	The title of the song.
        ///	</summary>		
        public string title;
        /// <summary>
        ///	Returns a nicely formated artist - title string.
        ///	</summary>
        /// <returns>A formated string of ARTIST - TITLE</returns>
        public override string ToString()
        {
            if (artist != "")
                return string.Format("{0} - {1}", artist, title);
            else
                return string.Format("{0}", title);
        }
        /// <summary>
        /// Initialises all properties of Song.
        /// </summary>
        public Song()
        {
            clip = null;
            artist = "";
            title = "";
        }
    }

    /// <summary>
    /// Holds the title and artist name.
    /// Used in the event system of JukeBox.
    /// </summary>
    public class JukeBoxArgs : System.EventArgs
    {
        /// <summary>
        /// The title of the song.
        /// </summary>
        string _title;
        /// <summary>
        /// The artist name
        /// </summary>
        string _artist;
        /// <summary>
        /// Song length
        /// </summary>
        float _length;

        /// <summary>
        /// Formats the artist and title into a string.
        /// </summary>
        /// <returns>Returns the Artist - Title</returns>
        public override string ToString()
        {
            return string.Format("{0} - {1}", _artist, _title);
        }
        /// <summary>
        /// Creates a new instance of JukeBoxArgs
        /// </summary>
        /// <param name="song">The song name</param>
        /// <param name="artist">The artist name</param>
        /// <param name="time">The length of the song.</param>
        public JukeBoxArgs(string song, string artist, float time)
        {
            _title = song;
            _artist = artist;
            _length = time;
        }
        /// <summary>
        /// The title of the song.
        /// </summary>
        public string Title
        {
            get
            {
                return _title;
            }
        }
        /// <summary>
        /// The artist name
        /// </summary>
        public string Artist
        {
            get
            {
                return _artist;
            }
        }
        /// <summary>
        /// Song length
        /// </summary>
        public float Length
        {
            get
            {
                return _length;
            }
        }
    }
}