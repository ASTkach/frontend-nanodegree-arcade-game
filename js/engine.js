/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */
/*
 * Этот файл обеспечивает функциональность игрового цикла (обновление объектов
 * и рендеринг), рисует начальное игровое поле на экране, а затем вызывает методы
 * обновления и рендеринга для вашего игрока и вражеских объектов (определенных
 * в вашем app.js).
 *
 * Игровой движок работает, рисуя весь игровой экран снова и снова.
 */

var Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas element's height/width and add it to the DOM.
     */
    /* переменные, которые мы будем использовать в этой области,
     * создаем холст 2d, устанавливаем для него высоту и ширину
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    /* Эта функция служит отправной точкой для самого игрового цикла
     * и правильно обрабатывает вызов методов обновления и рендеринга.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        /* Получаем информацию о разнице во времени, которая требуется, если наша игра
          требует плавной анимации. Так как у каждого компьютера обработка
          инструкций идёт на разных скоростях, нам нужно постоянное значение, которое
          будет одинаковым для всех - ура время!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        /* Вызываем наши функции обновления/рендеринга, передаем дельту времени
          нашей функции обновления, так как ее можно использовать для плавной анимации.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        /* Устанавливаем нашу переменную lastTime, которая используется для определения
         дельты времени при следующем вызове этой функции.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        /* Используем функцию requestAnimationFrame для вызова этой функции
           снова, как только браузер сможет отрисовать другой кадр.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    /* Эта функция выполняет некоторую первоначальную настройку, которая должна
      произойти только один раз, особенно установка переменной lastTime,
      которая требуется для игрового цикла.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    /* Эта функция вызывается main (наш игровой цикл) и сама вызывает все
      функции, которые могут потребоваться для обновления данных. Основываясь на том,
      как вы реализуете обнаружение столкновений (когда два объекта занимают
      том же месте, например, когда ваш персонаж должен умереть), вы можете найти
      необходимость добавить сюда дополнительный вызов функции. На данный момент
      она закомментирована - мы можем, если захотим вызвать эту функциональность таким
      образом (или можем просто реализовать обнаружение столкновений на самих объектах
      в app.js).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    /* Это функция обновления, которая перебирает все
      объекты в вашем массиве allEnemies, как определено в app.js и вызывает
      их методы update(). Затем он вызовет функцию обновления для вашего
      объект игрока. Эти методы обновления должны быть сосредоточены исключительно
      на обновлени данные/свойства, связанные с объектом. Сделайте свой рисунок
      в вашем методы рендеринга.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    /* Эта функция сначала отрисовывает «уровень игры», затем вызывается
      функция renderEntities. Помните, что эта функция вызывается каждый
      игровой тик (или цикл игрового движка), потому что так работают игры -
      это флипбуки, создающие иллюзию анимации, но на самом деле
      они просто рисуют весь экран снова и снова.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        /* Этот массив содержит URL, которые используются
         для конкретной строки игрового уровня.
         */
        var rowImages = [
                "images/water-block.png", // Top row is water
                "images/stone-block.png", // Row 1 of 3 of stone
                "images/stone-block.png", // Row 2 of 3 of stone
                "images/stone-block.png", // Row 3 of 3 of stone
                "images/grass-block.png", // Row 1 of 2 of grass
                "images/grass-block.png", // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row,
            col;

        // Before drawing, clear existing canvas
        // Перед рисованием очищаем существующий холст
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        /* Цикл по количеству строк и столбцов, которые мы определили выше
         и, используя массив rowImages, рисуем правильное изображение для этой
         части "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                /* Функция drawImage элемента контекста холста
                 требует 3 параметра: изображение для рисования, координаты x
                 и y, чтобы начать рисовать.
                 Мы используем помощников ресурсов для обращения к нашим изображениям.
                 так что мы получаем преимущества кэширования этих изображений, так как
                 мы используем их снова и снова.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    /* Эта функция вызывается функцией рендеринга(отрисовки) и вызывается на каждом такте игры. 
      Его цель состоит в том, чтобы затем вызвать функции рендеринга, которые вы 
      определили для объектов противника и игрока в app.js.      
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        /* Перебираем все объекты в массиве allEnemies и вызываем определенную
         вами функцию рендеринга(отрисовки).
         */
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    /* Эта функция ничего не делает, но она могла бы быть хорошим местом для
     обработки состояния сброса игры — может быть, новое игровое меню или экран
      завершения игры и тому подобное. Он вызывается только один раз методом init().
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    /* Идем дальше и загружаем все изображения, которые, как мы знаем, нам
     понадобятся для отрисовки игрового уровня. Затем установите init в качестве
      метода обратного вызова, чтобы, когда все эти изображения правильно загрузятся,
       наша игра запустилась.
     */
    Resources.load(["images/stone-block.png", "images/water-block.png", "images/grass-block.png", "images/enemy-bug.png", "images/char-boy.png"]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    /* Назначьте объект контекста холста глобальной переменной (объект окна при
         запуске в браузере), чтобы разработчикам было проще использовать его из
          своих файлов app.js.
     */
    global.ctx = ctx;
})(this);
