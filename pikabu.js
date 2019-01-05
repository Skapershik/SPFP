let ScriptSettings = {};
LoadSettings();


/*
   00 Post Page
   01 Add Post page
   02 Wrap page
   03 Settings page
*/
function PAGETYPE() {
    if (document.URL.indexOf("pikabu.ru/story/") != -1) return 0;
    else if (document.URL.indexOf("pikabu.ru/add") != -1) return 1;
    else if (document.URL.indexOf("pikabu.ru/settings") != -1) return 3;
    else return 2;
    return -1;
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});


}

function Menu() {
    console.log("Loading...");
    if (ScriptSettings.Yukari) Yukari();
    switch (PAGETYPE()) {
        case 0:
            if (ScriptSettings.EasyTags) document.addEventListener("mouseover", updateTags);
            if (ScriptSettings.CallModerator) document.addEventListener("mouseover", addCallButton);
            break;
        case 1:
            window.onload = function () {
                if (ScriptSettings.IQDB) addDanbooruLinker();
document.onmouseover = function () {
    var files = document.getElementsByClassName("story-editor-block__content")
    for (var i = 0; i<files.length; i++){
        if(files[i].firstChild.src===undefined){
            files[i].onclick = function(){
                getIQDB(dataURItoBlob(this.firstChild.toDataURL()))
            }
        }
        else {
            files[i].onclick = function() {
                getIQDB("https://danbooru.iqdb.org/?url="+this.firstChild.src);
            }
        }
        files[i].style.cursor = 'pointer'
    }
    // if (ScriptSettings.IQDB) getIQDB(dataURItoBlob(files[0].firstChild.toDataURL()));

}


                $(function () {
                    $(".my-spoiler").resizable({
                        stop: function (event, ui) {
                            var id = ui.element[0].parentNode.children[0].id
                            localStorage["Height" + id] = ui.element[0].style.height;
                            localStorage["Width" + id] = ui.element[0].style.width;
                        }
                    });
                    $(".linker").draggable({
                        handle: ".linker-header",
                        stop: function (event, ui) {
                            var id = ui.helper[0].getElementsByClassName("linker-header")[0].id
                            localStorage["Y" + id] = ui.helper[0].style.top;
                            localStorage["X" + id] = ui.helper[0].style.left;
                        },
                        containment: "body",
                        scroll: false
                    });
                });
            };

            break;
        case 2:
            if (ScriptSettings.EasyTags) document.addEventListener("mouseover", updateTags);
            break;
        case 3:
            break;

    }
    chrome.storage.local.get("NewVersion", function (result) {
        if (result["NewVersion"]) {
            var changelog = document.createElement("div")
            changelog.id = "changelog"
            changelog.innerHTML = '' +
                '<div class="my-overlay"></div>' +
                '<div class="my-visible">' +
                '<h3>CHANGELOG 21.07.2018</h3>' +
                '<div class="my-content">' +
                '<p>Изменен Danbooru Linker:</p>' +
                '<p>-Теперь для наглядности теги разделяются по категориям, как на Danbooru</p>' +
            '<p>-Убрана возможность автоматических запросов: теперь, чтобы отправить картинку на IQDB необходимо кликнуть на нее или нажать на кнопку "Запросить теги" </p>' +
                '<p>-Добавил проверку на результат поиска: если IQDB не найдет совпадений, скрипт не будет брать теги из первого возможного варианта</p>' +
                '<p>Не баг, а фича: Из-за особеностей сайта, если в конструкторе поста нажать "Сохранить черновик", а затем перезагрузить страницу, то запросы на IQDB пройдут гораздо быстрее :D</p>' +
                '<p>-Из-за того, что это расширение весьма узкоспециализированно, подержжка видеозаписей в комментариях вырезана в отдельное <a href="https://chrome.google.com/webstore/detail/pikabu-video-in-comments/ngfmlllhjdmcnilpdhlfadgjjgbpedia?hl=ru">расширение</a></p>' +
                '<p>Карманная Юкари: Теперь выглядывающую Юкари можно перемещать по странице и изменять ее размер (Special for RecurringMemory)</p>' +
                '<p>Если у вас есть вопросы или предложения, ' +
                'то вы можете связаться со мной:<a href="https://pikabu.ru/@skinner56">Пикабу</a>, <a href="https://vk.com/id91201488">ВК</a></p>' +
                '</div>' +
                '<h3>CHANGELOG 05.06.2018</h3>' +
                '<div class="my-content">' +
                'Последние обновления Пикабу неплохо так поломали расширение, Pixiv Linker и Danbooru Linker пали смертью храбрых, поэтому пришлось немного позаниматься некромантией ' +
                '<p>-Из-за технических сложностей временно (скорее всего навсегда) убран генератор ссылок на pixiv</p>' +
                '<p>-Реанимирован Danbooru Linker</p>' +
                '<p>-Добавлена возможность ручного ввода ссылок на Danbooru</p>' +
                '<p>-Исправлен баг, когда Danbooru Linker возвращал в источнике "протухшую" ссылку на pixiv</p>' +
                '<p>-Мелкие исправления</p>' +
                'Напоминаю, что для правильной работы Danbooru Linker`а, необходимо использовать прокси.' +
                '</div>' +
                '<h3>CHANGELOG 26.04.2018</h3>' +
                '<div class="my-content">' +
                '<p>-Мелкие исправления</p>' +
                '<p>-Добавлена возможность изменять размер окон</p>' +
                '</div>' +
                '<h3>CHANGELOG 24.04.2018</h3>' +
                '<div class="my-content">' +
                '<p>-HotFix. Исправлен конфликт стилей, который ломал часть функционала сайта</p>' +
                '<p>-Добавлена поддержка Coub</p>' +
                '</div>' +
                '<h3>CHANGELOG 23.04.2018</h3>' +
                '<div class="my-content">' +
                '<p>-Обновлено модальное окно changelog</p>' +
                '<p>-Добавлены таблицы стилей расширения</p>' +
                '<p>-Обновленён дизайн окон</p>' +
                '<p>-Теперь загнать окна в недоступные участки стало ещё сложнее</p>' +
                '<p>-Обновлен механизм сохранения настроек</p>' +
                '<p>-Добавлена куча ошибок и багов</p>' +
                'Наслаждайтесь' +
                '</div>' +
                '<button type="button">Закрыть</button>' +
                '</div>'
            document.body.appendChild(changelog)
            document.getElementById("changelog").getElementsByTagName('button')[0].onclick = function () {
                document.getElementById("changelog").remove();
                chrome.storage.local.set({"NewVersion": false});
            }
            document.getElementsByClassName("my-overlay")[0].onclick = function () {
                document.getElementById("changelog").remove();
                chrome.storage.local.set({"NewVersion": false});
            }
        }

    });


}


