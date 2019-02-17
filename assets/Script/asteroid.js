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
        speedY: -250,


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
          cc.removeSelf()
        ))
        Global.game.reduceLife(this.attack);
        var effect = cc.instantiate(Global.game.effectPrefab)
        effect.x = (this.node.x+other.node.x)/2;
        effect.y = (this.node.y+other.node.y)/2;
        effect.rotation = Math.random()*360
        effect.setScale(0)
        var word = ["爆","炸","轰"]
        effect.getComponent(cc.Label).string = word[Math.floor(Math.random()*word.length)]
        Global.game.playLayer.addChild(effect)
        effect.runAction(cc.sequence(
          cc.scaleTo(0.5,1.5).easing(cc.easeCubicActionIn()),
          cc.removeSelf()
        ))

        var debritNumber = Math.floor(Math.random()*3+1)
        for ( var i = 0 ; i < debritNumber; i++){
          var effect = cc.instantiate(Global.game.effectPrefab)
          effect.x = this.node.x
          effect.y = this.node.y
          effect.rotation = Math.random()*360
          effect.setScale(0.7)
          var word = ["碎","片","石","破","裂"]
          var colors = [cc.Color.GRAY, cc.color(148,148,148,255), cc.color(88,88,88,255)]
          effect.getComponent(cc.Label).string = word[Math.floor(Math.random()*word.length)]
          effect.color = colors[Math.floor(Math.random()*colors.length)]
          Global.game.playLayer.addChild(effect)
          var xx = Math.random()*100-50;
          var yy = Math.random()*100-50;
          xx = xx || 50;
          yy = yy || 50;
          xx += 100*Math.abs(xx)/xx
          yy += 100*Math.abs(yy)/yy
          effect.runAction(cc.sequence(
            cc.spawn(cc.rotateBy(0.6,Math.random()*360),cc.moveBy(0.6, xx, yy)),
            cc.removeSelf()
          ))
        }
      }
    },

    start () {
    },

    update (dt) {
      this.node.y += this.speedY*dt;
      if ( this.node.y < -this.node.parent.height || Global.game.isGameOver ) {
        this.node.destroy();
      }
    },
});
