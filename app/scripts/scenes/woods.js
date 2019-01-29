let i = 1;
let text;
let dialogue;
let container;
let hoodgirl;
let farmzombie;
let hgWalkOn;
let fzWalkOn;

export default class Woods extends Phaser.Scene {
  /**
   *  My custom scene.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({key: 'Woods'});
  }

  /**
   *  Called when this scene is initialized.
   *
   *  @protected
   *  @param {object} [data={}] - Initialization parameters.
   */
  init(/* data */) {
  }

  /**
   *  Used to declare game assets to be loaded using the loader plugin API.
   *
   *  @protected
   */
  preload() {
  }

  /**
   *  Responsible for setting up game objects on the screen.
   *
   *  @protected
   *  @param {object} [data={}] - Initialization parameters.
   */
  create(/* data */) {
    window.addEventListener('resize', resize);
    resize();

    const x = this.cameras.main.width / 2;
    const y = this.cameras.main.height / 2;
    
    this.add.image(x, y, 'woods');

    hoodgirl = this.add.sprite(-150, 400, 'hoodgirl', 'idle001.png');
    farmzombie = this.add.sprite(800, 400, 'farmzombie', 'idle001.png');

    dialogue = this.cache.json.get('dialogue');

    let styledbox = this.add.image(0, 0, 'styledbox');


    // let text = this.add.text(x, y, "TESTING PLS");
    text = this.add.text(x, 150, dialogue.letter[0], {
      wordWrap: { width: 390 }
    });
    text.setOrigin(0.5, 0.5);
    text.setDepth(1);


    container = this.add.container(x, 150, styledbox);
    container.setSize(400, 100);



    // TWEENS

    // tween to make player walk in to scene
    hgWalkOn = this.tweens.add({
      targets: hoodgirl,
      x: 150,
      ease: 'power1',
      duration: 2500,
      repeat: 0,
      paused: true
    });

    // zombie walks in to scene
    fzWalkOn = this.tweens.add({
      targets: farmzombie,
      x: 500,
      ease: 'power1',
      duration: 2500,
      repeat: 0,
      paused: true
    });
 



    // DEFINING ANIMATIONS

    // Hoodgirl animations:

    // Hoodgirl idle infinite loop
    this.anims.create({
      key: 'hgidle',
      frames: this.anims.generateFrameNames('hoodgirl', {
        prefix: 'idle00',
        suffix: '.png',
        start: 1,
        end: 18
      }),
      frameRate: 15,
      repeat: -1
    });

    // Hoodgirl walking loops twice
    this.anims.create({
      key: 'hgwalking',
      frames: this.anims.generateFrameNames('hoodgirl', {
        prefix: 'walking00',
        suffix: '.png',
        start: 1,
        end: 24
      }),
      frameRate: 20,
      repeat: 1
    });


    // Farmzombie animations:

    // farmzombie idle infinite loop
    this.anims.create({
      key: 'fzidle',
      frames: this.anims.generateFrameNames('farmzombie', {
        prefix: 'idle00',
        suffix: '.png',
        start: 1,
        end: 12
      }),
      frameRate: 10,
      repeat: -1
    });

    // farmzombie walking loops twice
    this.anims.create({
      key: 'fzwalking',
      frames: this.anims.generateFrameNames('farmzombie', {
        prefix: 'walking00',
        suffix: '.png',
        start: 1,
        end: 18
      }),
      frameRate: 20,
      repeat: 2
    });


    // CALLING ANIMATIONS
    hoodgirl.on('animationcomplete', function() {
      hoodgirl.play('hgidle');
    });

    farmzombie.on('animationcomplete', function() {
      farmzombie.play('fzidle');
    });

  }

  /**
   *  Handles updates to game logic, physics and game objects.
   *
   *  @protected
   *  @param {number} t - Current internal clock time.
   *  @param {number} dt - Time elapsed since last update.
   */
  update(/* t, dt */) {
    const keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    if (Phaser.Input.Keyboard.JustDown(keySpace)) {
      if (dialogue.letter[i] !== undefined) {
        text.setText(dialogue.letter[i]);
        i++;
      } else {
        container.visible = false;
        text.visible = false;
        farmzombie.anims.play('fzwalking', true);
        fzWalkOn.restart();
        hoodgirl.anims.play('hgwalking', true);
        hgWalkOn.restart();
      }
    }
  }

  /**
   *  Called after a scene is rendered. Handles rendenring post processing.
   *
   *  @protected
   */
  render() {
  }

  /**
   *  Called when a scene is about to shut down.
   *
   *  @protected
   */
  shutdown() {
  }

  /**
   *  Called when a scene is about to be destroyed (i.e.: removed from scene
   *  manager). All allocated resources that need clean up should be freed up
   *  here.
   *
   *  @protected
   */
  destroy() {
  }
}

function resize() {
  let canvas = document.querySelector('canvas'), width = window.innerWidth, height = window.innerHeight;
  let wratio = width / height, ratio = canvas.width / canvas.height;
 
  if (wratio < ratio) {
    canvas.style.width = width + 'px';
    canvas.style.height = (width / ratio) + 'px';
  } else {
    canvas.style.width = (height * ratio) + 'px';
    canvas.style.height = height + 'px';
  }
}