//Поиск уникальных значений в массиве
function unique(arr) {
    var obj = {};

    for (var i = 0; i < arr.length; i++) {

        var str = arr[i];
        try {
            str = str[0].toUpperCase() + str.slice(1);
        } catch (e) {
            console.log(e);
            console.image(chrome.extension.getURL('images/Error.png'));
        }

        obj[str] = true; // запомнить строку в виде свойства объект

    }

    return Object.keys(obj);
}

//---------------------------------------DanbooruLinker-----------------------------------------------------------

function addDanbooruLinker() {
    var x_danbooru = localStorage["XDanbooruLinker"];
    var y_danbooru = localStorage["YDanbooruLinker"];
    var height = localStorage["HeightDanbooruLinker"];
    var width = localStorage["WidthDanbooruLinker"];
    if (x_danbooru == undefined) {
        x_danbooru = "10px";
        y_danbooru = "290px";
    }
    if (height == undefined) {
        height = 0;
        width = "220px";
    }
    var danboorulinker = document.createElement("div");
    danboorulinker.className = "linker"
    danboorulinker.style =
        "    left:" + x_danbooru + ";\n" +
        "    top:" + y_danbooru + ";"

    danboorulinker.innerHTML =
        ' <div class="container">\n' +
        '        <div id="DanbooruLinker" class="linker-header">\n' +
        '            <div class="panel-name">Danbooru</div>\n' +
        '            <div class="settings-panel">\n' +
        '                <button title="Свернуть" class="hide_button">_</button>\n' +
        '                <button title="Закрыть" class="close_button">x</button>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="my-spoiler" style="width:' + width + '; height:' + height + ';">\n' +
        '            <div class="linker-item my-link">\n' +
        '                <span id="URL" class="item">URL:</span>\n' +
        '                <input type="url" id="DanbooruUrl" class="item">\n' +
        '            </div>\n' +
        '            <div class="linker-item my-link">\n' +
        '                <span class="item">Источник:</span>\n' +
        '                <a id="Source" class="item"></a>\n' +
        '            </div>\n' +
        '            <div class="linker-item">\n' +
        '                <span class="item">Copyrights:</span>\n' +
        '                <div contenteditable id="Copyrights" class="item"></div>\n' +
        '            </div>\n' +
        '            <div class="linker-item">\n' +
        '                <span class="item">Characters:</span>\n' +
        '                <div contenteditable id="Characters" class="item"></div>\n' +
        '            </div>\n' +
        '            <div class="linker-item">\n' +
        '                <span class="item">Artists:</span>\n' +
        '                <div contenteditable id="Artists" class="item"></div>\n' +
        '            </div>\n' +
        '            <div class="linker-item">\n' +
        '                <div contenteditable id="FinTags" class="item"></div>\n' +
        '            </div>\n' +
        '            <div class="linker-item">\n' +
        '                <button id="UpdateTagsB" class="item">Обновить теги</button>\n' +
        '            </div>\n' +
        '            <div class="linker-item">\n' +
        '                <button id="getTags" class="item">Запросить теги</button>\n' +
        '            </div>\n' +
        '            <div class="linker-item">\n' +
        '                <span class="item">Статус:</span>\n' +
        '                <div id="ScriptStatus" class="item">Готово</div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>'
    document.body.appendChild(danboorulinker);
    document.getElementById("DanbooruUrl").addEventListener("change", getInfoFromDanbooru);
    for (var i = 0; i < document.getElementsByClassName("hide_button").length; i++) {
        document.getElementsByClassName("hide_button")[i].onclick = function () {
            displayBlock(this);
        }
        document.getElementsByClassName("close_button")[i].onclick = function () {
            removeBlock(this);
        }
    }

    document.getElementById("UpdateTagsB").addEventListener("click", createFinalTag);
    document.getElementById("getTags").onclick = function () {
        var files = document.getElementsByClassName("story-editor-block__content")
        for (var i = 0; i < files.length; i++) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].firstChild.src === undefined) {
                    getIQDB(dataURItoBlob(files[i].firstChild.toDataURL()))
                }
                else {
                    getIQDB("https://danbooru.iqdb.org/?url=" + files[i].firstChild.src);
                }

            }
        }
    }
}


