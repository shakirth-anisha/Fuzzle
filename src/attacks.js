const dialog = document.getElementById("battle_dialog");
let win_lose = document.getElementById("winlose_screen");
let win_lose_text = document.getElementById("winlose_screen_text");
let fireball_cooldown = 0;

const attacks_available = [
    {
        name: "Tackle",
        damage: 50,
        type: "Normal"
    },
    {
        name: "Fireball",
        damage: 100,
        type: "Fire"
    },
    {
        name: "Heal",
        damage: -75,
        type: "Heal"
    },
    {
        name: "Gamble",
        damage: 50,
        type: "Gamble"
    }
];


function attacks() {
    document.getElementById("attack_1").onclick = () => {
        attack({
            attacker: document.getElementById("Ember"),
            attackerHealth: document.getElementById("health_1"),
            attack: attacks_available[0],
            recipient: document.getElementById("Dragon"),
            recipientHealth: document.getElementById("health_2")
        });
    };

    document.getElementById("attack_2").onclick = () => {
        attack({
            attacker: document.getElementById("Ember"),
            attackerHealth: document.getElementById("health_1"),
            attack: attacks_available[1],
            recipient: document.getElementById("Dragon"),
            recipientHealth: document.getElementById("health_2")
        });
    };

    document.getElementById("attack_3").onclick = () => {
        attack({
            attacker: document.getElementById("Ember"),
            attackerHealth: document.getElementById("health_1"),
            attack: attacks_available[2],
            recipient: document.getElementById("Dragon"),
            recipientHealth: document.getElementById("health_2")
        });
    }
    document.getElementById("attack_4").onclick = () => {
        document.getElementById("attack_4").style.pointerEvents = "none";
        document.getElementById("attack_4").style.backgroundColor = "#111";
        attack({
            attacker: document.getElementById("Ember"),
            attackerHealth: document.getElementById("health_1"),
            attack: attacks_available[3],
            recipient: document.getElementById("Dragon"),
            recipientHealth: document.getElementById("health_2")
        });
    };
}

function attack({attacker, attackerHealth, attack, recipient, recipientHealth, isdone = false}) {
    document.getElementById("attack_options").style.pointerEvents = "none";
    let recipient_actual = recipient;
    switch (attack.name) {
        case "Tackle":
            tackle_animation(attacker, recipient, attack, recipientHealth);
            break;

        case "Fireball":
            fireball_animation(attacker, recipient, attack.damage, recipientHealth);
            break;

        case "Heal":
            attack.damage = -75;
            const heal_recipient = attacker, heal_recipientHealth = attackerHealth;
            const healImg = document.getElementById("heal_img");
            healImg.style.opacity = "1";
            healing_animation(healImg, heal_recipient);
            health_bar_animation(heal_recipientHealth, attack.damage, heal_recipient);
            recipient_actual = attacker; 
            break;
            
        case "Gamble":
            let current = Math.random()*100, maxHealthWidth = 668;
            console.log(current);
            current = 50;
            const rn_health = parseInt(attackerHealth.style.width) || maxHealthWidth;
            const rn_health_opp = parseInt(recipientHealth.style.width) || maxHealthWidth;
            if (current <= 5){
                hit_animation(recipient, recipientHealth, 0)
                tackle_animation(attacker, recipient, attack, recipientHealth);
                console.log("Tackle thingy");
            }
            else if(current > 5 && current <= 25){
                attack.damage = rn_health/2;
                hit_animation(attacker, attackerHealth, 0)
                health_bar_animation(attackerHealth, attack.damage, attacker)
                recipient_actual = attacker;
                console.log("50% damage on attacker");
            }
            else if(current > 25 && current <= 45){
                attack.damage = rn_health - 1;
                hit_animation(attacker, attackerHealth, 0)
                health_bar_animation(attackerHealth, attack.damage, attacker)
                recipient_actual = attacker;
                console.log("1hp");
            }
            else if(current > 45 && current <= 100){
                attack.damage = rn_health_opp - 1;
                health_bar_animation(recipientHealth, attack.damage, recipient)
                hit_animation(recipient, recipientHealth, 0)
                console.log("1hp enemy");
            }
            break;
            /*
            5 tackle
            25 u lose 50% health 
            20 you 1 hp 
            50 big attack
            */
    }
    dialog_animation(dialog, attacker, recipient_actual, attack);
    setTimeout(() => {
        if (parseFloat(recipientHealth.style.width) > 0){
            enemy_attack(recipient.id, recipientHealth.id, attacker.id, attackerHealth.id, isdone);
        }
    }, 3000);
    setTimeout(() => {
        if (parseFloat(attackerHealth.style.width) > 0 && parseFloat(recipientHealth.style.width) > 0 && isdone){
            document.getElementById("attack_options").style.pointerEvents = "all";
        }
    }, 3500);
}

