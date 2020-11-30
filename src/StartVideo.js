import React, { useEffect } from 'react';
import * as faceapi from "face-api.js";
import scriptLoader from 'react-async-script-loader';
import "./StartVideo.css";



function start() {
    const video = document.getElementById('video');
    //console.log(video);
    navigator.getUserMedia({
        video: true,
    },
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}


export const StartVideo = () => {

    //const [loading,setLoading]=useState(true);

    useEffect(() => {

        // const script = document.createElement('script');
        // script.src = "face-api.js";
        // script.async = true;
        // script.defer = true;
        // console.log(script);
        // document.body.appendChild(script);
        const video = document.getElementById('video');
        //console.log(video);

        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),

        ]).then(start);


        video.addEventListener('play', () => {

            const canvas = faceapi.createCanvasFromMedia(video);
            document.getElementById('face_canvas').append(canvas);
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
                //console.log(detections);

                const resizeDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizeDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
                faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
            }, 100);
        })



    }, []);



    return (
        <div className="startVideo" id="startV">
            <div>Face Expressions</div>
            <video autoPlay={true} muted={true} id="video" width="720" height="560"></video>
            <div id='face_canvas'></div>

        </div>
    );
}