function getDoc(File) {
    return new Promise(function (resolve, reject) {
        if (typeof(File) == "object") {
            var _data = new FormData();
            _data.append("url", "");
            _data.append("file", File, File.name);
            _data.append("MAX_FILE_SIZE", '8388608');
            document.getElementById("ScriptStatus").textContent = "Отправляем файл на IQDB...";

            $.ajax({
                type: 'POST',
                url: 'https://danbooru.iqdb.org', // Обработчик собственно
                processData: false,
                contentType: false,
                data: _data,
                success: function (data) {
                    var doc = new DOMParser().parseFromString(data, "text/html");
                    // запустится при успешном выполнении запроса и в data будет ответ скрипта
                    resolve(doc);
                },
                error: function () {

                }
            });


        } else {
            $.ajax({
                type: "get",
                url: File,
                anonymous: true,
                success: function (response) {
                    if (File.indexOf(".json") == -1) {
                        var doc = new DOMParser().parseFromString(response, "text/html");
                        resolve(doc);
                    } else {
                        try {
                            resolve(response);
                        } catch (e) {
                            console.log(e);
                            console.image(chrome.extension.getURL('images/Error.png'));
                        }
                    }

                },
                error: function (response) {
                    document.getElementById("ScriptStatus").textContent = "Ошибка запроса!";
                }
            });
        }
    });


}


