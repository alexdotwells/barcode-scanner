(function () {
    var _scannerIsRunning = false;

    function startScanner() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#scanner-container'),
                constraints: {
                    width: 480,
                    height: 320,
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: [
                    "code_128_reader"
                ],
                debug: {
                    showCanvas: true,
                    showPatches: true,
                    showFoundPatches: true,
                    showSkeleton: true,
                    showLabels: true,
                    showPatchLabels: true,
                    showRemainingPatchLabels: true,
                    boxFromPatches: {
                        showTransformed: true,
                        showTransformedBox: true,
                        showBB: true
                    }
                }
            },

        }, function (err) {
            if (err) {
                console.log(err);
                return
            }

            console.log("Initialization finished. Ready to start");
            Quagga.start();

            // Set flag to is running
            _scannerIsRunning = true;
        });

        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });

        // On barcode detected
        Quagga.onDetected(function (result) {
            console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);

            document.getElementById("btnBarcode").click();
            //document.querySelector('[id*='Input5_Textbox1']').value = result.codeResult.code;
            document.querySelector("[id*='txtBarcode']").value = result.codeResult.code;
            //document.getElementById("txtBarcode").value = result.codeResult.code;
        });
    }


    // Start/stop scanner
    document.getElementById("btnBarcode").addEventListener("click", function () {
        if (_scannerIsRunning) {
            Quagga.stop();
            document.getElementById("btnBarcode").value = 'Start';
        } else {
            startScanner();
            document.getElementById("btnBarcode").value = 'Stop';
        }
    }, false);

})();
