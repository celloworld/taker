
var eventTimer = 0;
var sessionData = [];
var ring, dot, eventDoc, doc, body, pageX, pageY;
var cursorPosition = [0,0];

window.onload = function() {
    handleKeyPress();
    handleClick();
    // console.log(userID);
    document.onmousemove = handleMouseMove;
    setInterval( function() {
        if(eventTimer % 1 == 0 && sessionData.length > 0){
            $.post("http://localhost:3000/save",
                JSON.stringify(sessionData),
                function(data) {
                    if(data === 'done') {
                        console.log("ajax success");
                        sessionData = [];
                    }
                });
            }
    }, 1000);

}


function handleMouseMove(event) {



    event = event || window.event; // IE-ism

    // IfpageX/Y aren't available and clientX/Y
    // are, calculate pageX/Y - logic taken from jQuery
        // Calculate pageX/Y ifmissing and clientX/Y available
    if(event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX = event.clientX +
        (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
        (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
        (doc && doc.clientTop  || body && body.clientTop  || 0);
    }

    // create 1px divs to show where the cursor has been
    dot = document.createElement('div');
    dot.className = "dot";
    dot.style.left = event.pageX + "px";
    dot.style.top = event.pageY + "px";
    $(document.body.appendChild(dot)).fadeOut(4000, function(){$(this).remove()});

    cursorPosition = [event.pageX, event.pageY];

    sessionData.push({
        "completionTime": moment().toString(),
        "eventType": "cursor-move",
        "coordinates": cursorPosition
    });
}


function handleKeyPress(){
    //TODO: log where the dom focus is while they type

    document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        console.log(`Key pressed ${keyName}`);

        sessionData.push({
            "completionTime": moment().toString(),
            "eventType": "keydown",
            "keyPressed": keyName
        });
    }, false);
}

function handleClick() {
    
    document.addEventListener("mousedown", (event) => {
        ring = document.createElement('div');
        ring.className = "ring";
        ring.style.left = cursorPosition[0] + "px";
        ring.style.top = cursorPosition[1] + "px";
        $(document.body.appendChild(ring)).fadeOut(4000, function(){$(this).remove()});

        sessionData.push({
            "completionTime": moment().toString(),
            "eventType": "mousedown",
            "coordinates": cursorPosition,
            "targetElement": event.target
        });
    }, false); //first

    // document.addEventListener("mouseup", (event)=>{}, false); //second
    // document.addEventListener("click", (event)=>{}, false); // third
}