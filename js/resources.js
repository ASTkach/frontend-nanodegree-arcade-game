/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
// Утилита загрузки изображений. Облегчает процесс загрузки файлов изображений,
// чтобы их можно было использовать в нашей игре.
(function () {
    var resourceCache = {};
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    // Это общедоступная функция загрузки изображений. Принимает массив строк
    // для файлов с изображениями или строку для одного изображение.
    function load(urlOrArr) {
        if (urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            // Если разработчик передал массив изображений
            // перебираем каждое значение и вызываем наше изображение
            urlOrArr.forEach(function (url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            // если массив не передан, то вызываем наше изображение напрямую
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    // Это наша приватная функция загрузки изображений
    // она вызывается общедоступной функцией загрузки изображений
    function _load(url) {
        if (resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather than
             * re-loading the image.
             */
            // Если этот URL был ранее загружен, он будет существовать в пределах
            // нашего массива resourceCache. Просто возвращаем изображение,
            // а не повторно его загружаем
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            // Иначе загружаем, если он до этого не был загружен
            var img = new Image();
            img.onload = function () {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                // Добавляем изображение в кеш, как только загрузили
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if (isReady()) {
                    readyCallbacks.forEach(function (func) {
                        func();
                    });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            // изначальное значение кешуа будетfalse
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    // Используется для получения изображений, который были загружены ранее
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    // Проверяет, все ли запрошенные изображения были загружены должны образом
    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    // Эта функция добавит в стек обратного вызова функцию, которая вызывается
    //  когда все запрошенные изображения правильно загружены.
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    // Этот объект определяет общедоступные функции, доступные для
    //  разработчиков, создав глобальный объект Resources.
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady,
    };
})();
