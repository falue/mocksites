<!DOCTYPE html>
<head>
    <?php
    $email = file_get_contents("tools/email.txt");
    ?>
    <meta charset="utf-8">
    
    <title>Google</title>
    <link href="tools/favicon.ico" rel="shortcut icon">
    <link rel="stylesheet" href="tools/stylesheet.css">
    <script src="tools/script.js"></script>
   
</head>


<?
    $queue = isset($_GET["q"]) ? "onload=\"swapmenu(); search('".$_GET["q"]."');\"" : "";
?>
<body <? echo $queue; ?>>
    
    <header>
        <a href="#" id="nav_gmail">Gmail</a>
        <a href="#" id="nav_images">Images</a>
        <a href="#" title="Google apps"><img src="tools/g_apps.png" class="apps" alt=""></a>&emsp;
        <a href="#" title="0 Google notifications"><div class="notific">&nbsp;</div></a>&emsp;&emsp;
        <a href="#" title="Google account: <? echo $email; ?>"><div class="user">&nbsp;</div></a>
    </header>
    
    
    
    
    <article id="main" class="home">           
        <div class="main_logo" id="main_logo">
            <img src="tools/logo_big.png" alt="">
            <div class="country">Switzerland</div>
        </div>
        <img src="tools/logo_small.png" alt="" class="logo_small" id="logo_small" onclick="window.location.href='index.php';"> 
        <input id="search" class="search" type="text" onkeydown="swapmenu();" onkeyup="prompt(this.value);" value="<? echo $_GET["q"]; ?>" onclick="prompt(this.value);" autofocus><div id="search_button" class="search_button" onclick="search(document.getElementById('search').value);">&nbsp;</div>
        <br>
        <div id="homebuttons">
            <input type="button" class="main_button" value="Google Search" onclick="swapmenu(); search(document.getElementById('search').value);">
            <input type="button" class="main_button" value="I'm Feeling Lucky" onclick="swapmenu(); search(document.getElementById('search').value);">
            <br><br>
            Google.ch offered in: <a href="#">Deutsch</a> <a href="#">Fran&ccedil;ais</a> <a href="#">Italiano</a> <a href="#">Rumantsch</a>
        </div>
    </article>
    
    <div id="prompt" class="prompt"></div>
    
    <div class="queue" id="queue">
        <div class="nav" id="nav">
            <div class="nav_chosen">All</div>
            <div>Videos</div>
            <div>Images</div>
            <div>Shopping</div>
            <div>News</div>
            <div>More &#9662;</div>
            <div>Search tools</div>
            <img src="tools/buttons.png" class="nav_buttons" alt="">
        </div>
        <div class="results" id="results"></div>
        
        <footer class="result_footer">
                <a href="#">&copy; Zürich - From your search history</a><a href="#">Use precise location</a><a href="#">Learn more</a><br>
                <a href="#">Help</a><a href="#">Send feedback</a><a href="#">Privacy</a><a href="#">Terms</a>
        </footer>
    </div>
    
    
    
    <footer id="main_footer">
        <div class="left">
            <a href="#">Advertising</a>
            <a href="#">Business</a>
            <a href="#">About</a>
        </div>&nbsp;
        <div class="right">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Settings</a>
        </div>
    </footer>
</body>
</html>