class Stars {
    constructor() {
        this.myName = "NaN";
        this.myDistance = 0;
        this.myLuminosity = 0;
        this.myRadius = 0;
        this.myTemperature = 0;
        this.mySpectralClass = "NaN";
        //this.myEinheitRadius = "Nan";
        this.myX = 0;
        this.myY = 0;
        this.myZ = 0;
        this.myColor;
        this.mySize = 0; // Ensure mySize is defined
        this.hover = false;
    }

    display() {

        push();
        translate(this.myX, this.myY, this.myZ);
        noStroke();
        fill(this.myColor);
        sphere(this.myRadius);
        pop();

    }
}// end of class

//:)