function getIQDB(img) {
    document.getElementById("ScriptStatus").textContent = "Делаем запрос на IQDB...";
    getDoc(img).then(
        result => {
            getIQDB2(result);
            if(result.getElementsByTagName('th')[1].textContent=="No relevant matches"){
                document.getElementById("ScriptStatus").textContent = "Совпадений не найдено"
            }
            else{
                var danboorupost = result.getElementsByClassName("image")[1].getElementsByTagName("a")[0].href;
                document.getElementById("ScriptStatus").textContent = "Ответ получен! Есть возможные совпадения";
                document.getElementById("DanbooruUrl").value = danboorupost;
                //document.getElementById("DanbooruUrl").href = danboorupost
                getInfoFromDanbooru();
            }


        },
        error =>
            document.getElementById("ScriptStatus").textContent = error
    )
    ;
}

function getIQDB2(result) {
    var x_iqdb = localStorage["XIQDB"];
    var y_iqdb = localStorage["YIQDB"];
    var height = localStorage["HeightIQDB"];
    var width = localStorage["WidthIQDB"];
    if (x_iqdb == undefined) {
        x_iqdb = "85px";
        y_iqdb = "20px";
    }
    if (height == undefined) {
        height = "400px";
        width = "220px";
    }
    var danbooruform = result.getElementById("pages");
    var iqdb = document.createElement("div");
    iqdb.className = "linker iqdb"
    for (var i = 0; i < danbooruform.getElementsByTagName("img").length; i++) {
        danbooruform.getElementsByTagName("img")[i].src = "https://danbooru.iqdb.org/" + danbooruform.getElementsByTagName("img")[i].src.replace("https://pikabu.ru/", "");
    }
    iqdb.style = "top:" + y_iqdb + "; left:" + x_iqdb + ";"
    iqdb.innerHTML =
        '    <div class="container">\n' +
        '        <div class="linker-header iqdb" id="IQDB">\n' +
        '            <div class="panel-name">IQDB</div>\n' +
        '            <div class="settings-panel">\n' +
        '                <button title="Свернуть" class="hide_button">_</button>\n' +
        '                <button title="Закрыть" class="close_button">x</button>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '       <div class="my-spoiler" style="width:' + width + '; height:' + height + ';">\n' +
        '            \n' + danbooruform.innerHTML +
        '        </div>\n' +
        '    </div>\n' +
        '</div>'

    document.body.appendChild(iqdb);
    $(function () {
        $(".my-spoiler").resizable({
            stop: function (event, ui) {
                var id = ui.element[0].parentNode.children[0].id
                localStorage["Height" + id] = ui.element[0].style.height;
                localStorage["Width" + id] = ui.element[0].style.width;
            }
        });
        $(".linker").draggable({
            handle: ".linker-header",
            stop: function (event, ui) {
                var id = ui.helper[0].getElementsByClassName("linker-header")[0].id
                localStorage["Y" + id] = ui.helper[0].style.top;
                localStorage["X" + id] = ui.helper[0].style.left;
            },
            containment: "body",
            scroll: false
        });
    });
    for (var j = 0; j < document.getElementsByClassName("hide_button").length; j++) {
        document.getElementsByClassName("hide_button")[j].onclick = function () {
            displayBlock(this);
        }
        document.getElementsByClassName("close_button")[j].onclick = function () {
            removeBlock(this);
        }
    }


}

