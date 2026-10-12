#!/usr/bin/env python3
"""Create a Deezer JSONP test page inside the Veylora project."""

import os
import sys
from pathlib import Path

PROJECT = Path.home() / "Downloads" / "veylora"
PUBLIC = PROJECT / "public"
TARGET = PUBLIC / "deezer-test.html"


TEST_HTML = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Deezer JSONP test</title>
<style>
  body { background: #121212; color: #f5f5f7; font-family: system-ui, sans-serif; margin: 0; padding: 32px; }
  h1 { margin: 0 0 8px; font-size: 20px; }
  p.sub { margin: 0 0 24px; color: #9a9aa0; font-size: 13px; }
  .row { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; margin-top: 18px; }
  .card { background: #1b1b1f; border: 1px solid #2a2a30; border-radius: 10px; padding: 10px; }
  .card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 6px; background: #222; }
  .card .t { font-size: 13px; font-weight: 600; margin-top: 8px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card .a { font-size: 11px; color: #9a9aa0; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card button { margin-top: 8px; width: 100%; padding: 6px; border-radius: 6px; background: #a855f7; color: #0b0614; border: 0; cursor: pointer; font-weight: 700; font-size: 11px; }
  .status { margin-top: 14px; font-size: 13px; color: #7ee0b0; }
  .error { color: #fa778c; }
  input.search { width: 100%; max-width: 420px; padding: 10px 14px; border-radius: 8px; border: 1px solid #333; background: #1b1b1f; color: #fff; font-size: 14px; outline: none; }
  input.search:focus { border-color: #a855f7; }
  audio { width: 100%; margin-top: 18px; }
</style>
</head>
<body>
  <h1>Deezer JSONP test</h1>
  <p class="sub">If this loads covers + plays previews, Deezer works from your machine.</p>

  <input type="search" class="search" id="q" placeholder="Search Deezer (press Enter)...">
  <div class="status" id="status">Loading chart...</div>
  <div class="row" id="row"></div>
  <audio id="audio" controls></audio>

<script>
(function () {
  "use strict";

  var counter = 0;

  function deezerJSONP(url) {
    return new Promise(function (resolve, reject) {
      var cb = "__dz_cb_" + (++counter);
      var script = document.createElement("script");
      var timer = setTimeout(function () {
        cleanup();
        reject(new Error("timeout"));
      }, 15000);

      function cleanup() {
        clearTimeout(timer);
        try { delete window[cb]; } catch (_) { window[cb] = undefined; }
        if (script && script.parentNode) script.parentNode.removeChild(script);
      }

      window[cb] = function (data) {
        cleanup();
        resolve(data);
      };

      var sep = url.indexOf("?") === -1 ? "?" : "&";
      script.src = url + sep + "output=jsonp&callback=" + cb;
      script.onerror = function () { cleanup(); reject(new Error("network")); };
      document.head.appendChild(script);
    });
  }

  var rowEl = document.getElementById("row");
  var statusEl = document.getElementById("status");
  var audioEl = document.getElementById("audio");

  function setStatus(msg, isError) {
    statusEl.textContent = msg;
    statusEl.className = "status" + (isError ? " error" : "");
  }

  function renderTracks(tracks) {
    rowEl.innerHTML = "";
    if (!tracks || tracks.length === 0) {
      setStatus("No tracks found.", true);
      return;
    }
    setStatus("Loaded " + tracks.length + " tracks.");
    tracks.forEach(function (t) {
      var cover = (t.album && (t.album.cover_medium || t.album.cover)) || "";
      var artist = (t.artist && t.artist.name) || "Unknown";
      var card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        (cover ? '<img src="' + cover + '" alt="">' : '<div style="width:100%;aspect-ratio:1/1;background:#222;border-radius:6px"></div>') +
        '<div class="t">' + t.title + '</div>' +
        '<div class="a">' + artist + '</div>';
      var btn = document.createElement("button");
      btn.textContent = "Play 30s";
      btn.addEventListener("click", function () {
        if (!t.preview) { setStatus("No preview URL for this track.", true); return; }
        audioEl.src = t.preview;
        audioEl.play().catch(function (e) { setStatus("Play failed: " + e.message, true); });
      });
      card.appendChild(btn);
      rowEl.appendChild(card);
    });
  }

  function loadChart() {
    setStatus("Loading Worldwide chart...");
    deezerJSONP("https://api.deezer.com/playlist/3155776842")
      .then(function (data) {
        if (data && data.error) {
          setStatus("Deezer returned: " + JSON.stringify(data.error), true);
          return;
        }
        var tracks = (data && data.tracks && data.tracks.data) ? data.tracks.data : [];
        renderTracks(tracks.slice(0, 24));
      })
      .catch(function (err) {
        setStatus("Fetch failed: " + err.message + " (CORS or network)", true);
      });
  }

  function doSearch(q) {
    if (!q) { loadChart(); return; }
    setStatus('Searching "' + q + '"...');
    deezerJSONP("https://api.deezer.com/search?q=" + encodeURIComponent(q))
      .then(function (data) {
        if (data && data.error) {
          setStatus("Deezer returned: " + JSON.stringify(data.error), true);
          return;
        }
        var tracks = (data && data.data) ? data.data : [];
        renderTracks(tracks.slice(0, 24));
      })
      .catch(function (err) {
        setStatus("Fetch failed: " + err.message + " (CORS or network)", true);
      });
  }

  var input = document.getElementById("q");
  var searchTimer = null;
  input.addEventListener("input", function () {
    clearTimeout(searchTimer);
    var v = input.value.trim();
    searchTimer = setTimeout(function () { doSearch(v); }, 400);
  });

  loadChart();
})();
</script>
</body>
</html>
'''


def main():
    if not PROJECT.is_dir():
        print(f"ABORT: project not found at {PROJECT}", file=sys.stderr)
        sys.exit(1)
    if not PUBLIC.is_dir():
        PUBLIC.mkdir(parents=True, exist_ok=True)

    if TARGET.is_file():
        print(f"ABORT: {TARGET} already exists. Delete it first or rename.", file=sys.stderr)
        sys.exit(1)

    TARGET.write_text(TEST_HTML, encoding="utf-8")
    print(f"Created: {TARGET}")
    print()
    print("Next steps:")
    print("  1. Make sure 'npm run dev' is running")
    print("  2. Open http://localhost:5173/deezer-test.html")
    print("  3. Tell me what you see")
    return 0


if __name__ == "__main__":
    sys.exit(main())
