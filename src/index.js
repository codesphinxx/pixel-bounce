window.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
window.oncontextmenu = function(e) {
    e.preventDefault();
};

import Phaser from 'phaser-ce';
import {Config} from './const';
import Boot from './states/boot';
import Preload from './states/preload';
import Play from './states/play';

let Gamex = null;

Gamex = new Phaser.Game(Config.CANVAS_WIDTH, Config.CANVAS_HEIGHT, Phaser.CANVAS, Config.CANVAS_WRAPPER);
  Gamex.gametime = Date.now();
  Gamex.elapsed = 0;

  Gamex.state.add('Boot', Boot);
  Gamex.state.add('Preload', Preload);
  Gamex.state.add('Play', Play);

  Gamex.state.start('Boot');
  
window.onload = function() {
  if ('serviceWorker' in navigator) 
  {
    navigator.serviceWorker.register('../service-worker.js')
    .then((serviceRegistration) => {
      console.log('Service worker registered...');
    });
  }
};

