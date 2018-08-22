(function Clock(configObj){

    // Predefined global vars
    var CANVAS_HEIGHT_HALF, CANVAS_WIDTH_HALF, 
        ARC_WIDTH, ARC_GAP, ARC_MAX_RADIUS, 
        TIME_TEXT_FONT;

    var guessSize = function(){
        return Math.min(window.innerWidth, window.innerHeight);
    };

    /**
     * Re-calculate all size-related vars
     */
    var syncSize = function(){
        canvas.width = canvas.height = guessSize();

        // Re-calculate constant vars
        CANVAS_WIDTH_HALF = canvas.width / 2;
        CANVAS_HEIGHT_HALF = canvas.height / 2;

        ARC_WIDTH = canvas.height / 10;
        ARC_GAP = ARC_WIDTH + 5;
        ARC_MAX_RADIUS = CANVAS_HEIGHT_HALF - ARC_WIDTH;

        TIME_TEXT_FONT = 'bold ' + (canvas.height * 0.044 | 0).toString() + 'px "Free Serif" serif';

    };

    var config = configObj || {'id': null, 'container': 'body'};
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.id = config.id;
    
    syncSize();
    document.querySelector(config.container).appendChild(canvas);

    /**
     * Styles
     */
    var SECOND_STYLE = 'rgba(50, 152, 191, 1)',
        MINUTE_STYLE = 'rgba(57, 160, 24, 1)',
        HOUR_STYLE = 'rgba(191, 50, 112, 1)',
        TIME_TEXT_STYLE = 'rgba(0, 0, 0, .6)',
        BG_STYLE = 'rgba(0, 0, 0, .4)';

    /**
     * Zero start angle
     */
    var ZERO_START = - 0.5 * Math.PI,
        ZERO = - 0.5;

    /**
     * Time object
     */
    var time = null;

    /**
     * Interval id
     */
    var intervalId = null;

    /**
     * Draw function
     * clear rect
     * calculate time object
     * draw arcs
     */
    var draw = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        var timer = new Date();
        var hour = timer.getHours(),
            minute = timer.getMinutes(),
            second = timer.getSeconds();
        var pm = (hour >= 12)?(true):(false);
        hour = (hour > 12)?(hour - 12):(hour);
        time = {
            'hour': hour,
            'minute': minute,
            'second': second,
            'pm': pm
        };
        drawTime();
    };

    /**
     * Draw Arcs
     */
    var drawTime = function(){
        /**
         * Common styles set up
         */
        context.shadowBlur = ARC_WIDTH;

        /**
         * Draw background arcs
         */
        context.lineWidth = 2;
        context.beginPath();
        context.shadowColor = BG_STYLE;
        context.strokeStyle = BG_STYLE;
        context.arc(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF, ARC_MAX_RADIUS, ZERO_START, 2 * Math.PI);
        context.stroke();
        context.beginPath();
        context.arc(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF,  ARC_MAX_RADIUS - ARC_GAP, ZERO_START, 2 * Math.PI);
        context.stroke();
        context.beginPath();
        context.arc(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF, ARC_MAX_RADIUS - ARC_GAP - ARC_GAP, ZERO_START, 2 * Math.PI);
        context.stroke();

        /**
         * Draw second arc
         */
        drawArc((time.second / 30 - 0.5) * Math.PI, ARC_MAX_RADIUS, ARC_WIDTH, SECOND_STYLE);

        /**
         * Draw minute arc
         */
        drawArc((time.minute / 30 + time.second / 1800 - 0.5) * Math.PI, ARC_MAX_RADIUS - ARC_GAP, ARC_WIDTH, MINUTE_STYLE);

        /**
         * Draw hour arc
         */
        var hourReal = (time.hour == 12)?(0):(time.hour);
        drawArc((hourReal / 6 + time.minute / 360 + time.second / 21600 - 0.5) * Math.PI, ARC_MAX_RADIUS - ARC_GAP - ARC_GAP, ARC_WIDTH, HOUR_STYLE);

        /**
         * Draw time text
         */
        context.fillStyle = TIME_TEXT_STYLE;
        context.shadowColor = TIME_TEXT_STYLE;
        context.font = TIME_TEXT_FONT;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        var hour = (time.pm && time.hour > 12)?(time.hour + 12):((time.hour < 10)?('0' + time.hour):(time.hour)),
            minute = (time.minute == 60)?('00'):((time.minute < 10)?('0' + time.minute):(time.minute)),
            pmText = (time.pm)?('PM'):('AM');
            timeText = hour + ':' + minute + '\n' + pmText;
        context.fillText(timeText, CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF);
    };

    var drawArc = function(endAngel, radius, lineWidth, style){
        context.lineWidth = lineWidth;
        context.beginPath();
        context.arc(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF, radius, ZERO_START, endAngel);
        context.shadowColor = style;
        context.strokeStyle = style;
        context.stroke();
    };

    var init = function(){
        // Always follw the window's size
        window.onresize = function(){
            syncSize();
        };
        intervalId = setInterval(draw, 500);
    };

    init();

})({'id': 'cclock', 'container': 'body'});