function enemy_attack(attacker, attackerHealth, recipient, recipientHealth, done) {
    if(!done){
        const randomIndex = Math.floor(Math.random() * (attacks_available.length-1)); 
        const attack_chosen = attacks_available[randomIndex]; 
        attack({
            attacker: document.getElementById(attacker),
            attackerHealth: document.getElementById(attackerHealth),
            attack: attack_chosen,
            recipient: document.getElementById(recipient),
            recipientHealth: document.getElementById(recipientHealth),
            isdone: true
        });
    }
}


function tackle_animation(attacker, recipient, attack, recipientHealth){
    const isRecipientEmber = recipient.id === "Ember";
    const initialMove = isRecipientEmber ? 100 : -100;
    const finalMove = isRecipientEmber ? -140 : 140;
    attacker.style.transition = "transform 0.1s";
    attacker.style.transform = `translateX(${initialMove}px)`;

    setTimeout(() => {
        attacker.style.transform = `translateX(${finalMove}px)`;

        setTimeout(() => {
            attacker.style.transform = "translateX(0)";
            hit_animation(recipient, recipientHealth, attack.damage);
        }, 100);
    }, 60);
}

function fireball_animation(attacker, recipient, damage, recipientHealth) {
    const fireball = document.getElementById("fireball");
    fireball.style.opacity = "1";

    if (recipient.id === "Ember") {
        recipient.style.zIndex = "3";
        fireball.style.transform = "scale(-1, -1)"; //flips hori and verti
    } else {
        attacker.style.zIndex = "3";
        fireball.style.transform = "scale(1, 1)";
    }

    fireball.style.position = "absolute";

    const attackerRect = attacker.getBoundingClientRect();
    fireball.style.left = `${attackerRect.left + attackerRect.width - 400 / 2 - 10}px`;
    fireball.style.top = `${attackerRect.top + attackerRect.height - 150 / 2 - 10}px`;

    const recipientRect = recipient.getBoundingClientRect();
    fireball.style.transition = "left 0.5s ease-in-out, top 0.5s ease-in-out";
    fireball.style.left = `${recipientRect.left + recipientRect.width - 450 / 2 - 10}px`;
    fireball.style.top = `${recipientRect.top + recipientRect.height - 200 / 2 - 10}px`;

    let fireballImages = [];
    for (let i = 1; i <= 4; i++) {
        fireballImages.push("./Fire/fire" + i + ".png");
    }

    let imageIndex = 0;
    const changeImageInterval = setInterval(() => {
        fireball.src = fireballImages[imageIndex];
        imageIndex = (imageIndex + 1) % fireballImages.length;
    }, 100);

    setTimeout(() => {
        fireball.style.opacity = "0";

        fireball.style.transition = "none";
        fireball.style.left = `${attackerRect.left + attackerRect.width - 400 / 2 - 10}px`;
        fireball.style.top = `${attackerRect.top + attackerRect.height - 150 / 2 - 10}px`;

        clearInterval(changeImageInterval);
        fireball.src = fireballImages[0];

        if (recipient.id === "Ember") {
            recipient.style.zIndex = "2";
        } else if (attacker.id === "Ember") {
            attacker.style.zIndex = "2";
        }

    }, 500);

    setTimeout(() => {
        hit_animation(recipient, recipientHealth, damage);
    }, 500);
}

function hit_animation(recipient, recipientHealth, damage) {
    let toggle = false;
    let count = 0;
    recipient.style.transition = "transform 0.06s, opacity 0.06s";

    const interval = setInterval(() => {
        recipient.style.transform = toggle ? "translateX(60px)" : "translateX(-60px)";
        recipient.style.opacity = toggle ? "1" : "0";
        toggle = !toggle;
        count++;

        if (count >= 10) {
            clearInterval(interval);
            recipient.style.transform = "translateX(0)";
            recipient.style.opacity = "1";
            health_bar_animation(recipientHealth, damage, recipient);
        }
    }, 20);
}

