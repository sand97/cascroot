<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>test</title>
</head>

<body>
    
        <form action="index.php" enctype="multipart/form-data" method="get">
            <input id="inpFile" type="file" name="test">
            <input type="submit" name="test" id="envoyer" value="envoyer">
        </form>

        <script src="jquery.min.js"></script>
        <script>
            var formatData = new FormData(),
                form = $('form'),
                input = $("#inpFile");

            form.submit(function(e) {
                e.preventDefault();
                var file = input[0].files[0];
                var xhr = new XMLHttpRequest();
                xhr.open("post", "post.php");
                xhr.setRequestHeader("content-type", "multipart/form-data");
                xhr.setRequestHeader("x-file-type", file.type);
                xhr.setRequestHeader("x-file-size", file.size);
                xhr.setRequestHeader("x-file-name", file.name);
                xhr.send(file);

            })

        </script>
</body>

</html>
