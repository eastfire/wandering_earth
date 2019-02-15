// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Global from "global";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
      earth: {
        default: null,
        type: cc.Sprite
      },
      asteroids : [cc.Prefab],
      scoreLabel: {
        default: null,
        type: cc.Label
      },
      lifeLabel: {
        default: null,
        type: cc.Label
      },
      life: 0,
      score: 0,
      scoreUnit: "亿公里",
      explosion: {
        default:null,
        type: cc.AudioClip
      },
      gameOverDialog: {
        default: null,
        type: cc.Layout
      },
      scoreTitle: {
        default: null,
        type: cc.Label
      },
      gameOverTitle: {
        default: null,
        type: cc.Label
      },
      gameOverButtonText: {
        default: null,
        type: cc.Label
      },
      shipPrefab: {
        default: null,
        type: cc.Prefab
      }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      this.gameOverDialog.node.runAction(cc.hide());
      this.earth.getComponent("earth").destX = this.earth.node.x = 0;

      this.node.on('touchstart', ( event ) => {
        var locationInNode = event.getLocation();
        // this.earth.getComponent("earth").destX = locationInNode.x - this.node.width/2
        this.earth.getComponent("earth").moveTo(locationInNode.x - this.node.width/2)
      });
      this.node.on('touchmove', ( event ) => {
        var locationInNode = event.getLocation();
        // this.earth.getComponent("earth").destX = locationInNode.x - this.node.width/2
        // this.earth.getComponent("earth").moveTo(locationInNode.x - this.node.width/2)
      });
      this.node.on('touchend', ( event ) => {
        //this.earth.getComponent("earth").destX = this.earth.node.x;
      });
      this.time = 10;
      this.totalTime = 0;
      this.lastDifficultyChangeTime = 0;
      this.generateTime = 2;
      this.targetLife = this.life;
      Global.game = this;
      this.isGameOver = false;
      this._updateLife()
      this.difficulty = 1;
      this.attackBase = 1000;
      this.gameOverTime = 0;
    },

    reduceLife(damage){
      this.targetLife = Math.max(0, this.targetLife-damage);
      this.lifeLabel.node.color = cc.Color.RED;
    },

    generateAsteroid() {
      var asteroidPrefab = this.asteroids[Math.floor(Math.random()*this.asteroids.length)]
      var asteroid = cc.instantiate(asteroidPrefab);
      asteroid.x = (Math.random()-0.5)*this.node.width*0.85;
      asteroid.y = this.node.height/3*2;
      asteroid.getComponent("asteroid").attack = Math.floor((Math.random()*3*this.attackBase+2*this.attackBase)*this.difficulty);
      asteroid.getComponent("asteroid").speedY = -Math.floor(Math.random()*100*(1+(this.difficulty-1)/5)+200);
      asteroid.setScale(1+Math.random()*Math.min(2,(this.difficulty-1)/20))
      this.node.addChild(asteroid)
    },
    _updateLife(){
      if ( this.gameOverTime == 1 ) {
        this.lifeLabel.string = this.life+"人"
      } else {
        var yi = Math.floor(this.life/10000);
        var wan = this.life % 10000;
        if ( yi ) {
          this.lifeLabel.string = yi+"亿";
          if ( wan ) this.lifeLabel.string += wan+"万";
        } else {
          this.lifeLabel.string = wan+"万";
        }
      }
    },
    update (dt) {
      if ( this.isGameOver )
        return;
      this.time += dt;
      this.score += dt;
      this.totalTime += dt;
      this.scoreLabel.string = (Math.round(this.score*100)/100).toFixed(2)+this.scoreUnit;
      if ( this.totalTime - this.lastDifficultyChangeTime > 5 ) {
        this.difficulty+=1;
        this.lastDifficultyChangeTime = this.totalTime;
        this.generateTime = Math.max(0.5,this.generateTime - 0.1);
      }
      if ( this.time > this.generateTime ) {
        this.time = 0;
        this.generateAsteroid();
      }
      if ( this.life > this.targetLife ) {
        this.life -= Math.round((this.life-this.targetLife)/10)+10;
        if ( this.life <= this.targetLife ) {
          this.life = this.targetLife;
          this.lifeLabel.node.color = cc.Color.WHITE;
        }
        this._updateLife();
        if ( this.life == 0 ) {
          this.gameOver();
        }
      } else {

      }
    },
    restart(){
      this.gameOverDialog.node.runAction(cc.hide());
      if ( this.gameOverTime == 1 ) {
        this.earth = cc.instantiate(this.shipPrefab);
        this.earth.x = 0;
        this.earth.y = -320;
        this.node.addChild(this.earth)
        this.scoreTitle.string = "幸存人数"
        this.gameOverButtonText.string = "再浪一次"
        this.gameOverTitle.string = "道路千万条，安全第一条\n航船不规范，人类两行泪"
        this.isGameOver = false;
        this.targetLife = this.life = 10000;
        this.attackBase = 30;
        this._updateLife()
        // this.difficulty = Math.floor(this.difficulty*2/3)
      } else {
        cc.director.loadScene("main");
      }
    },
    gameOver(){
      this.isGameOver = true;
      this.gameOverTime++;
      if ( this.gameOverTime == 1 ) {
        this.earth.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.removeSelf()))
      } else {
        this.earth.runAction(cc.sequence(cc.fadeOut(0.5), cc.removeSelf()))
      }
      this.gameOverDialog.node.runAction(cc.show());
    }
});
