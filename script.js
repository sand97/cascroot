let form = $('form'),
    input = $("#inpFile");

form.submit(function (e) {
    e.preventDefault();
    let uploader = new FileUpload(e.target, "post.php");

    if (!uploader.checkAndLoad().isOk) {
        return false
    }
    uploader.callbackProgress = function (ev) {
        let percent = (ev.loaded === 0 || ev.total === 0) ? 0 :
            Math.round(ev.loaded / ev.total * 100);
        let bar = document.querySelector("#progressBarItem");
        bar.textContent = "" + percent + "";
        bar.style.width = "" + percent + "%";
    };
    uploader.oneFileUpload = function (render) {
        let idx = document.querySelector('#number');
        idx.innerHTML = render.upload + " / " + render.total;
    };
    uploader.startUpload();

});

function FileUpload(form, destination) {
    this.inputs = form.querySelectorAll(".filesToUpload");
    this.files = [];
    this.totalSize = 0;
    this.callbackProgress = null;
    this.oneFileUpload = null;
    this.callbackError = null;
    this.render = {
        upload: 0,
        total: 0
    };
    this.destination = destination;
    /**
     * permet de vefifier que chaque input contient unfichier
     * @returns object(boolean, HTMLElement)
     */
    this.checkAndLoad = function () {
        this.files = [];
        for (let i = 0; i < this.inputs.length; i++) {
            input = this.inputs[i];
            if (input.files.length !== 1) {
                return {
                    isOk: false,
                    exception: input
                };
            }
            this.files.push(input.files[0]);
            this.totalSize += input.files[0].size;
        }
        this.render.total = this.inputs.length;
        return {
            isOk: true,
            exception: {}
        };
    };
    this.currentFileUpload = 0;
    this.startUpload = function () {
        let file = this.files[this.currentFileUpload],
            xhr = new XMLHttpRequest(),
            that = this;
        this.render.total = this.files.length;
        xhr.addEventListener("load", function () {
            if (that.currentFileUpload < that.files.length) {
                that.currentFileUpload++;
                that.render.upload++;
                that.startUpload();
                if (that.oneFileUpload !== null) {
                    return that.oneFileUpload(that.render);
                }
            }
        });
        if (that.currentFileUpload === that.files.length) {
            return false
        }

        xhr.upload.addEventListener("progress", function (ev) {
            if (that.callbackProgress !== null) {
                return that.callbackProgress(ev);
            }
        }, false);
        xhr.addEventListener("error", function (ev) {
            if (that.callbackError !== null) {
                return that.callbackError(ev)
            }
        });

        xhr.open("post", that.destination);
        xhr.setRequestHeader("content-type", "multipart/form-data");
        xhr.setRequestHeader("x-file-type", file.type);
        xhr.setRequestHeader("x-file-size", file.size);
        xhr.setRequestHeader("x-file-name", file.name);
        xhr.send(file);
    };
}