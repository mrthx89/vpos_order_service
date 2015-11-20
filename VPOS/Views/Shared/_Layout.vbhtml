@Code
    ViewData("Title") = Repository.Public.NamaAplikasi
End Code

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>@ViewData("Title") - Order</title>
    <!--[if lt IE 9]>
    <script type="text/javascript" src="~/Assets/js/jquery-1.11.3.min.js"></script>
    <![endif]-->
    <!--[if gte IE 9]><!-->
    <!--[if gte IE 9]><!-->
    <script type="text/javascript" src="~/Assets/js/jquery-2.1.4.min.js"></script>
    <!--<![endif]-->
    <script type="text/javascript" src="~/Assets/js/globalize.min.js"></script>

    <script type="text/javascript" src="~/Assets/js/dx.chartjs.js"></script>
    <script type="text/javascript" src="~/Assets/js/vectormap-data/world.js"></script>
    <script type="text/javascript" src="~/Assets/js/vectormap-data/africa.js"></script>
    <script type="text/javascript" src="~/Assets/js/vectormap-data/canada.js"></script>
    <script type="text/javascript" src="~/Assets/js/vectormap-data/eurasia.js"></script>
    <script type="text/javascript" src="~/Assets/js/vectormap-data/europe.js"></script>
    <script type="text/javascript" src="~/Assets/js/vectormap-data/usa.js"></script>

    <script type="text/javascript" src="~/Assets/js/dx.module-widgets-base.js"></script>
    <script type="text/javascript" src="~/Assets/js/dx.module-widgets-web.js"></script>

    <link rel="stylesheet" type="text/css" href="~/Assets/css/reset.css" />
    <link rel="stylesheet" href="~/Assets/css/dx.common.css" />
    <link rel="stylesheet" href="~/Assets/css/dx.light.css" />
    <link rel="stylesheet" type="text/css" href="~/Assets/css/site.css" media="screen and (min-width: 740px)" />
    <!--[if lt IE 9]>
    <link rel="stylesheet" type="text/css" media="all" href="~/Assets/css/site.css"/>
    <script type="text/javascript" src="scripts/ie8html5.js"></script>
    <![endif]-->

    <link rel="stylesheet" type="text/css" href="~/Assets/css/phone.css" media="screen and (max-width: 739px)" />

    <script type="text/javascript" src="~/Assets/scripts/date.js"></script>
    <script type="text/javascript" src="~/Assets/scripts/tools.js"></script>
    <script type="text/javascript" src="~/Assets/scripts/themes.js"></script>
</head>
<body id="salesdashboard">
    <header class="dashboard-header">
        <div class="supervisor-info">
            <div class="avatar"></div>
            <div class="name">Yanto Hariyono</div>
        </div>
        <div class="dashboard-title">
            <div class="date" id="currentDate">@Now.DayOfWeek.ToString, @Now.ToString("dd MMM yy")</div>
            <h1>@ViewData("Title")</h1>
        </div>
    </header>
    <section class="dashboard-navigation">
        <ul>
            <li>
                <a href="#Home">
                    <div id="regions" class="navigation-item clear-fix">
                        <div class="icon regions"></div>
                        <div>
                            <h2>Home</h2>
                            <span>Home Page VPOS</span>
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <a href="#Product">
                    <div id="products" class="navigation-item clear-fix">
                        <div class="icon products"></div>
                        <div>
                            <h2>Product</h2>
                            <span>Find by Product</span>
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <a href="#Order">
                    <div id="channels" class="navigation-item clear-fix">
                        <div class="icon dashboard"></div>
                        <div>
                            <h2>Order</h2>
                            <span>Sales Order</span>
                        </div>
                    </div>
                </a>
            </li>
            <li class="phone-hide">
                <a href="api/vpos/getkoneksi?str=123">
                    <div id="webapi" class="navigation-item clear-fix">
                        <div class="icon geography"></div>
                        <div>
                            <h2>Web Api</h2>
                            <span>Test Koneksi Database</span>
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <a href="#Logout">
                    <div id="channels" class="navigation-item clear-fix">
                        <div class="icon Logout"></div>
                        <div>
                            <h2>Logout</h2>
                            <span>Exit System</span>
                        </div>
                    </div>
                </a>
            </li>
        </ul>
        <div class="footer-logo"></div>
    </section>

    <header class="dashboard-mobile-header tablet-hide">
        <h1>@ViewData("Title")</h1>
    </header>
    <section class="main-content">
        @RenderBody()
    </section>
</body>
</html>