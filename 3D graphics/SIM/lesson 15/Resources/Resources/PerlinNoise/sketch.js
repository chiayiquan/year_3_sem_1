function setup() {
    let c = createCanvas(1000, 1000);
    drawPerlinNoise();
    saveCanvas(c,"perlin_noise","png");
}

function drawPerlinNoise() {

    var scale=200;
    for(var x=0;x<width;x++){
        for(var y=0;y<height;y++){
            var pnv = noise(x/scale,y/scale);
            c = map(pnv,0,1,0,255);
            set(x,y,c);
        }
    }
    updatePixels();
}
