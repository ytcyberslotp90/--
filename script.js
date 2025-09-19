const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const w=canvas.width;
const h=canvas.height;
let animation=false, t=0;


function drawFractal(time){
    const expr=document.getElementById('mathExpr').value;
    let f;
    try { f=new Function("x","y","t","sin","cos","tan","sqrt","abs","pow","return "+expr+";"); }
    catch { /*Does nothing*/; return; }

    const img=ctx.createImageData(w,h);
    const data=img.data;
    const sin=Math.sin, cos=Math.cos, tan=Math.tan, sqrt=Math.sqrt, abs=Math.abs, pow=Math.pow;

    for(let py=0; py<h; py++){
        let y=(py-h/2)/100;
        for(let px=0; px<w; px++){
            let x=(px-w/2)/100;
            let val;
            try{ val=f(x,y,time,sin,cos,tan,sqrt,abs,pow); } catch{ val=0; }
            let c=Math.floor((sin(val)+1)*127.5);
            let idx=4*(py*w+px);
            data[idx]=(c*5)%255;
            data[idx+1]=(c*9)%255;
            data[idx+2]=(c*13)%255;
            data[idx+3]=255;
        }
    }
    ctx.putImageData(img,0,0);
}

// Animation loop
function animate(){
    if(animation){
        t+=0.05;
        drawFractal(t);
        requestAnimationFrame(animate);
    }
}

// Toggle animation
function toggleAnimation(){
    animation=!animation;
    if(animation) animate();
}

// Export PNG
function exportImage(){
    const link=document.createElement('a');
    link.download='pattern.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
}

// Export GIF (optimized)
async function exportGIF(){
    const gif = new GIF({
        workers: 2, 
        quality: 20, 
        width: w, 
        height: h,
        workerScript: window.gifWorkerUrl 
    });
    const frames=15;
    let tempT=t;
    for(let i=0;i<frames;i++){
        drawFractal(tempT + i*0.2);
        gif.addFrame(ctx,{copy:true, delay:100});
    }
    gif.on('finished', function(blob){
        const url=URL.createObjectURL(blob);
        const link=document.createElement('a');
        link.href=url;
        link.download='pattern.gif';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
    gif.render();
}


drawFractal(t);