function healing_animation(healImg, recipient) {
    const recipientRect = recipient.getBoundingClientRect();

    if (recipient.id === "Ember") {
        healImg.style.transform = "scale(1.5)";
        healImg.style.top = `${recipientRect.top}px`;
        healImg.style.left = `${recipientRect.left + recipientRect.width / 2 - 200}px`;
    } else {
        healImg.style.transform = "scale(1)";
        healImg.style.top = `${recipientRect.top - 100}px`;
        healImg.style.left = `${recipientRect.left + recipientRect.width / 2 - 150}px`;
    }

    healImg.style.position = "absolute";
    healImg.style.opacity = "0.75";

    let count = 0;
    const interval = setInterval(() => {
        healImg.style.opacity = count % 2 === 0 ? "0" : "0.75";
        count++;

        if (count >= 10) {
            clearInterval(interval);
            healImg.style.opacity = "0";
        }
    }, 50);
}



function health_bar_animation(healthElement, damage, recipient) {
    const currentWidth = parseInt(healthElement.style.width) || 668;
    let newWidth = currentWidth - damage; 
    if (newWidth <= 0) {
        newWidth = 0;
    }
    else if (newWidth >= 668) {
        newWidth = 668;
    }
    healthElement.style.transition = "width 0.5s";
    healthElement.style.width = newWidth + "px";

    if (newWidth === 0) {
        healthElement.style.opacity = "0";
        recipient.style.transition = "opacity 0.5s";
        recipient.style.opacity = "0";
        setTimeout(()=> {
            if (recipient.id !== "Ember"){
                win_lose_text.innerHTML = "You Win";
                win_lose.style.transition = "opacity 500ms";
                win_lose.style.opacity = "0.9";
                setTimeout(()=> {
                    document.getElementById("battle_img_html").style.opacity = 0;
                    win_lose.style.opacity = "0";
                    document.getElementById("health_1").style.width = "668px";
                    document.getElementById("health_2").style.width = "668px";
                    document.getElementById("health_2").style.backgroundColor = "#64ff8b";
                    document.getElementById("health_2").style.opacity = 1;
                    document.getElementById("Dragon").style.opacity = 1;
                    document.getElementById("attack_4").style.pointerEvents = "all";
                    document.getElementById("attack_4").style.backgroundColor = "#fff"
                    return;
                }, 2000);
            }
            else {
                win_lose_text.innerHTML = "You Lose";
                win_lose.style.transition = "opacity 500ms";
                win_lose.style.opacity = "0.9";   
                setTimeout(()=> {
                    document.getElementById("battle_img_html").style.opacity = 0;
                    win_lose.style.opacity = "0";
                    document.getElementById("health_1").style.width = "668px";
                    document.getElementById("health_2").style.width = "668px";
                    document.getElementById("health_1").style.backgroundColor = "#64ff8b";
                    document.getElementById("health_1").style.opacity = 1;
                    document.getElementById("Ember").style.opacity = 1;
                    document.getElementById("attack_4").style.pointerEvents = "all";
                    document.getElementById("attack_4").style.backgroundColor = "#fff"
                    return;
                }, 2000);            
            }
        }, 2000);
    } else if (newWidth <= 150) {
        healthElement.style.backgroundColor = "red";
    } else if (newWidth >= 150) {
        healthElement.style.backgroundColor = "#64ff8b";
    }
}

function dialog_animation(divId, attacker, recipient, attack, speed = 50) {
    let input_text = ""
    let index = 0;
    divId.style.opacity = 1;
    divId.innerHTML = ""; 
    
    const lw = attack.damage<0 ? "gained" : "lost";
    if (attack.damage<0) attack.damage -= 2*attack.damage;

    input_text = `\n${attacker.id} used ${attack.name}!\n\n\n${recipient.id} ${lw} ${attack.damage} health!`;

    function type() {
        if (index < input_text.length) {
            divId.innerHTML += input_text.charAt(index) === "\n" ? "<br>" : input_text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                divId.style.opacity = 0;
            }, 100);
        }
    }
    type();
}

export { attacks };
