import { color } from "three/webgpu";

//making a constructor to animate bg to give illusion of movement
class Sprite{
        constructor({position, image, frames = {max: 1}, c, moving}){
                this.position = position;
                this.image = image;
                this.frames = frames;
                this.frames = {...frames, val:0, elapsed: 0};
                this.c = c;
				this.color = color;
				this.moving = moving
                this.image.onload = () => {
                    this.width = this.image.width / this.frames.max;
                    this.height = this.image.height;
                }
        }
        draw(){
            this.c.drawImage(
                this.image,
                this.frames.val * 48, //({0,1,2,3} * 48)
                0,
                this.image.width / this.frames.max, //player width ---> how much to crop width
                this.image.height, //player height ---> how much to crop height
                this.position.x,
                this.position.y,
                this.image.width / this.frames.max,
                this.image.height
            )
	        if (!this.moving) return
            if(this.frames.max > 1) this.frames.elapsed++;
            if(this.frames.elapsed % 10 === 0){
                if(this.frames.val < this.frames.max - 1) this.frames.val++;
                else this.frames.val = 0;
            }
    }
}

class Boundary{
    static width = 48;
    static height = 48;
    constructor({position, c, color}){
            this.position = position;
            this.c = c
            this.color = color
            this.width = 48;
            this.height = 48;
    }
    draw(){
            // c.fillStyle = 'red';
            this.c.fillStyle = this.color
            this.c.fillRect(
                    this.position.x,
                    this.position.y, 
                    this.width, 
                    this.height
            );		
    }
}

export { Sprite, Boundary };