function getInfoFromDanbooru() {
    document.getElementById("FinTags").value = "";
    var tags = ""
    document.getElementById("ScriptStatus").textContent = "Делаем запрос на Danbooru...";
    getDoc(document.getElementById("DanbooruUrl").value + ".json").then(
        doc => {
            document.getElementById("ScriptStatus").textContent = "Ответ получен! Формируем теги...";
            var coptags = doc.tag_string_copyright.split(/\s/ig);
            var chartags = doc.tag_string_character.split(/\s/ig);
            var artist = doc.tag_string_artist;
            coptags = UpperCaseCharacters(coptags).join()
            chartags = UpperCaseCharacters(chartags).join()
           // artist = UpperCaseCharacters(artist).join()
            console.log(coptags);
            console.log(chartags);
            console.log(artist);
            var info = doc.source;
            tags = tags.concat(coptags + " ", chartags + " ", artist+" ");
            if (info.indexOf("pixiv") != -1 || info.indexOf("pximg") != -1) {
                var source = info.split(/\//ig)
                document.getElementById("Source").textContent = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + parseInt(source[source.length - 1]);
                document.getElementById("Source").href = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + parseInt(source[source.length - 1]);
            } else {
                document.getElementById("Source").textContent = info;
                document.getElementById("Source").href = info;
            }
            tags = tags.replace(/\s/ig, ',').replace(/\_/ig, " ") + ",";
            document.getElementById('Copyrights').textContent = coptags.replace(/\s/ig, ',').replace(/\_/ig, " ") + ",";
            document.getElementById('Characters').textContent = chartags.replace(/\s/ig, ',').replace(/\_/ig, " ") + ",";
            document.getElementById('Artists').textContent = artist.replace(/\_/ig, " ") + ",";
            createFinalTag(tags);
            document.getElementById("ScriptStatus").textContent = "Готово!";
        },
        error =>
            document.getElementById("ScriptStatus").textContent = error
    )
    ;


}

function UpperCaseCharacters(arr) {
    for (var i = 0; i < arr.length; i++) {
        var temp = arr[i].split(/\_/ig);
        var firstname = temp[0][0].toUpperCase() + temp[0].slice(1);
        var secondname = temp[temp.length - 1][0].toUpperCase() + temp[temp.length - 1].slice(1);
        temp[0] = firstname;
        temp[temp.length - 1] = secondname;
        arr[i] = temp.join("_");
    }
    return arr;
}

function createFinalTag(danTags) {
    var tags = document.getElementById("FinTags").textContent + communityTags() + danTags;
    document.getElementById("FinTags").textContent = unique(tags.split(","));

}

function communityTags() {
    try {
        var tags = document.getElementsByClassName("community__tags tags")[0].getElementsByClassName("tags__tag");
        var stringtags = "";
        if (tags.length >= 1) {
            for (var i = 0; i < tags.length; i++) {
                stringtags = stringtags + tags[i].textContent + ",";
            }
        }
        return stringtags;
    } catch (e) {
        return "";
    }
}

//--------------------------------------------EasyTags------------------------------------------------------------------
function updateTags() {

    var tags = document.getElementsByClassName('tags__tag');
    for (var j = 0; j < tags.length; j++) {
        if (tags[j].href.indexOf("/search?n=32&r=3") == -1) {
            if (tags[j].textContent.indexOf(",") == -1) {
                tags[j].textContent = tags[j].textContent + ",";

            }
        }
    }
}

function addCallButton() {
    try {

        var reply = document.getElementsByClassName('comment-reply__controls');
        for (var j = 0; j < reply.length; j++) {
            var but = reply[j].getElementsByClassName('comment-reply__attach-files attach butmod');
            if (but.length < 1) {
                var li = document.createElement('li');
                li.innerHTML = '<div class="comment-reply__attach-files attach butmod" title="Призвать администрацию"><span class="user__label hint" data-type="moderators-team"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon--ui__moderator"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon--ui__moderator"></use></svg></span></div>';
                reply[j].appendChild(li);
                but[0].onclick = function (ev) {
                    callModerators(this);
                };
            }
        }


    }
    catch (e) {
        console.log(e);
        console.image(chrome.extension.getURL('images/Error.png'));
    }
}

function callModerators(button) {
    var comment = button.offsetParent.getElementsByClassName('input__box')[0].children[0].children[0];
    var commentbody = button.offsetParent.getElementsByClassName('input__input medium-editor-element medium-editor-placeholder')[0];
    var stringMod = '';
    try {
        var moderators = document.getElementsByClassName('community-info-block__content')[3].getElementsByClassName('user__nick');
        for (var i = 0; i < moderators.length; i++) {
            if (i == 4) {
                stringMod = stringMod + '@' + moderators[i].textContent.trim();
                break;
            }
            stringMod = stringMod + '@' + moderators[i].textContent.trim() + ', ';
        }
        comment.textContent = comment.textContent + stringMod;
        commentbody.className = 'input__input medium-editor-element';
    }
    catch (e) {
        comment.textContent = comment.textContent + '@moderator';
        commentbody.className = 'input__input medium-editor-element';

    }


}


function LoadSettings() {
        ApplyStyles()
    chrome.storage.local.get("Settings", function (result) {
        ScriptSettings = result["Settings"];
        console.image(chrome.extension.getURL('images/Loading.png'));
        Menu();

    });

}


function getBox(width, height) {
    return {
        string: "+",
        style: "font-size: 1px; padding: " + Math.floor(height / 2) + "px " + Math.floor(width / 2) + "px; "
    };
}

console.image = function (url, scale) {
    scale = scale || 1;
    var img = new Image();

    img.onload = function () {
        var dim = getBox(this.width * scale, this.height * scale);
        console.log("%c" + dim.string, dim.style + "background: url(" + url + "); background-size: " + (this.width * scale) + "px " + (this.height * scale) + "px; color: transparent;");
    };

    img.src = url;
};


function Yukari() {
    window.onload = function () {
        var HeightYukari = 566
        var WidthYukari = 150
        if(localStorage["HeightYukari"]!==undefined){
            HeightYukari = localStorage["HeightYukari"];
            WidthYukari = localStorage["WidthYukari"];
        }
        var XYukari = "94%";
        var YYukari = "0";
        if(localStorage["YYukari"]!==undefined){
            XYukari = localStorage["XYukari"];
            YYukari = localStorage["YYukari"];
        }
        var yukari = document.createElement("div");
        yukari.innerHTML = '<div id = "Yukari" style="left:'+XYukari+'; top: '+YYukari+'"><a class="image"><img id = "Yukari2" alt="Yukari gap.png" src="' + chrome.extension.getURL('images/Yukari_gap.png') + '" width="'+WidthYukari+'" height="'+HeightYukari+'"></a></div>'
        document.body.appendChild(yukari);
        $(function () {
            $("#Yukari2").resizable({
                stop: function (event, ui) {
                   localStorage["HeightYukari"] = ui.element[0].style.height;
                   localStorage["WidthYukari"] = ui.element[0].style.width;
                }
            });
            $("#Yukari").draggable({
                stop: function (event, ui) {
                   localStorage["YYukari"] = ui.helper[0].style.top;
                   localStorage["XYukari"] = ui.helper[0].style.left;
                },
                containment: "body",
                scroll: false
            });
        });
    }
}

function ApplyStyles() {
    var style = document.createElement("link")
    style.type = "text/css"
    style.rel = "stylesheet"
    style.href = chrome.extension.getURL('css/jquery-ui.min.css')
    document.head.appendChild(style)
    style = document.createElement("link")
    style.type = "text/css"
    style.rel = "stylesheet"
    style.href = chrome.extension.getURL('css/main-css.css')
    document.head.appendChild(style)


}

function displayBlock(elem) {
    var display = elem.parentNode.parentNode.parentNode.getElementsByClassName("my-spoiler")[0].style.display
    if (display == "none") {
        display = "block"
    } else {
        display = "none"
    }
    elem.parentNode.parentNode.parentNode.getElementsByClassName("my-spoiler")[0].style.display = display
}

function removeBlock(elem) {
    var display = elem.parentNode.parentNode.parentNode.parentNode
    display.style.display = "none"
}