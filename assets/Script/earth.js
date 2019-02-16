// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
        direction: 0,
        maxMoveSpeed: 150,
        acc: 0,
        maxAcc: 300,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      cc.director.getCollisionManager().enabled = true;
    },

    start () {
      this.xSpeed = 0;
    },

    moveTo(destX){
      // var maxX = this.node.parent.width/2*0.8;
      // var minX = -maxX;
      // destX = Math.max(minX, Math.min(destX, maxX))
      // var distance = Math.abs(destX - this.node.x)
      //
      // if ( this.moveAction )
      //   this.node.stopAction(this.moveAction)
      // this.moveAction = cc.moveTo(distance/this.maxMoveSpeed, destX, this.node.y).easing(
      //   //cc.easeElasticOut()
      //   cc.easeInOut()
      // )
      // this.node.runAction(this.moveAction);
      this.destX = destX
      this.direction = this.destX - this.node.x;
      this.acc = this.maxAcc * this.direction/Math.abs(this.direction)
      this.passed = false;
      this.moveType = "point";
    },

    directTo(direction){
      if ( Math.abs(direction) > 0.1 ) {
        this.moveType = "direction";
        this.direction = direction;
      }
    },

    update (dt) {
      if ( this.moveType == "point" ) {
        if (this.direction < 0 ) {
          if ( this.node.x <= this.destX && !this.passed ) { //已过线
            this.passed = true;
            this.acc = -this.acc;
          }
        } else if (this.direction > 0 ) {
          if ( this.node.x >= this.destX && !this.passed ) { //已过线
            this.passed = true;
            this.acc = -this.acc;
          }
        }
        this.xSpeed += this.acc * dt;

        if ( this.passed && Math.abs(this.xSpeed) >= 0 && Math.abs(this.xSpeed) < 10 ) {
          this.acc = 0;
          this.xSpeed = 0;
          this.direction = 0;
        }
      } else if ( this.moveType == "direction") {
        this.xSpeed = this.direction*this.maxMoveSpeed / 0.3;
      }
      // 限制主角的速度不能超过最大值
      if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
          // if speed reach limit, use max speed with current direction
          this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
      }

      // 根据当前速度更新主角的位置
      this.node.x += this.xSpeed * dt;

      // 限制位置
      var maxX = this.node.parent.width/2*0.8;
      var minX = -maxX;
      if ( this.node.x > maxX ) {
        this.node.x = maxX;
      } else if ( this.node.x < minX ) {
        this.node.x = minX;
      }
    },
});
