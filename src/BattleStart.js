import { attacks } from './attacks';

function FadeInOut(element, fun, times = 1) {
    const cycleDelay = 20;        
    const fadeTime = 1000;        
    const displayTime = 500;      
    const cycleDuration = cycleDelay + (fadeTime * 2) + displayTime;
    const totalDuration = cycleDuration * times;

    const el = document.getElementById(element);
    const battleImgHtml = document.getElementById("battle_img_html");
    const attackOptions = document.getElementById("attack_options");
    const enemyNameHealthBar = document.getElementById("enemy_name_health_bar");
    const enemyImg = document.getElementById("Dragon");
    const emberImg = document.getElementById("Ember");
    
    if (!el || !battleImgHtml || !attackOptions || !enemyNameHealthBar || !enemyImg || !emberImg) {
        console.error("One or more elements not found.");
        return;
    }

    // Start with hidden element
    el.style.opacity = 0;
    el.style.display = 'block';

    function fadeCycle(count) {
        if (count === 0) {
            el.style.display = 'none';
            return;
        }
        
        setTimeout(() => {
            
            el.style.transition = `opacity ${fadeTime}ms`;
            el.style.opacity = 1; // Fade in

            setTimeout(() => {
                if (count === 1) {
                    battleImgHtml.style.opacity = 1;
                    attackOptions.style.pointerEvents = "all";
                    attacks();

                    // Monitor opacity change to 0
                    const checkBattleImgOpacity = setInterval(() => {
                        if (parseFloat(getComputedStyle(battleImgHtml).opacity) === 0) {
                            clearInterval(checkBattleImgOpacity);
                            attackOptions.style.pointerEvents = "none";
                            fun(); // Call the callback to enable player movement
                            //Add in sprites
                            let enemy = [], ember = [];
                            let enemies = ["Dragon", "Axolotl", "Reptile", "Dino", "Racoon"];
                            let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
                            for (let i = 1; i <= 4; i++) {
                                enemy.push(`Enemy/${randomEnemy}/enemy_${randomEnemy}${i}.png`);
                                ember.push(`Ember/player_Ember${i}.png`);
                            }
                            console.log(enemy);
                            enemyNameHealthBar.innerHTML = randomEnemy
                            let index = 0;
                            setInterval(() => {
                                index = (index + 1) % enemy.length;
                                enemyImg.src = enemy[index];
                                emberImg.src = ember[index];
                            }, 100);
                        }
                    }, 100);
                }
                el.style.opacity = 0; // Fade out

                el.addEventListener('transitionend', () => {
                    fadeCycle(count - 1);
                }, { once: true });

            }, displayTime);
        }, cycleDelay);
    }

    fadeCycle(times);
    return totalDuration;
}

export { FadeInOut };
