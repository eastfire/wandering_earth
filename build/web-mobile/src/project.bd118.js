window.__require=function t(e,i,o){function n(a,r){if(!i[a]){if(!e[a]){var c=a.split("/");if(c=c[c.length-1],!e[c]){var h="function"==typeof __require&&__require;if(!r&&h)return h(c,!0);if(s)return s(c,!0);throw new Error("Cannot find module '"+a+"'")}}var d=i[a]={exports:{}};e[a][0].call(d.exports,function(t){return n(e[a][1][t]||t)},d,d.exports,t,e,i,o)}return i[a].exports}for(var s="function"==typeof __require&&__require,a=0;a<o.length;a++)n(o[a]);return n}({asteroid:[function(t,e,i){"use strict";cc._RF.push(e,"83ef7+zJc9Hyom021YJ0h9e","asteroid");var o=function(t){return t&&t.__esModule?t:{default:t}}(t("global"));cc.Class({extends:cc.Component,properties:{attack:100,speedY:-250},onLoad:function(){var t=360*(Math.random()>.5?1:-1),e=Math.round(20*Math.random())/10+2;this.node.runAction(cc.repeatForever(cc.rotateBy(e,t))),cc.director.getCollisionManager().enabled=!0},onCollisionEnter:function(t){t.getComponent("earth")&&!this.die&&(this.die=!0,cc.audioEngine.play(o.default.game.explosion,!1,.5),this.node.runAction(cc.sequence(cc.fadeOut(.4),cc.callFunc(function(){this.node.destroy()},this))),o.default.game.reduceLife(this.attack))},start:function(){},update:function(t){this.node.y+=this.speedY*t,this.node.y<-this.node.parent.height&&this.node.destroy()}}),cc._RF.pop()},{global:"global"}],earth:[function(t,e,i){"use strict";cc._RF.push(e,"27caeOfwlFG5pYOfFwwO2om","earth"),cc.Class({extends:cc.Component,properties:{direction:0},onLoad:function(){cc.director.getCollisionManager().enabled=!0},start:function(){this.accel=300,this.xSpeed=0,this.maxMoveSpeed=150},update:function(t){this.destX<this.node.x?this.xSpeed-=this.accel*t:this.destX>this.node.x&&(this.xSpeed+=this.accel*t),Math.abs(this.xSpeed)>this.maxMoveSpeed&&(this.xSpeed=this.maxMoveSpeed*this.xSpeed/Math.abs(this.xSpeed)),this.node.x+=this.xSpeed*t;var e=this.node.parent.width/2*.8,i=-e;this.node.x>e?this.node.x=e:this.node.x<i&&(this.node.x=i)}}),cc._RF.pop()},{}],global:[function(t,e,i){"use strict";cc._RF.push(e,"18579BfvbpBNK1QD+E2EptL","global"),Object.defineProperty(i,"__esModule",{value:!0}),i.default={game:null},e.exports=i.default,cc._RF.pop()},{}],intro:[function(t,e,i){"use strict";cc._RF.push(e,"f770dAFc3BJEb8WzNiflbGd","intro"),cc.Class({extends:cc.Component,properties:{},start:function(){this.node.on("touchend",function(t){cc.director.loadScene("main")})}}),cc._RF.pop()},{}],main:[function(t,e,i){"use strict";cc._RF.push(e,"db466tuZhxInryeH0OXPa15","main");var o=function(t){return t&&t.__esModule?t:{default:t}}(t("global"));cc.Class({extends:cc.Component,properties:{earth:{default:null,type:cc.Sprite},asteroids:[cc.Prefab],scoreLabel:{default:null,type:cc.Label},lifeLabel:{default:null,type:cc.Label},life:0,score:0,scoreUnit:"\u4ebf\u516c\u91cc",explosion:{default:null,type:cc.AudioClip},gameOverDialog:{default:null,type:cc.Layout}},start:function(){var t=this;this.gameOverDialog.node.runAction(cc.hide()),this.earth.getComponent("earth").destX=this.earth.node.x=0,this.node.on("touchstart",function(e){var i=e.getLocation();t.earth.getComponent("earth").destX=i.x-t.node.width/2}),this.node.on("touchmove",function(e){var i=e.getLocation();t.earth.getComponent("earth").destX=i.x-t.node.width/2}),this.node.on("touchend",function(e){t.earth.getComponent("earth").destX=t.earth.node.x}),this.time=10,this.totalTime=0,this.lastDifficultyChangeTime=0,this.generateTime=2,this.targetLife=this.life,o.default.game=this,this.isGameOver=!1,this._updateLife(),this.difficulty=1},reduceLife:function(t){this.targetLife=Math.max(0,this.targetLife-t),this.lifeLabel.node.color=cc.Color.RED},generateAsteroid:function(){var t=this.asteroids[Math.floor(Math.random()*this.asteroids.length)],e=cc.instantiate(t);e.x=(Math.random()-.5)*this.node.width*.85,e.y=this.node.height/3*2,e.getComponent("asteroid").attack=Math.floor((5e3*Math.random()+5e3)*this.difficulty),e.getComponent("asteroid").speedY=-Math.floor(100*Math.random()*(1+(this.difficulty-1)/5)+200),e.setScale(1+Math.random()*Math.min(2,(this.difficulty-1)/10)),this.node.addChild(e)},_updateLife:function(){var t=Math.floor(this.life/1e4),e=this.life%1e4;t?(this.lifeLabel.string=t+"\u4ebf",e&&(this.lifeLabel.string+=e+"\u4e07")):this.lifeLabel.string=e+"\u4e07"},update:function(t){this.isGameOver||(this.time+=t,this.score+=t,this.totalTime+=t,this.scoreLabel.string=(Math.round(100*this.score)/100).toFixed(2)+this.scoreUnit,this.totalTime-this.lastDifficultyChangeTime>5&&(this.difficulty+=1,this.lastDifficultyChangeTime=this.totalTime,this.generateTime=Math.max(.7,this.generateTime-.1)),this.time>this.generateTime&&(this.time=0,this.generateAsteroid()),this.life>this.targetLife&&(this.life-=Math.round((this.life-this.targetLife)/10)+10,this.life<=this.targetLife&&(this.life=this.targetLife,this.lifeLabel.node.color=cc.Color.WHITE),this._updateLife(),0==this.life&&this.gameOver()))},restart:function(){cc.director.loadScene("main")},gameOver:function(){this.isGameOver=!0,this.earth.node.runAction(cc.sequence(cc.fadeOut(.5),cc.removeSelf())),this.gameOverDialog.node.runAction(cc.show())}}),cc._RF.pop()},{global:"global"}]},{},["asteroid","earth","global","intro","main"]);