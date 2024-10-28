import {attacks} from './attacks'
let continueAnimation = true; 

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
            el.style.transition = `opacity ${fadeTime}ms`;
            el.style.opacity = 1; //fading in

            setTimeout(() => {
                if (count === 1){
                    document.getElementById("battle_img_html").style.opacity = 1;
                    document.getElementById("attack_options").style.pointerEvents = "all";
                    attacks();
                }
                el.style.opacity = 0; //fading out

                el.addEventListener('transitionend', () => {
                    fadeCycle(count - 1);
                }, { once: true });

            }, displayTime); //before fading out
        }, cycleDelay); //before starting to fade in
        console.log("fades away");
        fun();
    }

    fadeCycle(times); // Start the fade cycle
    return totalDuration;
}


function AnimateBattle(battlebg) {
    if (continueAnimation) {
        window.requestAnimationFrame(() => AnimateBattle(battlebg));
        // console.log("its working");
        document.getElementById("battle_ani").style.opacity = 1;
        document.getElementById("battle_img_html").src = battlebg;
    }
}

// Call this function when you want to stop the animation
function stopAnimation() {
    document.getElementById("battle_img_html").style.opacity = 0;
    continueAnimation = false;
}

// Call this function to start the animation
function startAnimation(battlebg) {
    document.getElementById("battle_img_html").style.opacity = 1;
    continueAnimation = true;
    AnimateBattle(battlebg);
}

function Continue_Battle(dragon, ember){
    dragon.draw();
    ember.draw();
}

export { FadeInOut, AnimateBattle, startAnimation, stopAnimation, Continue_Battle };