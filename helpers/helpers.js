const spawn = require('child_process').spawn,
    cmd = '/usr/bin/ffmpeg',
    request = require('request'),
    express = require('express');


// const local = (fileName,stream_key) =>  [
//     '-re', '-i', 'http://127.0.0.1:3000/uploads/'+fileName, 
//     '-c:v', 'libx264', '-preset', 
//     'veryfast','-tune', 'zerolatency', '-c:a', 'aac',
//      '-ar', '44100', 
//      '-f', 'flv', 'rtmp://live.faithtofaithtv.org/show/'+stream_key
// ]

const local = (fileName,stream_key) =>  [
    '-re',
    '-y',
    '-i', 'http://127.0.0.1:3000/uploads/'+fileName,
    '-c:a', 'copy', '-ac', '1','-ar',
    '44100', '-b:a','96k','-vcodec','libx264','-tune',
    'zerolatency','-f', 'flv', '-maxrate', '2000k', '-preset', 'veryfast',
    'rtmp://live.faithtofaithtv.org/show/'+stream_key
]


const facebook = (fileName,stream_key) =>  [
    '-re',
    '-y',
    '-i', 'http://127.0.0.1:3000/uploads/'+fileName,
    '-c:a', 'copy', '-ac', '1','-ar',
    '44100', '-b:a','96k','-vcodec','libx264','-tune',
    'zerolatency','-f', 'flv', '-maxrate', '2000k', '-preset', 'veryfast',
    'rtmps://live-api-s.facebook.com:443/rtmp/'+stream_key
]


// const facebookrtmps = (stream_key) =>  [
//     '-i', 'https://live.faithtofaithtv.org/hls/9QvShKjWC.m3u8',
//     '-c:a', 'copy', '-ac', '1','-ar',
//     '44100', '-b:a','96k','-vcodec','libx264','-tune',
//     'zerolatency','-f', 'flv', '-maxrate', '2000k', '-preset', 'veryfast',
//     'rtmps://live-api-s.facebook.com:443/rtmp/'+stream_key
// ]

const facebookrtmps = (stream_key) =>  [
    '-re','-i', 'https://live.faithtofaithtv.org/hls/9QvShKjWC.m3u8',
    '-acodec', 'libmp3lame', '-ar', '44100', '-b:a', '128k', '-pix_fmt', 'yuv420p', 
   '-profile:v', 'baseline', '-s', '426x240', '-bufsize', '6000k', '-vb', '400k', 
   '-maxrate', '1500k', '-deinterlace', '-vcodec', 'libx264', '-preset', 
    'veryfast', '-g', '30', '-r', '30', '-f', 'flv', 'rtmps://live-api-s.facebook.com:443/rtmp/'+stream_key
]

const youtube = (fileName,stream_key) =>  [
    '-re', '-i', 'http://127.0.0.1:3000/uploads/'+fileName,
    '-c:v', 'libx264', '-preset', 
    'veryfast', '-tune', 'zerolatency', '-b:v',
    '500k', '-c:a', 'copy',
    '-strict', '-2', '-flags', '+global_header', '-bsf:a', 
    'aac_adtstoasc', '-bufsize', '500k', '-f', 'flv', 'rtmp://a.rtmp.youtube.com/live2/'+stream_key
]


// const twitter = (fileName,stream_key) =>  [
//     '-re',
//     '-f', 'lavfi',
//     '-i', 'http://127.0.0.1:3000/uploads/'+fileName,
//     '-c:v', 'libx264', '-preset', 'ultrafast', '-r', '30', '-g', '60', '-b:v', '1500k',
//     '-c:a', 'aac', '-threads', '6', '-ar', '44100', '-b:a', '128k', '-bufsize', '512k', '-pix_fmt', 'yuv420p',
//     '-f', 'rtmp://va.pscp.tv:80/x/'+stream_key
// ]

const twitter = (fileName,stream_key) =>  [
    '-re', '-i', 'http://127.0.0.1:3000/uploads/'+fileName,
    '-c:v', 'libx264', '-pix_fmt',
    'yuv420p','-s','960x540', '-preset', 'superfast', '-r', '30', '-g', '60',
     '-bufsize', '8000k', '-c:a', 'aac', '-b:a', '96k', '-ar', '44100', '-ac', '2', 
     '-f', 'flv', 'rtmp://va.pscp.tv:80/x/'+stream_key
]



const startStreaming = (live_stream,streamingKey) => {
    const ffmpeg_process = spawn(cmd, local(live_stream.video.video, streamingKey),{detached: true});
    localpid = ffmpeg_process.pid

    ffmpeg_process.stdout.on('data', (data) => {
       
        console.log(`stdout: ${data}`);
    });
    
    ffmpeg_process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    }); 
    
    ffmpeg_process.on('close', (code) => {
        console.log(`Local process exited with code ${code}`);
    });

    if(live_stream.youtube){
        const ffmpeg_process_yt = spawn(cmd, youtube(live_stream.video.video,live_stream.youtube),{detached: true});
        youtubepid = ffmpeg_process_yt.pid

        ffmpeg_process_yt.stdout.on('data', (data) => {
           
            console.log(`stdout: ${data}`);
        });
        
        ffmpeg_process_yt.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ffmpeg_process_yt.on('close', (code) => {
            console.log(`youtube process exited with code ${code}`);
        });
    }

    if(live_stream.facebook){
        const ffmpeg_process_fb = spawn(cmd, facebook(live_stream.video.video,live_stream.facebook),{detached: true});
        facebookpid = ffmpeg_process_fb.pid
        
        ffmpeg_process_fb.stdout.on('data', (data) => {
          
            console.log(`stdout: ${data}`);
        });
        
        ffmpeg_process_fb.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ffmpeg_process_fb.on('close', (code) => {
            console.log(`facebook process exited with code ${code}`);
        });
    }

    if(live_stream.twitter){
        const ffmpeg_process_tw = spawn(cmd, twitter(live_stream.video.video,live_stream.twitter),{detached: true});
        twitterpid = ffmpeg_process_tw.pid
        
        ffmpeg_process_tw.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        
        ffmpeg_process_tw.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ffmpeg_process_tw.on('close', (code) => {
            console.log(`twitter process exited with code ${code}`);
        });
    }

};

const fbRtmp = (streamingKey) => {
    const ffmpeg_process_fbRtmp = spawn(cmd, facebookrtmps(streamingKey),{detached: true});
    localpid = ffmpeg_process_fbRtmp.pid

    ffmpeg_process_fbRtmp.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    ffmpeg_process_fbRtmp.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    }); 
    
    ffmpeg_process_fbRtmp.on('close', (code) => {
        console.log(`Local process exited with code ${code}`);
    });
};

module.exports = {
    startStreaming : startStreaming,
    fbRtmp
};



// # This file is managed by man:systemd-resolved(8). Do not edit.
// #
// # This is a dynamic resolv.conf file for connecting local clients to the
// # internal DNS stub resolver of systemd-resolved. This file lists all
// # configured search domains.
// #
// # Run "systemd-resolve --status" to see details about the uplink DNS servers
// # currently in use.
// #
// # Third party programs must not access this file directly, but only through the
// # symlink at /etc/resolv.conf. To manage man:resolv.conf(5) in a different way,
// # replace this symlink by a static file or a different symlink.
// #
// # See man:systemd-resolved.service(8) for details about the supported modes of
// # operation for /etc/resolv.conf.

// nameserver 127.0.0.53
// options edns0