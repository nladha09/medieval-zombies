import Menu from '../objects/menu';

let i = 1;

export default class Woods extends Phaser.Scene {
  /**
   *  My custom scene.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({ key: 'Woods' });
  }

  /**
   *  Called when this scene is initialized.
   *
   *  @protected
   *  @param {object} [data={}] - Initialization parameters.
   */
  init(data) {
    this.char = data.char;
    this.weap = data.weap;
    this.noises = data.noises;
    this.head = data.head;
    this.zombie = data.zombie;
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

    // background image
    this.add.image(x, y, 'shittyforest');

    // Section VERY IMPORTANT******
    this.section = 1;

    // emitter0.explode(); turns particle emitter off
    // DEFEND
    this.emitterBlue = this.add.particles('blue').createEmitter({
      x: 150,
      y: 240,
      speed: { min: -100, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 2, end: 1 },
      blendMode: 'SCREEN',
      // frequency of -1 turns it off
      frequency: -1,
      lifespan: 300
      // gravityY: 800
    });
    // ENEMY RAGE
    this.emitterRed = this.add.particles('red').createEmitter({
      x: 490,
      y: 240,
      speed: { min: -100, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 2, end: 1 },
      blendMode: 'SCREEN',
      frequency: -1,
      lifespan: 300
    });
    // POTION
    this.emitterGreen = this.add.particles('green').createEmitter({
      x: 150,
      y: 240,
      speed: { min: -100, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 2, end: 1 },
      blendMode: 'SCREEN',
      frequency: -1,
      lifespan: 300
    });
    
    // Adding Sprites
    this.player = this.add.sprite(-150, 240, this.char, 'idle001.png');
    this.weapon = this.add.image(210, 260, this.weap);
    this.weapon.visible = false;
    this.oldman = this.add.sprite(800, 240, 'oldman', 'idle001.png');
    this.enemy = this.add.sprite(800, 240, this.zombie, 'idle001.png');

    // Dialogue JSON
    this.dialogue = this.cache.json.get('dialogue');

    // All Audio
    this.noise = this.sound.add(this.noises);
    this.stab = this.sound.add('stab');
    this.heal = this.sound.add('heal', { volume: 0.5 });
    this.shield = this.sound.add('shield', { volume: 0.5 });
    this.dangerstinger = this.sound.add('dangerstinger', { volume: 0.3 });
    this.rhythmloop = this.sound.add('rhythmloop', { volume: 0.3, loop: true });
    this.adventurestinger = this.sound.add('adventurestinger', { volume: 0.3 });


    // Keypress Variables
    this.keySpace = true;
    this.keyEnter = true;
    this.arrows = false;

    // Narration text and associated textbox
    this.textbox = this.add.image(0, 0, 'textbox');
    this.currentDialogue = this.dialogue.woods.startnarration;
    this.text = this.add.text(x, 400, this.currentDialogue[0].text, {
      wordWrap: { width: 390 }
    });
    this.text.setOrigin(0.5, 0.5);
    this.text.setDepth(1);
    this.phead = this.add.image(160, 400, this.head);
    this.phead.setDepth(1);
    this.phead.visible = false;
    this.omhead = this.add.image(160, 400, 'omhead');
    this.omhead.setDepth(1);
    this.omhead.visible = false;
    this.container = this.add.container(x, 400, this.textbox);
    this.container.setSize(400, 100);

    // Hit Text
    this.ptext = this.add.text(200, 170, '', { color: '#ff3434', fontStyle: 'bold', fontSize: 20 });
    this.ptext.setOrigin(0.5, 0.5);
    this.ptext.setAlpha(0);
    this.ztext = this.add.text(435, 170, '', { color: '#ff3434', fontStyle: 'bold', fontSize: 20 });
    this.ztext.setOrigin(0.5, 0.5);
    this.ztext.setAlpha(0);

    // BATTLE MENU UI
    // this.menubox = this.add.image(325, 333, 'menubox');
    this.menubox = this.add.image(x, 420, 'battlemenu');
    this.menu = this.add.container();
    this.actionsMenu = new Menu(this, x, 355);
    this.enemyHP = this.add.text(500, 400, '100', { fontSize: 40 });
    this.enemyHP.setOrigin(0.5, 0.5);
    this.playerHP = this.add.text(150, 400, '100', { fontSize: 40 });
    this.playerHP.setOrigin(0.5, 0.5);
    this.menu.setSize(120, 140);
    this.menu.add(this.menubox);
    this.menu.add(this.actionsMenu);
    this.menu.add(this.enemyHP);
    this.menu.add(this.playerHP);
    this.menu.visible = false;


    this.input.keyboard.on('keydown', this.onKeyInput, this);


    // TWEENS

    // tween to make player walk in to scene
    this.pWalkOn = this.tweens.add({
      targets: this.player,
      x: 150,
      ease: 'power1',
      duration: 2500,
      repeat: 0,
      paused: true
    });

    // tween to make player walk off scene
    this.pWalkOff = this.tweens.add({
      targets: this.player,
      x: 700,
      ease: 'power1',
      duration: 2200,
      repeat: 0,
      paused: true
    });

    // run attack
    this.pRunAttack = this.tweens.add({
      targets: this.player,
      x: 250,
      ease: 'power1',
      duration: 300,
      paused: true,
      yoyo: true
    });
    
    // weapon being thrown
    this.weaponThrow = this.tweens.add({
      targets: this.weapon,
      x: 450,
      ease: 'power1',
      angle: 360,
      duration: 300,
      paused: true,
      yoyo: true
    });


    // oldman runs in to scene
    this.omRunOn = this.tweens.add({
      targets: this.oldman,
      x: 500,
      ease: 'power1',
      duration: 2200,
      repeat: 0,
      paused: true
    });

    // oldman runs out of scene
    this.omRunOff = this.tweens.add({
      targets: this.oldman,
      x: -150,
      ease: 'power1',
      duration: 2200,
      repeat: 0,
      paused: true
    });

    // zombie walks in to scene
    this.fzWalkOn = this.tweens.add({
      targets: this.enemy,
      x: 475,
      ease: 'power1',
      duration: 2500,
      repeat: 0,
      paused: true
    });

    // player moves back on evade, use pevade.restart() to play
    this.pEvade = this.tweens.add({
      targets: this.player,
      x: 125,
      ease: 'power1',
      duration: 300,
      paused: true, // won't play on page load
      yoyo: true // player will move to x: 160 and then move back to starting point
    });

    // zombie moves back on evade, use fzevade.restart() to play
    this.fzEvade = this.tweens.add({
      targets: this.enemy,
      x: 640,
      ease: 'power1',
      duration: 300,
      paused: true,
      yoyo: true
    });

    // HIT TEXT TWEENS

    // player hit text fade in
    this.pAlphaUp = this.tweens.add({
      targets: this.ptext,
      duration: 300,
      alpha: 1,
      paused: true,
      delay: 100
    });

    // player hit text fade out
    this.pAlphaDown = this.tweens.add({
      targets: this.ptext,
      duration: 300,
      delay: 700,
      alpha: 0,
      paused: true
    });

    // zombie hit text fade in
    this.zAlphaUp = this.tweens.add({
      targets: this.ztext,
      duration: 300,
      alpha: 1,
      paused: true,
      delay: 100
    });

    // zombie hit text fade out
    this.zAlphaDown = this.tweens.add({
      targets: this.ztext,
      duration: 300,
      delay: 700,
      alpha: 0,
      paused: true
    });



    // DEFINING ANIMATIONS    
    
    // Oldman idle infinite loop
    this.anims.create({
      key: 'omidle',
      frames: this.anims.generateFrameNames('oldman', {
        prefix: 'idle00',
        suffix: '.png',
        start: 1,
        end: 18
      }),
      frameRate: 15,
      repeat: -1
    });

    // Oldman running loops twice
    this.anims.create({
      key: 'omrunning',
      frames: this.anims.generateFrameNames('oldman', {
        prefix: 'running00',
        suffix: '.png',
        start: 1,
        end: 12
      }),
      frameRate: 20,
      repeat: 3
    });


    // Farmzombie animations:

    // farmzombie idle infinite loop
    this.anims.create({
      key: 'fzidle',
      frames: this.anims.generateFrameNames(this.zombie, {
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
      frames: this.anims.generateFrameNames(this.zombie, {
        prefix: 'walking00',
        suffix: '.png',
        start: 1,
        end: 18
      }),
      frameRate: 20,
      repeat: 2
    });

    // farmzombie attack once
    this.anims.create({
      key: 'fzattack',
      frames: this.anims.generateFrameNames(this.zombie, {
        prefix: 'attack00',
        suffix: '.png',
        start: 1,
        end: 12
      }),
      frameRate: 20,
      repeat: 0
    });

    // farmzombie hurt once
    this.anims.create({
      key: 'fzhurt',
      frames: this.anims.generateFrameNames(this.zombie, {
        prefix: 'hurt00',
        suffix: '.png',
        start: 1,
        end: 12
      }),
      frameRate: 20,
      repeat: 0
    });

    // farmzombie dying once
    this.anims.create({
      key: 'fzdying',
      frames: this.anims.generateFrameNames(this.zombie, {
        prefix: 'dying00',
        suffix: '.png',
        start: 1,
        end: 15
      }),
      frameRate: 20,
      repeat: 0
    });

    // farmzombie evade running (just duplicate of walking with repeat 0)
    this.anims.create({
      key: 'fzrunning',
      frames: this.anims.generateFrameNames(this.zombie, {
        prefix: 'walking00',
        suffix: '.png',
        start: 1,
        end: 18
      }),
      frameRate: 30,
      repeat: 0
    });




    // ANIMATION EVENTS
    
    this.player.on('animationcomplete', () => {
      if (this.player.anims.currentAnim.key === 'pdying') {
        this.player.anims.pause();
        setTimeout(() => {
          this.rhythmloop.stop();
          this.scene.start('Gameover', { currentScene: 'Woods' });
        }, 2000);
      } else {
        this.player.play('pidle');
      }
    });

    this.player.on('animationstart', () => {
      if (this.player.anims.currentAnim.key === 'pattack') {
        this.noise.play();
      }
      if (this.player.anims.currentAnim.key === 'phurt') {
        this.ptext.setText('Hit!');
        this.pAlphaUp.restart();
        this.pAlphaDown.restart();
      }
      if (this.player.anims.currentAnim.key === 'prunning') {
        this.ptext.setText('Miss!');
        this.pAlphaUp.restart();
        this.pAlphaDown.restart();
      }
    });

    this.player.on('animationupdate', () => {
      if (this.player.anims.currentAnim.key === 'pthrow' && this.player.anims.currentFrame.index === 3) {
        this.weapon.visible = true;
        this.weaponThrow.restart();
        setTimeout(() => {
          this.noise.play();
        }, 100);
        setTimeout(() => {
          this.weapon.visible = false;
        }, 600);
      }
      if (this.player.anims.currentAnim.key === 'prunattack' && this.player.anims.currentFrame.index === 3) {
        this.noise.play();
      }
    });


    this.oldman.on('animationcomplete', () => {
      this.oldman.play('omidle');
    });

    this.enemy.on('animationstart', () => {
      if (this.enemy.anims.currentAnim.key === 'fzattack') {
        setTimeout(() => {
          this.stab.play();
        }, 100);
      }
      if (this.enemy.anims.currentAnim.key === 'fzhurt') {
        this.ztext.setText('Hit!');
        this.zAlphaUp.restart();
        this.zAlphaDown.restart();
      }
      if (this.enemy.anims.currentAnim.key === 'fzrunning') {
        this.ztext.setText('Miss!');
        this.zAlphaUp.restart();
        this.zAlphaDown.restart();
      }
    });

    this.enemy.on('animationcomplete', () => {
      switch(this.enemy.anims.currentAnim.key) {
      case 'fzwalking':
        this.enemy.play('fzidle');
        this.arrows = true;
        this.menu.visible = true;
        break;
      case 'fzdying':
        this.enemy.anims.pause();
        this.menu.visible = false;
        this.currentDialogue = this.dialogue.woods.afterzombiedies;
        this.turnOn();
        this.rhythmloop.stop();
        this.adventurestinger.play();
        break;
      case 'fzattack':
        this.enemy.play('fzidle');
        this.keyEnter = true;
        break;
      default: 
        this.enemy.play('fzidle');
      }
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
    const space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    if (Phaser.Input.Keyboard.JustDown(space) && this.keySpace) {

      if (this.currentDialogue[i] !== undefined) {
        this.text.setText(this.currentDialogue[i].text);
        // head animation for dialogue
        if (this.currentDialogue[i].char === 'hero') {
          this.phead.visible = true;
          this.omhead.visible = false;
        } else if (this.currentDialogue[i].char === 'oldman') {
          this.omhead.visible = true;
          this.phead.visible = false;
        }
        i++;
      } else {
        switch(this.section) {
        case 1:
          this.turnOff();
          this.oldman.anims.play('omrunning', true);
          this.omRunOn.restart();
          this.player.anims.play('pwalking', true);
          this.pWalkOn.restart();
          this.currentDialogue = this.dialogue.woods.dialogue;
          this.text.style.wordWrapWidth = 320;
          this.text.setX(360);
          setTimeout(() => {
            this.turnOn();
            this.omhead.visible = true;
            this.section = 2;
          } ,2700);
          break;
        case 2:
          this.turnOff();
          this.text.style.wordWrapWidth = 390;
          this.text.setX(320);
          this.omhead.visible = false;
          this.omRunOff.restart();
          this.oldman.anims.play('omrunning', true);
          this.currentDialogue = this.dialogue.woods.endnarration;
          setTimeout(() => {
            this.turnOn();
            this.section = 3;
            this.oldman.anims.pause();
          }, 2700);
          break;
        case 3:
          this.turnOff();
          this.dangerstinger.play();
          this.enemy.anims.play('fzwalking', true);
          this.fzWalkOn.restart();
          setTimeout(() => {
            this.rhythmloop.play();
          }, 15500);
          this.section = 4;
          break;
        case 4:
          this.turnOff();
          this.pWalkOff.restart();
          this.player.anims.play('pwalking', true);
          setTimeout(() => {
            this.scene.start('Town', { char: this.char, weap: this.weap, noises: this.noises, head: this.head, zombie: this.zombie });
          }, 3000);  
          break;
        }
      }
    }
  }

  onKeyInput(event) {
    if (this.arrows) {
      if (event.code === 'ArrowUp') {
        this.actionsMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.actionsMenu.moveSelectionDown();
      } else if (event.code === 'Enter' && this.keyEnter) {
        this.actionsMenu.confirm();
      }
    }
  }

  turnOff() {
    this.keySpace = false;
    this.container.visible = false;
    this.text.visible = false;
  }

  turnOn() {
    i = 1;
    this.keySpace = true;
    this.container.visible = true;
    this.text.visible = true;
    this.text.setText(this.currentDialogue[0].text);
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