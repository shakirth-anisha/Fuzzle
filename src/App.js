import { useEffect } from 'react';
import basic from './images/basic.png';
import fore from './images/foreground.png';
import playerDown from './images/playerDown.png'
import playerUp from './images/playerUp.png'
import playerLeft from './images/playerLeft.png'
import playerRight from './images/playerRight.png'

import './App.css';
import collisions from './data/collisions'
import battleMap from './data/battle'
import { Sprite, Boundary } from './classes'
import { FadeInOut, startAnimation} from './BattleStart';

function App() {
useEffect(() => {
    const canvas = document.querySelector('canvas');
    const basic_img = new Image();
    const foreground_img = new Image();
	const playerDown_img = new Image();
	const playerUp_img = new Image();
	const playerRight_img = new Image();
	const playerLeft_img = new Image();

    basic_img.src = basic;
    foreground_img.src = fore;
	playerDown_img.src = playerDown;
	playerUp_img.src = playerUp;
	playerRight_img.src = playerRight;
	playerLeft_img.src = playerLeft;

	const velocity = 5;
	const battle_rate = 0.01;

	const c = canvas.getContext('2d');
	if (c) {
		c.clearRect(0, 0, canvas.width, canvas.height);
		c.fillStyle = 'white';
		c.fillRect(0, 0, canvas.width, canvas.height);
	}

	const playerPosition = {
		x: 840,
		y: 466,
	  };

	//COMMENT FOR CENTER OF SCREEN FOR PLAYER ---NOT NECESSARY
	//   console.log(window.innerWidth / 2 - playerDown_img.width / 8)
	//   console.log(window.innerHeight / 2 - playerDown_img.height / 2)

	const offset = {
		x: -530,
		y: -1215,
	}
	
	//COMMENT Creating an initial bg, foreground and collison layer
	const background = new Sprite({
		position: {
			x: offset.x,
			y: offset.y
		},
		image: basic_img,
		c: c
	})
	const foreground = new Sprite({
		position: {
			x: offset.x,
			y: offset.y
		},
		image: foreground_img,
		c: c
	})
	const player = new Sprite({
		position: {
			x: playerPosition.x,
			y: playerPosition.y
		},
		image: playerDown_img,
		frames: {max: 4},
		c: c
	})
	const boundaries = [];
	collisions.forEach((row, i) => {
		row.forEach((symbol, j)=> {
			if(symbol === 1025){
				boundaries.push(new Boundary ({
					position: {
						x: (j * Boundary.width) + background.position.x,
						y: (i * Boundary.height) + background.position.y,
					},
					c: c,
					color: 'rgba(255,0,0,0)'
				}))
			}
		})
	})
	const battle_zone = [];
	battleMap.forEach((row, i) => {
		row.forEach((symbol, j)=> {
			if(symbol === 1025){
				battle_zone.push(new Boundary ({
					position: {
						x: (j * Boundary.width) + background.position.x,
						y: (i * Boundary.height) + background.position.y,
					},
					c: c,
					color: 'rgba(0,0,220,0)'
				}))
			}
		})
	})

	//COMMENT key pressed or not
	const keys = {
		w: {pressed: false},
		a: {pressed: false},
		s: {pressed: false},
		d: {pressed: false}
	}

	const moveables = [background, ...boundaries, foreground, ...battle_zone];
	const renderables = [background, ...boundaries, ...battle_zone, player, foreground];
	// const test_boundary = new Sprite({
	// 	position: {
	// 		x: 825,
	// 		y: 550,
	// 	},
	// c: c
	// })

	function iscollide({user, object}) {
		return (
			user.position.x + user.width >= object.position.x && 
			user.position.x <= object.position.x + object.width && 
			user.position.y <= object.position.y + object.height &&
			user.position.y + user.height >= object.position.y 
		);
	}

	const battle_activate = {
		initiated: false
	}
	let animationId; // Player animation frame ID
    let battleAnimationId; // Battle animation frame ID
    let continueBattleAnimation = false;
	let battlethingy = 0;

	function player_animate() {
		animationId = window.requestAnimationFrame(player_animate)
		renderables.forEach((renderable) => {
			renderable.draw();
		});

		//COMMENT everything else
		// battlethingy = 1;
		// if(battlethingy == 1){
		// 	player.visible = false;
		// 	dragon.visible = true;
		// 	ember.visible = true;
		// 	dragon.draw();
		// 	ember.draw()
		// 	console.log("ok img")
		// } //using html instead --NO FUCK THAT
		// else {
		background.draw();
		// test_boundary.draw()
		boundaries.forEach(boundary => {
			boundary.draw();
		})
		battle_zone.forEach(battleMap => {
			battleMap.draw();
		})
		player.draw()
		foreground.draw()
	// }
		let moving = true;
		
		//COMMENT Activate Battle
		if (battle_activate.initiated) return //dont let code run if battle is on
		if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
			for (let i = 0; i < battle_zone.length; i++){
				const battle = battle_zone[i];
				const overlap_area =  //MIN OF 
					(Math.min(
						player.position.x + player.width, 
						battle.position.x + battle.width
					) - 
					Math.max(player.position.x, battle.position.x)) *
					(Math.min(
						player.position.y + player.height, 
						battle.position.y + battle.height) - 
					Math.max(player.position.y, battle.position.y))
				if (
					iscollide({
						user: player,
						object: battle
					}) 
					&& overlap_area > (player.width * player.height) / 2
					&& Math.random() < battle_rate
				){
					battle_activate.initiated = true;
					window.cancelAnimationFrame(animationId);
					player.moving = false;
				
					// Pass a callback to FadeInOut
					battlethingy = 1;
					FadeInOut('battle_ani', () => {
						// This will run after fade animation completes
						console.log("lmao no");
						player_animate();						
						// Start new animation loop with battle sprites
					});
				}
			}
		}

		//GO UP
		if(keys.w.pressed  && lastkey === 'w') {
			for (let i = 0; i < boundaries.length; i++){
				const boundary = boundaries[i];
				if (
					iscollide({
						user: player,
						object: {
							...boundary, 
							position: {
								x: boundary.position.x,
								y: boundary.position.y + velocity + 1
							}
						}
					})
				){
					// console.log('hi');
					moving = false;
					break;
				}
			}
			if (moving){
				moveables.forEach((movable => {
					movable.position.y += velocity
				}))
			}
		}
		//GO LEFT
		else if(keys.a.pressed  && lastkey === 'a') {
			for (let i = 0; i < boundaries.length; i++){
				const boundary = boundaries[i];
				if (
					iscollide({
						user: player,
						object: {
							...boundary, 
							position: {
								x: boundary.position.x + velocity + 1,
								y: boundary.position.y
							}
						}
					})
				){
					// console.log('hi');
					moving = false;
					break;
				}
			}
			if (moving){
				moveables.forEach((movable => {
					movable.position.x += velocity
				}))
			}
		}
		//GO DOWN
		else if(keys.s.pressed  && lastkey === 's') {
			for (let i = 0; i < boundaries.length; i++){
				const boundary = boundaries[i];
				if (
					iscollide({
						user: player,
						object: {
							...boundary, 
							position: {
								x: boundary.position.x,
								y: boundary.position.y - velocity - 1
							}
						}
					})
				){
					// console.log('hi');
					moving = false;
					break;
				}
			}
			if (moving){
				moveables.forEach((movable => {
					movable.position.y -= velocity
				}))
			}
		}
		//GO RIGHT
		else if(keys.d.pressed  && lastkey === 'd') {
			for (let i = 0; i < boundaries.length; i++){
				const boundary = boundaries[i];
				if (
					iscollide({
						user: player,
						object: {
							...boundary, 
							position: {
								x: boundary.position.x - velocity - 1,
								y: boundary.position.y
							}
						}
					})
				){
					// console.log('hi');
					moving = false;
					break;
				}
			}
			if (moving){
				moveables.forEach((movable => {
					movable.position.x -= velocity
				}))
			}
		}
	}
	// function player_animate(){
	// 	window.requestAnimationFrame(player_animate);
	// 	drawImage();
	// };
	// player_animate();

	//COMMENT Dynamic window --> fix char glitching away from said position
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      player_animate(0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

	//COMMENT Moving the player
	let lastkey = '';
	window.addEventListener('keydown', (e)=>{
		// console.log(e.keyCode);
		switch (e.key){
			case 'w':
					player.image = playerUp_img;
					keys.w.pressed = true;
					player.moving = true;
					lastkey = 'w';
					break;
				case 'a':
					player.image = playerLeft_img;
					keys.a.pressed = true;
					player.moving = true;
					lastkey = 'a';
					break;
				case 's':
					player.image = playerDown_img;
					keys.s.pressed = true;
					player.moving = true;
					lastkey = 's';
					break;	
				case 'd' :
					player.image = playerRight_img;
					keys.d.pressed = true;
					player.moving = true;
					lastkey = 'd'
					break;
				default:
					break;
		}
	})
	window.addEventListener('keyup', (e)=>{
		switch (e.key){
			case 'w':
				keys.w.pressed = false;
				player.frames.val = 0;
				player.moving = false;
				break;
			case 'a':
				keys.a.pressed = false;
				player.frames.val = 2;
				player.moving = false;
				break;
			case 's':
				keys.s.pressed = false;
				player.frames.val = 0;
				player.moving = false;
				break;	
			case 'd':
				keys.d.pressed = false;
				player.frames.val = 1;
				player.moving = false;
				break;
			default:
				break;
		}
	})

    // basic_img.onload = player_animate(); //COMMENT when bg loads----> draw everything


	function runBattleAnimation(battlebg) {
        // Battle animation loop, continues running until explicitly stopped
        if (continueBattleAnimation) {
            battleAnimationId = window.requestAnimationFrame(() => runBattleAnimation(battlebg));
            startAnimation(battlebg); // Call your AnimateBattle function here
        }
    }

    // Function to stop the battle animation manually
    function stopBattleAnimation() {
        continueBattleAnimation = false; // Stop the loop
        window.cancelAnimationFrame(battleAnimationId); // Cancel any ongoing battle animation frame
        console.log("Battle animation stopped.");
    }

    // Call this function when the player animation should start
    function startPlayerAnimation() {
        animationId = window.requestAnimationFrame(player_animate);
    }

    // Initial player animation start
    startPlayerAnimation();

	return () => {
        window.cancelAnimationFrame(animationId); // Stop player animation
        stopBattleAnimation(); // Ensure battle animation is stopped
    };
  }, []);

  return (
    <div className="App">
      <canvas></canvas>
    </div>
  );
}

export default App;
