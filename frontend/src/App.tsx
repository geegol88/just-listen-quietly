import { useState, useRef, useEffect } from 'react';
import './App.css';

// 音乐列表数据
const musicList = [
  { id: 1, title: '17岁', artist: '刘德华', url: '/music/刘德华 - 17岁.mp3' },
  { id: 2, title: '世界第一等', artist: '刘德华', url: '/music/刘德华 - 世界第一等.mp3' },
  { id: 3, title: '冰雨', artist: '刘德华', url: '/music/刘德华 - 冰雨.mp3' },
  { id: 4, title: '天意', artist: '刘德华', url: '/music/刘德华 - 天意.mp3' },
  { id: 5, title: '孤星泪', artist: '刘德华', url: '/music/刘德华 - 孤星泪.mp3' },
  { id: 6, title: '忘情水', artist: '刘德华', url: '/music/刘德华 - 忘情水.mp3' },
  { id: 7, title: '暗里着迷', artist: '刘德华', url: '/music/刘德华 - 暗里着迷.mp3' },
  { id: 8, title: '男人哭吧不是罪', artist: '刘德华', url: '/music/刘德华 - 男人哭吧不是罪.mp3' },
  { id: 9, title: '烟雨人间', artist: '张嘉懿', url: '/music/张嘉懿 - 烟雨人间_20250506_233410.mp3' },
];

// 定义音乐类型
type Music = {
  id: number;
  title: string;
  artist: string;
  url: string;
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<Music>(musicList[0]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      // setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleMusicEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleMusicEnd);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error: Error) => {
        console.log('播放失败:', error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentMusic]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const openPlaylist = () => {
    setIsPlaylistVisible(true);
  };

  const closePlaylist = () => {
    setIsPlaylistVisible(false);
  };

  const playMusic = (music: Music) => {
    setCurrentMusic(music);
    setIsPlaying(true);
    closePlaylist();
  };

  const handleMusicEnd = () => {
    // 随机选择下一首歌曲（排除当前歌曲）
    const otherSongs = musicList.filter(song => song.id !== currentMusic.id);
    const randomIndex = Math.floor(Math.random() * otherSongs.length);
    const nextSong = otherSongs[randomIndex];
    
    setCurrentMusic(nextSong);
    setIsPlaying(true); // 自动播放下一首
  };

  return (
    <div className="app-container">
      <div className="content-center">
        <div 
          className={`logo-icon ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          aria-label={isPlaying ? "暂停音乐" : "播放音乐"}
        ></div>
        <div className="logo-text" onClick={openPlaylist}>
          just-listen-quietly
        </div>
        <div className="buttons">
          <button className="register-button">注册</button>
          <button className="login-button">登录</button>
        </div>
      </div>

      {/* 播放列表弹窗 */}
      {isPlaylistVisible && (
        <div className="modal-overlay" onClick={closePlaylist}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closePlaylist}>×</button>
            <h2 className="modal-title">播放列表</h2>
            <ul className="playlist">
              {musicList.map((music) => (
                <li 
                  key={music.id} 
                  className={`playlist-item ${currentMusic.id === music.id ? 'playing' : ''}`}
                  onClick={() => playMusic(music)}
                >
                  <div className="music-title">{music.title}</div>
                  <div className="music-artist">{music.artist}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 隐藏的audio元素 */}
      <audio 
        ref={audioRef}
        src={currentMusic.url}
      />
    </div>
  );
}

export default App;