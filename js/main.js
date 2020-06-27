function Enemy(config){
	var that=this;
	this.init=function(){
		//敌机生成
		
		this.enemys=game.add.group();
		this.enemys.enableBody=true;
		this.enemys.createMultiple(config.selfPool,config.selfPic);
		this.enemys.setAll('outOfBoundskill',true);
		this.enemys.setAll('checkWorldBounds',true);
		//敌机子弹的对象池生成
		this.enemyBullets=game.add.group();
		this.enemyBullets.enableBody=true;
		this.enemyBullets.createMultiple(config.bulletsPool,config.bulletPic);
		this.enemyBullets.setAll('outOfBoundskill',true);
		this.enemyBullets.setAll('checkWorldBounds',true);
		//敌机坠亡动画对象池加载
		this.explosions=game.add.group();
		this.explosions.createMultiple(config.bulletsPool,config.bulletPic);
		this.explosions.forEach(function(explosion){
		  explosion.animations.add(config.explodePic);
		},this);
	
		
		//敌人的随机位置范围    (cache：缓存)
		this.maxWidth=game.width-game.cache.getImage(config.selfPic).width;
		//产生敌人的定时器
		game.time.events.loop(Phaser.Timer.SECOND * config.selfTimeInterval,this.generateEnemy,this);
		
	}
	
	//敌军生成
	this.generateEnemy=function(){
		
		var e=this.enemys.getFirstExists(false);
		if(e){
			e.reset(game.rnd.integerInRange(0,this.maxWidth),-game.cache.getImage(config.selfPic).height);
			e.life=config.life;
			e.body.velocity.y=config.velocity;
		}
	}
	
	//敌军被击中
	this.hitEnemy=function(bullet,enemy){
		bullet.kill();
		enemy.life--;
				if(enemy.life<=0){
			enemy.kill();
			score+=config.score;
			
			config.game.scoreText.setText("Score:"+score);
			
			config.crashsound.play();
	//		console.log(this)
			var explosion=that.explosions.getFirstExists(false);
			explosion.reset(enemy.body.x,enemy.body.y);
			explosion.play(config.explodePic,30,false,true);
			
		}
	}
	//敌机发射子弹
	this.enemyFire=function(){
		this.enemys.forEachExists(function(enemy){
			var bullet=this.enemyBullets.getFirstExists(false);
			if(bullet){
				if(game.time.now>(enemy.bulletTime||0)){
					config.firesound.play();
					bullet.reset(enemy.x+config.bulletX,enemy.y+config.bulletY);
					bullet.body.velocity.y=config.bulletVelocity;
					enemy.bulletTime=game.time.now+config.bulletTimeInterval;
				}
			}
		},this);
	}
	
}



//js 数字 字符串
//四个参数--------------宽度 高度 渲染模式
var game=new Phaser.Game(240,400,Phaser.CANVAS,"game");
function onClose(){
		document.getElementById('share').style.display='none';
	}
