/* Byte reading buddy: Byte After Eight's mascot sits in the corner of a blog
   post, fills a progress ring as you read, and talks at milestones.
   Byte's drawing is ported from the master "Byte — BAE Mascot" artifact. */
(function () {
  var buddy = document.querySelector('.byte-buddy');
  var content = document.querySelector('.post-content');
  if (!buddy || !content) return;

  var C = { signal: '#119e45', surface: '#1c1c1c', spark: '#f5c842', dim: '#888888',
            dimmer: '#444444', screen: '#101211', ring: '#0a1a10' };
  var wave = function (t, p) { return Math.sin(t * 2 * Math.PI / p); };
  var ease = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x); };

  function blinkAmt(t, pose) {
    var period = pose === 'blink' ? 2.2 : 4.1, d = pose === 'blink' ? 0.45 : 0.14, ph = t % period;
    if (ph > d) return 1;
    var x = ph / d; return Math.abs(1 - 2 * x) * 0.92 + 0.08;
  }

  // Same poses and motion as the master Byte, without the background panel.
  function byte(pose, t) {
    var bob = wave(t, 3) * 3, tilt = -3, scale = 1, hop = 0, sink = 0;
    var browL = [0, 0], browR = [0, 0], look = [0, 0], eyeY = blinkAmt(t, pose);
    var antenna = C.signal, antGlow = 0.35, mouth = 'M188 272 Q200 277 212 272', extras = '';
    switch (pose) {
      case 'think':
        look = [5, -5]; browL = [-1, -6]; browR = [-6, 8]; mouth = 'M192 274 L210 270';
        antGlow = 0.35 + 0.35 * (0.5 + 0.5 * wave(t, 1.6)); break;
      case 'doubt':
        look = [-4, 1]; browL = [2, 12]; browR = [-3, -6];
        mouth = 'M188 274 Q194 270 200 274 Q206 278 212 273'; tilt = -5; break;
      case 'surprise':
        var p = ease((t % 2.4) / 0.25); scale = 1 + 0.05 * Math.sin(Math.min(p, 1) * Math.PI);
        browL = [-8, 0]; browR = [-8, 0]; mouth = null;
        extras += '<circle cx="200" cy="274" r="8" fill="none" stroke="' + C.signal + '" stroke-width="3"/>'; break;
      case 'cheer':
        var ph = (t % 1.2) / 1.2; hop = -Math.max(0, Math.sin(ph * Math.PI)) * 16;
        browL = [-4, -8]; browR = [-4, 8]; mouth = 'M184 268 Q200 286 216 268';
        antenna = C.spark; antGlow = 0.55 + 0.35 * (0.5 + 0.5 * wave(t, 0.6)); eyeY = Math.min(eyeY, 0.75); break;
      case 'sad':
        sink = 6; look = [0, 4]; browL = [1, -12]; browR = [1, 12]; mouth = 'M188 278 Q200 268 212 278';
        antenna = '#1d6b3a'; antGlow = 0.15; bob = wave(t, 4) * 1.5; break;
      case 'listen':
        tilt = -3 + 6 * (0.5 + 0.5 * wave(t, 4)); look = [6, 0]; mouth = 'M193 273 L207 273';
        antGlow = 0.45 + 0.25 * (0.5 + 0.5 * wave(t, 2));
        var k = (t % 1.5) / 1.5;
        for (var i = 0; i < 3; i++) {
          var r = 16 + ((k + i / 3) % 1) * 28, o = (1 - ((k + i / 3) % 1)) * 0.7;
          extras += '<path d="M' + (352 - r * 0.3) + ' ' + (240 - r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + (352 - r * 0.3) + ' ' + (240 + r) +
            '" fill="none" stroke="' + C.signal + '" stroke-width="2.5" opacity="' + o.toFixed(2) + '" transform="translate(-10 0)"/>';
        }
        break;
    }
    var brow = function (cx, b) {
      return '<line x1="' + (cx - 13) + '" y1="' + (196 + b[0]) + '" x2="' + (cx + 13) + '" y2="' + (196 + b[0]) +
        '" stroke="' + C.dim + '" stroke-width="4" stroke-linecap="round" transform="rotate(' + b[1] + ' ' + cx + ' ' + (196 + b[0]) + ')"/>';
    };
    var eye = function (cx) {
      return '<g transform="translate(' + cx + ' 226) scale(1 ' + eyeY.toFixed(3) + ')"><circle r="22" fill="' + C.ring + '"/>' +
        '<circle cx="' + look[0] + '" cy="' + look[1] + '" r="15.5" fill="' + C.signal + '"/>' +
        '<circle cx="' + (look[0] + 5) + '" cy="' + (look[1] - 5) + '" r="4.5" fill="#bff5d2" opacity=".55"/></g>';
    };
    var ty = bob + hop + sink;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 60 300 380" aria-hidden="true">' +
      '<defs><filter id="bbglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" result="g"/>' +
      '<feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="bbsoft" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter></defs>' +
      '<g transform="translate(0 ' + ty.toFixed(2) + ')"><g transform="translate(200 260) scale(' + scale.toFixed(3) + ') rotate(' + tilt.toFixed(2) + ') translate(-200 -260)">' +
      '<g opacity=".38"><rect x="72" y="210" width="44" height="58" rx="20" fill="' + C.dimmer + '"/><rect x="284" y="210" width="44" height="58" rx="20" fill="' + C.dimmer + '"/>' +
      '<rect x="150" y="372" width="38" height="58" rx="16" fill="' + C.dimmer + '"/><rect x="212" y="372" width="38" height="58" rx="16" fill="' + C.dimmer + '"/></g>' +
      '<line x1="200" y1="152" x2="205" y2="98" stroke="' + C.signal + '" stroke-width="3.5" stroke-linecap="round"/>' +
      '<circle cx="205" cy="90" r="18" fill="' + antenna + '" opacity="' + antGlow.toFixed(2) + '" filter="url(#bbsoft)"/>' +
      '<circle cx="205" cy="90" r="11" fill="' + antenna + '"/>' +
      '<rect x="104" y="150" width="192" height="226" rx="34" fill="' + C.surface + '" stroke="' + C.signal + '" stroke-width="3.5" filter="url(#bbglow)"/>' +
      '<rect x="128" y="172" width="144" height="128" rx="22" fill="' + C.screen + '" stroke="#2b2b2b" stroke-width="2"/>' +
      brow(172, browL) + brow(228, browR) + eye(172) + eye(228) +
      (mouth ? '<path d="' + mouth + '" fill="none" stroke="' + C.signal + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' : '') +
      '<rect x="150" y="314" width="100" height="34" rx="10" fill="#151515" stroke="#2b2b2b" stroke-width="1.5"/>' +
      '<text x="200" y="337" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="16" font-weight="500" letter-spacing="3" fill="' + C.signal + '">8 BIT</text>' +
      '</g>' + extras + '</g></svg>';
  }

  var body = buddy.querySelector('.byte-buddy-body');
  var bubble = buddy.querySelector('.byte-buddy-bubble');
  var bar = buddy.querySelector('.byte-buddy-bar');
  var total = Math.max(1, parseInt(buddy.getAttribute('data-minutes'), 10) || 1);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pose = 'idle', poseUntil = 0, progress = 0, done = false, scrolled = false;
  var said = {}, bubbleTimer = 0, idleTimer = 0, lastY = window.scrollY, lastT = performance.now();
  var t0 = performance.now(), lastDraw = 0;

  var plural = function (n) { return n === 1 ? 'min' : 'mins'; };
  var left = function () { return Math.max(0, Math.ceil(total * (1 - progress) - 0.05)); };

  function react(p, ms) { pose = p; poseUntil = ms ? performance.now() + ms : 0; if (reduce) draw(performance.now(), true); }
  function say(text, ms) {
    bubble.textContent = text;
    buddy.classList.add('is-talking');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { buddy.classList.remove('is-talking'); }, ms || 3200);
  }

  // How far the reader is through the post body.
  function measure() {
    var r = content.getBoundingClientRect();
    var span = Math.max(1, r.height - window.innerHeight * 0.35);
    return Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / span));
  }

  function finish() {
    done = true;
    buddy.classList.add('is-done');
    react('cheer', 0);
    say(total > 1 ? 'You read all ' + total + ' mins! Nice work.' : 'All done! Nice work.', 4500);
  }

  function update() {
    progress = measure();
    bar.style.strokeDashoffset = String(100 - progress * 100);
    if (!scrolled || done) return;
    if (progress >= 0.985) { finish(); return; }
    var mins = left();
    if (progress >= 0.25 && !said.q && total >= 4) {
      said.q = true; say('Good going! About ' + mins + ' ' + plural(mins) + ' to go.'); react('cheer', 1400);
    }
    if (progress >= 0.5 && !said.half) {
      said.half = true; say(total > 2 ? 'Halfway there! ' + mins + ' ' + plural(mins) + ' more.' : 'Halfway there!'); react('surprise', 1400);
    }
    if (progress > 0.5 && mins >= 1 && mins <= 2 && total >= 3 && !said['m' + mins]) {
      said['m' + mins] = true; say(mins === 2 ? 'Just 2 mins more!' : "Almost done, just a minute left!"); react('cheer', 1400);
    }
  }

  function onScroll() {
    var now = performance.now(), y = window.scrollY;
    if (y > 40) scrolled = true;
    // Racing past paragraphs gets a raised eyebrow, at most once a minute.
    var speed = Math.abs(y - lastY) / Math.max(16, now - lastT);
    if (speed > 6 && !done && (!said.fast || now - said.fast > 60000) && progress > 0.05) {
      said.fast = now; say('Whoa, speed reader! The good bits are in there.', 2600); react('surprise', 1500);
    }
    lastY = y; lastT = now;
    update();
    clearTimeout(idleTimer);
    if (!done) idleTimer = setTimeout(function () {
      if (done || progress < 0.08) return;
      var mins = left();
      react('doubt', 3600); say('Still with me? Only ' + mins + ' ' + plural(mins) + ' left.', 3600);
    }, 45000);
  }

  function draw(now, force) {
    if (poseUntil && now > poseUntil) { pose = done ? 'cheer' : 'idle'; poseUntil = 0; }
    if (force || now - lastDraw > 66) { body.innerHTML = byte(pose, reduce ? 1 : (now - t0) / 1000); lastDraw = now; }
  }

  function loop(now) { if (!document.hidden) draw(now); requestAnimationFrame(loop); }

  buddy.querySelector('.byte-buddy-btn').addEventListener('click', function () {
    if (done) { react('cheer', 1800); say('All read! Share it with a friend?', 2800); return; }
    var mins = left();
    react('listen', 1600);
    say(progress < 0.03 ? "Hi, I'm Byte! This one takes about " + total + ' ' + plural(total) + '.'
      : mins <= 1 ? 'Less than a minute left!' : 'About ' + mins + ' ' + plural(mins) + ' to go.', 3000);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update();
  draw(performance.now(), true);
  if (!reduce) requestAnimationFrame(loop);
  setTimeout(function () {
    if (!scrolled) { react('listen', 2200); say("Hi, I'm Byte! This one takes about " + total + ' ' + plural(total) + '.', 3400); }
  }, 1200);
  buddy.classList.add('is-ready');
})();
