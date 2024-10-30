import {attacks} from './attacks'

function FadeInOut(element, fun, times = 3) {
    const cycleDelay = 20;        
    const fadeTime = 1000;        
    const displayTime = 500;      
    const cycleDuration = cycleDelay + (fadeTime * 2) + displayTime;
    const totalDuration = cycleDuration * times;

    const el = document.getElementById(element);
    
    if (!el) {
        console.error(`Element with ID ${element} not found.`);
        return;
    }

    // Ensure the element starts hidden
    el.style.opacity = 0;
    el.style.display = 'block';

    // Recursive function to handle the fade in and out
    function fadeCycle(count) {
        if (count === 0) {
            el.style.display = 'none'; // Hide the element after the final fade-out
            return;
        }
        
        // Fade in
        setTimeout(() => {
            let enemies = ["Dragon", "Axolotl", "Reptile", "Dino", "Racoon"];
            let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
            let enemy = [], ember = [];
            for (let i=1; i<=4; i++){
                enemy.push(`Enemy/${randomEnemy}/enemy_${randomEnemy}${i}.png`)
                ember.push("Ember/player_Ember"+i+".png")
            }
            document.getElementById("enemy_name_health_bar").innerHTML = randomEnemy;
            let index = 0
        
            setInterval(() => {
                index = (index + 1) % enemy.length;
                document.getElementById("Dragon").src = enemy[index];
                document.getElementById("Ember").src = ember[index];
            }, 100);
            el.style.transition = `opacity ${fadeTime}ms`;
            el.style.opacity = 1; //fading in

            setTimeout(() => {
                if (count === 1){
                    document.getElementById("battle_img_html").style.opacity = 1;
                    document.getElementById("attack_options").style.pointerEvents = "all";
                    attacks();
                    // let go_back = setInterval(()=>{
                    //     if(document.getElementById("battle_img_html").opacity == 0){
                    //         fun();
                    //         clearInterval(go_back);
                    //     }
                    // }, 1000, 100000)
                }
                el.style.opacity = 0; //fading out

                el.addEventListener('transitionend', () => {
                    fadeCycle(count - 1);
                }, { once: true });

            }, displayTime); //before fading out
        }, cycleDelay); //before starting to fade in
        console.log("fades away");
    }

    fadeCycle(times); // Start the fade cycle
    return totalDuration;
}
export {FadeInOut};