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
        attack: 100,
        speedY: -250
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      var angle = 360*(Math.random()>0.5?1:-1);
      var time = Math.round(20*Math.random())/10+2;
      this.node.runAction(cc.repeatForever(cc.rotateBy(time, angle)))

      cc.director.getCollisionManager().enabled = true;
    },

    onCollisionEnter(other) {
      if ( other.getComponent("earth") && !this.die ) {
        this.die = true;
        cc.audioEngine.play(Global.game.explosion, false, 0.5);
        this.node.runAction(cc.sequence(
          cc.fadeOut(0.4),
          cc.callFunc(function(){
            this.node.destroy();
          },this)
        ))
        Global.game.reduceLife(this.attack);

      }
    },

    start () {
    },

    update (dt) {
      this.node.y += this.speedY*dt;
      if ( this.node.y < -this.node.parent.height) {
        this.node.destroy();
      }
    },
});
