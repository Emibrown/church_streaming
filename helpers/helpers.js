const spawn = require('child_process').spawn,
    cmd = '/usr/bin/ffmpeg';


const local = (fileName,stream_key) =>  [
    '-re', '-I',
    'http://127.0.0.1:3000/uploads/'+fileName, 
    '-vcodec', 'copy', '-loop', '-1', '-c:a', 'aac', 
    '-b:a', '160k', '-ar', '44100', 
    '-strict', '-2', '-f', 'flv', 'rtmp://159.65.236.148/show/'+stream_key
]

const facebook = (fileName,stream_key) =>  [
    '-re',
    '-y',
    '-i', 'http://127.0.0.1:3000/uploads/'+fileName,
    '-c:a', 'copy', '-ac', '1','-ar',
    '44100', '-b:a','96k','-vcodec','libx264','-pix_fmt','yuv420p',
    '-vf','scale=1080:-1','-r', '30', '-g', '60','-tune',
    'zerolatency','-f', 'flv', '-maxrate', '2000k', '-preset', 'veryfast',
    '"rtmps://live-api-s.facebook.com:443/rtmp/'+stream_key+'"',
]

const youtube = (fileName,stream_key) =>  [
    '-re', '-i', 'http://127.0.0.1:3000/uploads/'+fileName,
    '-c:v', 'libx264', '-b:v',
    '2M', '-c:a', 'copy',
    '-strict', '-2', '-flags', '+global_header', '-bsf:a', 
    'aac_adtstoasc', '-bufsize', '2100k', '-f', 'flv', 'rtmp://a.rtmp.youtube.com/live2/'+stream_key
]



const startStreaming = (live_stream) => {
    spawn(cmd, local(live_stream.video,live_stream.streamKey), {
        detached: true,
        stdio: 'ignore'
    }).unref();
};

module.exports = {
    startStreaming : startStreaming
};

