window.addEventListener("DOMContentLoaded", () => {
  // (A) PLAYER INIT
  // (A1) PLAYLIST - CHANGE TO YOUR OWN!
  let playlist = [
    { name: "Heaven And Hell", src: "Videos/video1.mp4" },
    { name: "What We Need", src: "Videos/video2.mp4" },
    { name: "RAIN", src: "Videos/video3.mp4" },
    { name: "believe.", src: "Videos/video4.mp4" }
  ];

  // (A2) VIDEO PLAYER & GET HTML CONTROLS
  const video = document.getElementById("vVid"),
    vPlay = document.getElementById("vPlay"),
    vPlayIco = document.getElementById("vPlayIco"),
    vNow = document.getElementById("vNow"),
    vTime = document.getElementById("vTime"),
    vSeek = document.getElementById("vSeek"),
    vVolume = document.getElementById("vVolume"),
    vVolIco = document.getElementById("vVolIco"),
    vList = document.getElementById("vList");

  // (A3) BUILD PLAYLIST
  for (let i in playlist) {
    let row = document.createElement("div");
    row.className = "vRow";
    row.innerHTML = playlist[i]["name"];
    row.addEventListener("click", () => vidPlay(i));
    playlist[i]["row"] = row;
    vList.appendChild(row);
  }

  // (B) PLAY MECHANISM
  // (B1) FLAGS
  var vidNow = 0; // current video

  // (B2) PLAY SELECTED VIDEO
  vidPlay = (idx, nostart) => {
    vidNow = idx;
    video.src = encodeURI(playlist[idx]["src"]);
    for (let i in playlist) {
      if (i == idx) {
        playlist[i]["row"].classList.add("now");
      } else {
        playlist[i]["row"].classList.remove("now");
      }
    }
    video.load(); // Load the video
    vPlayIco.innerHTML = "play_arrow"; // Set the play icon to "play" when changing the video
  };

  
  // (B4) INIT SET FIRST VIDEO
  vidPlay(0);

  // (C1) AUTO SET PLAY/PAUSE TEXT
  video.addEventListener("play", () => vPlayIco.innerHTML = "pause");
  video.addEventListener("pause", () => vPlayIco.innerHTML = "play_arrow");

  // (C2) CLICK TO PLAY/PAUSE
  vPlay.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  // (D) TRACK PROGRESS
  // (D1) SUPPORT FUNCTION - FORMAT HH:MM:SS
  var timeString = secs => {
    // (D1-1) HOURS, MINUTES, SECONDS
    let ss = Math.floor(secs),
      hh = Math.floor(ss / 3600),
      mm = Math.floor((ss - (hh * 3600)) / 60);
    ss = ss - (hh * 3600) - (mm * 60);

    // (D1-2) RETURN FORMATTED TIME
    if (hh > 0) {
      mm = mm < 10 ? "0" + mm : mm;
    }
    ss = ss < 10 ? "0" + ss : ss;
    return hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  // (D2) INIT SET TRACK TIME
  video.addEventListener("loadedmetadata", () => {
    vNow.innerHTML = timeString(0);
    vTime.innerHTML = timeString(video.duration);
  });

  // (D3) UPDATE TIME ON PLAYING
  video.addEventListener("timeupdate", () => vNow.innerHTML = timeString(video.currentTime));

  // (E) SEEK BAR
  video.addEventListener("loadedmetadata", () => {
    // (E1) SET SEEK BAR MAX TIME
    vSeek.max = Math.floor(video.duration);

    // (E2) USER CHANGE SEEK BAR TIME
    var vSeeking = false; // user is now changing time
    vSeek.addEventListener("input", () => vSeeking = true); // prevents clash with (e3)
    vSeek.addEventListener("change", () => {
      video.currentTime = vSeek.value;
      vSeeking = false;
    });

    // (E3) UPDATE SEEK BAR ON PLAYING
    video.addEventListener("timeupdate", () => {
      if (!vSeeking) {
        vSeek.value = Math.floor(video.currentTime);
      }
    });
  });

  // (F) VOLUME
  vVolIco.addEventListener("click", () => {
    video.volume = video.volume == 0 ? 1 : 0;
    vVolume.value = video.volume;
    vVolIco.innerHTML = vVolume.value == 0 ? "volume_mute" : "volume_up";
  });
  vVolume.addEventListener("change", () => {
    video.volume = vVolume.value;
    vVolIco.innerHTML = vVolume.value == 0 ? "volume_mute" : "volume_up";
  });

  // (G) ENABLE/DISABLE CONTROLS
  video.addEventListener("canplay", () => {
    vPlay.disabled = false;
    vVolume.disabled = false;
    vSeek.disabled = false;
  });
  video.addEventListener("waiting", () => {
    vPlay.disabled = true;
    vVolume.disabled = true;
    vSeek.disabled = true;
  });
});