const spawn = require('child_process').spawn,
    cmd = '/usr/bin/ffmpeg';


const local = (fileName,stream_key) =>  [
    '-re', '-i', 'http://127.0.0.1:3000/uploads/'+fileName, 
    '-c:v', 'libx264', '-preset', 
    'veryfast','-tune', 'zerolatency', '-c:a', 'aac',
     '-ar', '44100', 
     '-f', 'flv', 'rtmp://159.65.236.148/show/'+stream_key

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
    const ffmpeg_process = spawn(cmd, local(live_stream.video,live_stream.streamKey));

    ffmpeg_process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    ffmpeg_process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    ffmpeg_process.on('close', (code) => {
        console.log(`Local process exited with code ${code}`);
    });

    if(live_stream.facebookStreamKey){
        const ffmpeg_process_fb = spawn(cmd, facebook(live_stream.video,live_stream.facebookStreamKey));

        ffmpeg_process_fb.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        
        ffmpeg_process_fb.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ffmpeg_process_fb.on('close', (code) => {
            console.log(`FB process exited with code ${code}`);
        });
    }
};

module.exports = {
    startStreaming : startStreaming
};