function kaishi(){
	if(game.paused){
		game.paused=false;
		document.getElementById('kaishi').value="暂停";
	}else{
		game.paused=true;
		document.getElementById('kaishi').value="开始";
	}
}
//场景对象 js大小写敏感
game.States={};
var flag=true;
var score=0;
var markNum=0;
//加载 开始的场景 方法
game.States.preload =function(){
		//1个场景 3=函数 3=生命周期 preload create update 至少要有一个
		this.preload=function(){
			this.scale.scaleMode=Phaser.ScaleManager.EXACT_FIT;
			
			
			
			
			//加载图片 别称，地址
			game.load.image("bg","assets/bg.jpg");
			//加载精灵图 别称，地址 宽带 高度 分成几份
			game.load.spritesheet("myplane","assets/myplane.png",40,40,4);
			//加载开始按钮精灵图
			game.load.spritesheet("startbutton","assets/startbutton.png",100,40,2);
			game.load.spritesheet("replaybutton","assets/replaybutton.png",80,30,2);
			game.load.spritesheet("sharebutton","assets/sharebutton.png",80,30,2);
			//加载子弹图
			game.load.image("mybullet","assets/mybullet.png");
			//加载敌人1
			game.load.image("enemy1","assets/enemy1.png");
			game.load.image("enemy2","assets/enemy2.png");
			game.load.image("enemy3","assets/enemy3.png");
			//加载音频
			game.load.audio('playback','assets/playback.mp3');
			game.load.audio('ao','assets/ao.mp3');
			game.load.audio('crash1','assets/crash1.mp3');
			game.load.audio('crash2','assets/crash2.mp3');
			game.load.audio('crash3','assets/crash3.mp3');
			game.load.audio('deng','assets/deng.mp3');
			game.load.audio('fashe','assets/fashe.mp3');
			game.load.audio('normalback','assets/normalback.mp3');
			game.load.audio('pi','assets/pi.mp3');
			//敌人爆炸精灵图
			game.load.spritesheet('explode1','assets/explode1.png',20,20,3);
			game.load.spritesheet('explode2','assets/explode2.png',30,30,3);
			game.load.spritesheet('explode3','assets/explode3.png',50,50,3);
			//我方爆炸精灵
			game.load.spritesheet("myexplode",'assets/myexplode.png',40,40,3);
			//敌人子弹
			game.load.image("bullet","assets/bullet.png");
			//奖励
			game.load.image("award","assets/award.png");
		}
		this.create=function(){
			this.normalback=game.add.audio('normalback',0.2,true);
			this.normalback.play();
			//x,y宽度，高度，别称
			var bg=game.add.tileSprite(0,0,game.width,game.height,"bg");
			//自动滚动，x方向的速度，y方向的速度
			bg.autoScroll(0,30);
			                                   //x,y,别称，方法，作业域传递 a=鼠标悬停 b=鼠标离开 c=按钮弹起
			this.startbutton=game.add.button(70,200,'startbutton',this.onStartClick,this,1,1,0);
			
			//x,y别称
			
		}
		this.onStartClick=function(){
			game.state.start("main");
			this.normalback.stop();
		}
	}
	
		//游戏主场景
	game.States.main=function(){
		
		
		this.create=function(){
			flag=true;
			
			this.playback=game.add.audio('playback',0.2,true);
			this.playback.play();
			
			this.ao=game.add.audio('ao',10,false);
			
			this.firesound=game.add.audio('fashe',5,false);
			
			this.crash1=game.add.audio('crash1',10,false);
			this.crash2=game.add.audio('crash2',10,false);
			this.crash3=game.add.audio('crash3',20,false);
			
			this.deng=game.add.audio('deng',10,false);
			
			this.pi=game.add.audio('pi');
			//x，y 宽度，高度,别称
			var bg = game.add.tileSprite(0,0,game.width,game.height,"bg");
			//自动滚动，x方向的速度，y方向的速度
			bg.autoScroll(0,150);
			
			
			
			
			var style={font:"16px Arial",fill:"#ff0000"};
			//x,y,内容，样式
			this.scoreText=game.add.text(0,0,"Score:0",style);
			this.levelText=game.add.text(180,0,"level:2",style);
			
			//x,y,别称
			this.plane=game.add.sprite(100,200,"myplane");
			//默认精灵图播放的是第一张图片，我们需要手动添加一个动画，让她播放器来
			this.plane.animations.add("fly");
			//pplane.animations.play("fly",30,是否重复，重复：true，  不重复：false)
			this.plane.animations.play("fly",12,true)
			//飞机拖拽动作
			this.plane.inputEnabled=true;
			this.plane.input.enableDrag();
			//飞机获取物理体
			game.physics.arcade.enable(this.plane);
			//飞机等级
			this.plane.level=2;
			//子弹准备  注册  子弹组 对象池
			this.bulletGroup=game.add.group();
			//数量，别称
			//子弹组开启物理体，开启后能够感知碰撞，重力等效果
			this.bulletGroup.enableBody=true;
			this.bulletGroup.createMultiple(50,"mybullet");
			//删除越界的子弹
			this.bulletGroup.setAll("outOfBoundsKill",true)
			//回收
			this.bulletGroup.setAll("checkWorldBounds",true)
			this.bulletTime=0;
			
			//敌人组  注册
		//	this.enemy1Group = game.add.group();
		//	this.enemy1Group.enableBody=true;
		//	this.enemy1Group.createMultiple(10,"enemy1");
		//	this.enemy1Group.setAll("outOfBoundsKill",true);
		//	this.enemy1Group.setAll("checkWorldBounds",true);
		//	this.enemy1Time=0;
			
			//坠机动画组 注册  加载
		//	this.explosions=game.add.group();
		//	this.explosions.createMultiple(10,"explode1");
		//	this.explosions.forEach(function(explosion){
		//	explosion.animations.add("explode1");
		//	},this);
			
		//敌机子弹得对象池生成
	//	this.enemyBullets=game.add.group();
	//	this.enemyBullets.enableBody=true;
	//	this.enemyBullets.createMultiple(100,"bullet");
	//	this.enemyBullets.setAll('outOfBoundskill',true);
	//	this.enemyBullets.setAll('checkWorldBounds',true);
		
		//奖励组注册
		this.awards=game.add.group();
		this.awards.enableBody=true;
		this.awards.createMultiple(1,"award");
		this.awards.setAll('outOfBoundskill',true);
		this.awards.setAll('checkWorldBounds',true);
		
		 var enemyTeam = {
		            enemy1: {
		              game: this, //游戏对象
		              selfPic: 'enemy1', //敌人图片
		              bulletPic: 'bullet', //子弹的图片
		              explodePic: 'explode1', //敌人死亡动画
		              selfPool: 10, //敌机对象池数量
		              bulletsPool: 50, //子弹对象池数量
		              explodePool: 10, //死亡动画对象池数量
		              life: 2,//血量
		              velocity: 50, //速度
		              bulletX: 9, //子弹距离敌机X轴的位置
		              bulletY: 20,//子弹距离敌机Y轴的位置
		              bulletVelocity: 200, //子弹飞行速度
		              selfTimeInterval: 2, //敌机生成的频率
		              bulletTimeInterval: 1000, //子弹生成的频率
		              score: 10, //分数
		              firesound: this.firesound, //开火音效
		              crashsound: this.crash1 //死亡音效
		            },
		            enemy2: {
		              game: this,
		              selfPic: 'enemy2',
		              bulletPic: 'bullet',
		              explodePic: 'explode2',
		              selfPool: 10,
		              bulletsPool: 50,
		              explodePool: 10,
		              life: 3,
		              velocity: 40,
		              bulletX: 13,
		              bulletY: 30,
		              bulletVelocity: 250,
		              selfTimeInterval: 3,
		              bulletTimeInterval: 1200,
		              score: 20,
		              firesound: this.firesound,
		              crashsound: this.crash2
		            },
		            enemy3: {
		              game: this,
		              selfPic: 'enemy3',
		              bulletPic: 'bullet',
		              explodePic: 'explode3',
		              selfPool: 5,
		              bulletsPool: 25,
		              explodePool: 5,
		              life: 10,
		              velocity: 30,
		              bulletX: 22,
		              bulletY: 50,
		              bulletVelocity: 300,
		              selfTimeInterval: 10,
		              bulletTimeInterval: 1500,
		              score: 50,
		              firesound: this.firesound,
		              crashsound: this.crash3
		            }
		          }
				//构造函数
				this.enemy1=new Enemy(enemyTeam.enemy1);
				this.enemy1.init();
				this.enemy2=new Enemy(enemyTeam.enemy2);
				this.enemy2.init();
				this.enemy3=new Enemy(enemyTeam.enemy3);
				this.enemy3.init();
	}
		//更新
		this.update=function(){
			if(flag){
			this.shoot();
			
			this.enemy1.enemyFire();
			this.enemy2.enemyFire();
			this.enemy3.enemyFire();
			//触碰函数  前2个参数  触碰的双方  回调函数
			game.physics.arcade.overlap(this.bulletGroup,this.enemy1.enemys,this.enemy1.hitEnemy,null,this);
			game.physics.arcade.overlap(this.bulletGroup,this.enemy2.enemys,this.enemy2.hitEnemy,null,this);
			game.physics.arcade.overlap(this.bulletGroup,this.enemy3.enemys,this.enemy3.hitEnemy,null,this);
			game.physics.arcade.overlap(this.enemy1.enemyBullets,this.plane,this.hitMyplane,null,this);
			game.physics.arcade.overlap(this.enemy2.enemyBullets,this.plane,this.hitMyplane,null,this);
			game.physics.arcade.overlap(this.enemy3.enemyBullets,this.plane,this.hitMyplane,null,this);
			game.physics.arcade.overlap(this.enemy1.enemys,this.plane,this.crashMyplane,null,this);
			game.physics.arcade.overlap(this.enemy2.enemys,this.plane,this.crashMyplane,null,this);
			game.physics.arcade.overlap(this.enemy3.enemys,this.plane,this.crashMyplane,null,this);
			game.physics.arcade.overlap(this.awards,this.plane,this.getAward,null,this);
			
			
			//奖励生成
			this.generateAward();
			}
		}
		//奖励碰撞回调
		this.getAward=function(plane,award){
			award.kill();
			this.deng.play();
			if(plane.level<3){
				plane.level++;
				this.levelText.setText("level:"+plane.level);
			}
		}
		//奖励生成
		this.generateAward=function(){
			//奖励生成条件
			if(score % 100 == 0 && score!=0 && score!=markNum){
				makNum=score;
			var award;
			award=this.awards.getFirstExists(false);
			if(award){
				award.reset(game.rnd.integerInRange(0,game.width-game.cache.getImage("award").width),0);
				award.body.velocity.y=400;
			}
		}
	}
	//敌机于我机撞击回调
		this.crashMyplane=function(plane,enemy){
			enemy.kill();
			plane.kill();
			this.ao.play();
			flag=false;
			//敌人死亡动画
		//	var explosion=this.explosions.getFirstExists(false);
		//	if(explosion){
		//		explosion.reset(enemy.body.x,enemy.body.y);
		//		explosion.play("explode1",30,false,true);
		//	}
			//生成精灵  x，y，别称
				var myexplode=game.add.sprite(this.plane.x,this.plane.y,'myexplode');
			//生成动画赋予精灵
				var anim=myexplode.animations.add('myexplode');
				//别称 频率  是否重复  是否有回调函数
				myexplode.animations.play('myexplode',30,false,true);
				anim.onComplete.add(this.gotoOver,this);
				}
	//			//我机被敌人子弹射中回调
		this.hitMyplane=function(plane,enemyBullet){
			enemyBullet.kill();
			this.ao.play();
			if(plane.level>1){
				plane.level--;
				this.levelText.setText("level:"+plane.level);
			}else{
				plane.kill();
				flag=false;
			//生成精灵  x，y，别称
			var myexplode=game.add.sprite(this.plane.x,this.plane.y,'myexplode');
			//生成动画赋予精灵
			var anim=myexplode.animations.add('myexplode');
			//别称 频率  是否重复  是否有回调函数
			myexplode.animations.play('myexplode',30,false,true);
			anim.onComplete.add(this.gotoOver,this);
			
		}
	}
	//游戏结束回调--死亡动画播放后回调
		this.gotoOver=function(){
			game.state.start("preload")
			setTimeout(()=>{
				this.playback.stop();
				game.state.start("end")
			},3000);
			
			
		}
	//	//敌人发射子弹
	//	this.enemyFire=function(){
	//		this.enemy1Group.forEachExists(function(enemy){
	//			//敌人子弹池里的第一颗敌人子弹
	//			var bullet=this.enemyBullets.getFirstExists(false);
	//			if(bullet){
	//				if(game.time.now > (enemy.bulletTime || 0)){
	//					bullet.reset(enemy.x+8,enemy.y+15);
	//					bullet.body.velocity.y=500;
	//					enemy.bulletTime=game.time.now+700;
	//				}
	//			}
	//		},this);
	//	}
	//	//敌人被击中的回调
	//	this.hitEnemy=function(bullet,enemy1){
	//		shadiNum++;
	//		bullet.kill();
	//		enemy1.kill();
	//		var explosion=this.explosions.getFirstExists(false);
	//		if(explosion){
	//			explosion.reset(enemy1.body.x,enemy1.body.y);
	//			explosion.play("explode1",30,false,true);
	//		}
	//	}
	//	//生成敌军---实现
	//	this.generateEnemy=function(){
	//		if(game.time.now>this.enemy1Time){
	//		var enemy1;
	//		enemy1=this.enemy1Group.getFirstExists(false);
	//		if(enemy1){
	//			
	//			enemy1.reset(game.rnd.integerInRange(0,game.width-game.cache.getImage("enemy1").width),0,);
	//			enemy1.body.velocity.y=200;
	//			//enemy1.body.velocity.x=game.rnd.integerInRange(0,100);
	//			//setTimeout(() =>{
	//				//enemy1.body.velocity.x=game.rnd.integerInRange(-200,200);
	//			//},1000);
	//			this.enemy1Time=game.time.now+game.rnd.integerInRange(500,900);
	//			}
	//		}
	//	}
		//我方发射子弹
		this.shoot=function(){
			//当前时间大于下一颗子弹应该发射的时间
			   if(game.time.now > this.bulletTime){
				   
				this.pi.play();
			   //子弹发射
			   if(this.plane.level>1){
			   var bullet;
			   //子弹组里的第一颗
			   bullet=this.bulletGroup.getFirstExists(false)
			   //判断子弹组里是否还有子弹
			   if(bullet){
			    //放置  x，y
                    bullet.reset(this.plane.x+15,this.plane.y-14);
                    //速度 方法
                    bullet.body.velocity.y=-400;
                    //下一颗应该发射的子弹时间为当前时间+400
                    this.bulletTime=game.time.now+400;
				}
				
				bullet=this.bulletGroup.getFirstExists(false);
				//判断子弹组里是否还有子弹
				if(bullet){
				 //放置  x，y
				 bullet.reset(this.plane.x+15,this.plane.y-14);
				 //速度 方法
				 bullet.body.velocity.y=-400;
				 bullet.body.velocity.x=-80;
				 }
				 
				 bullet=this.bulletGroup.getFirstExists(false)
				 //判断子弹组里是否还有子弹
				 if(bullet){
				  //放置  x，y
				  bullet.reset(this.plane.x+15,this.plane.y-14);
				  //速度 方法
				  bullet.body.velocity.y=-400;
				  bullet.body.velocity.x= 80;
					}
				}else if(this.plane.level==1){
					var bullet;
					//子弹组里的第一颗
					bullet=this.bulletGroup.getFirstExists(false)
					//判断子弹组里是否还有子弹
					if(bullet){
					 //放置  x，y
					     bullet.reset(this.plane.x+15,this.plane.y-14);
					     //速度 方法
					     bullet.body.velocity.y=-400;
					     //下一颗应该发射的子弹时间为当前时间+400
					     this.bulletTime=game.time.now+400;
					}
				}
			}
		}
	}
	
	game.States.end=function(){
		this.create=function(){
			var bg=game.add.tileSprite(0,0,game.width,game.height,"bg");
			
			//自动滚动，x方向的速度，y方向的速度
			bg.autoScroll(0,30);
			var style={font:"bold 32px Arial",fill:"#ff0000",boundsAlignH:"center",boundsAlignV:"middle"};
			this.text=game.add.text(0,0,"Score:"+score,style);
			this.text.setTextBounds(0,0,game.width,game.height);
			
			this.sharebutton=game.add.button(30,250,'sharebutton',this.onShareClick,this,0,0,1);
			this.replaybutton=game.add.button(130,250,'replaybutton',this.onReplayClick,this,0,0,1);
		}
		this.onShareClick=function(){
			document.getElementById("share").style.display="block";
		}
		this.onReplayClick=function(){
			game.state.start("main");
		}
	}
	//场景注册  别称，函数名
	
	
	game.state.add("preload",game.States.preload);
	game.state.add("main",game.States.main);
	game.state.add("end",game.States.end);
	//开始
	game.state.start("preload")