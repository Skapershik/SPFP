$(document).ready(main_function());
let iqdb_url = 'http://danbooru.iqdb.org/?url=';
let min_similarity = 80;
/*
   00 Post Page
   01 Add Post page
   02 Wrap page
*/
function page_type() {
    if (location.href.includes("pikabu.ru/story/")) return 0;
    else if (location.href.includes("pikabu.ru/add")) return 1;
    else return 2;
    return -1;
}

function main_function() {
    console.log("Loading...");
    switch (page_type()) {
        case 0:
            break;
        case 1:
            $(tags_helper_template()).insertAfter('.story-editor__blocks')
            break;
        case 2:
            break;
    }
    events_controller(page_type());
}

function events_controller(page) {
    if (page == 1) {
        $('#art_get_danbooru').on('click', function (ev) {
            let url = $('#art_danbooru_url').val();
            console.log(url);
            chrome.runtime.sendMessage(JSON.stringify({'type': 'get', 'url': url}), function (response) {
                if(response.toString().includes('Error')){
                    window.alert('SPFP: Ошибка запроса на Danbooru. Проверьте доступность сайта или попробуйте включить proxy/vpn')
                    return
                }
                if (response.source != undefined) {
                    $('#art_source').show();
                    let name = Object.keys(link_handler(response.source))[0]
                    let href = link_handler(response.source)[name]
                    $('<a>', {href: href, text: name}).appendTo('#art_source');
                }
                if (response.tag_string_copyright != undefined) {
                    $('#art_copyrights').show();
                    let copyright_arr = response.tag_string_copyright.split(' ');
                    for (var i = 0; i < copyright_arr.length; i++) {
                        $('<span>', {
                            class: 'tag',
                            text: copyright_arr[i].replace(/\_/ig, " ")
                        }).appendTo('#art_copyrights');
                    }
                }
                if (response.tag_string_artist != undefined) {
                    $('#art_artists').show();
                    let artists_arr = response.tag_string_artist.split(' ');
                    for (var i = 0; i < artists_arr.length; i++) {
                        $('<span>', {class: 'tag', text: artists_arr[i].replace(/\_/ig, " ")}).appendTo('#art_artists');
                    }
                }
                if (response.tag_string_character != undefined) {
                    $('#art_characters').show();
                    let characters_arr = upper_case_names(response.tag_string_character.split(' '));
                    for (var i = 0; i < characters_arr.length; i++) {
                        $('<span>', {
                            class: 'tag',
                            text: characters_arr[i].replace(/\_/ig, " ")
                        }).appendTo('#art_characters');
                    }
                }
                $('#art_tags_helper .tag').on('click', function (ev) {
                    $('[data-role = "tags"] [type = "text"]').focus()
                    $('[data-role = "tags"] [type = "text"]').val(this.textContent)
                    $('[data-role = "tags"] [type = "text"]').blur()
                })
                $('#art_main_panel').addClass('input');
                duplicate_remover('#art_tags_helper .tag');
                duplicate_remover('#art_tags_helper a');
            })
        })
        $('#art_tags_helper i').on('mouseover', function () {
            $('#art_help').show(1000)
        })
        $('#art_tags_helper i').on('mouseout', function () {
            $('#art_help').hide(1000)
        })
        dynamic_content_controller()
    }

}

function dynamic_content_controller() {
    $('label:contains(" Опубликовать в сообществе")').off('click')
    $('.story-editor-block__content img').off('click')
    $('.story-editor-block__content canvas').off('click')
    $('input[type="file"]').off('change')
        let interval_comm_tags = setInterval(function () {
            if ($('.community__tags.tags')[0] == undefined) return;
            clearInterval(interval_comm_tags)
            $('.tags__tag').on('click', function (ev) {
                $('[data-role = "tags"] [type = "text"]').focus()
                $('[data-role = "tags"] [type = "text"]').val(this.textContent)
                $('[data-role = "tags"] [type = "text"]').blur()
            })
            $('.tags__tag').clone(true).appendTo('#art_community_tags')
            duplicate_remover('#art_community_tags .tags__tag')
            $('#art_community_tags').show()
            $('label:contains(" Опубликовать в сообществе")').on('click', function () {
                $(".community__tags.tags").remove();
                $('#art_community_tags').hide()
                $("#art_community_tags .tags__tag").remove()
                dynamic_content_controller()
            })
        }, 1000)
    let interval_post = setInterval(function () {
        if ($('.story-editor-block__content')[0] == undefined) return;
        clearInterval(interval_post)
        $('.story-editor-block__content img').css({'cursor':'pointer'}).attr('title', 'Нажмите для поиска изображения в IQDB').on('click', function () {
            chrome.runtime.sendMessage(JSON.stringify({'type' : 'get', 'url' : iqdb_url+this.src}), function (response) {
                process_iqdb_response(new DOMParser().parseFromString(response, "text/html"))
            })
        })
        $('.story-editor-block__content canvas').css({'cursor':'pointer'}).attr('title', 'Нажмите для поиска изображения в IQDB').on('click', function () {
            chrome.runtime.sendMessage(JSON.stringify({'type' : 'post', 'url' : iqdb_url, 'data':{'img':this.toDataURL("image/png")}}), function (response) {
                if(response.includes('Error! File too large')){
                    window.alert(`SPFP: Ошибка! Изображение больше 8192 KB`)
                }else{
                    process_iqdb_response(new DOMParser().parseFromString(response, "text/html"))
                }
            })
        })
        $('input[type="file"]').on('change', dynamic_content_controller)
    }, 1000)

}

//Избавляемся от дубликатов
function duplicate_remover(selector) {
    let tag_text = '',
        tag_list = $(selector),
        list_for_remove = [];
    $(tag_list).each(function () {
        let text = $(this).text();
        if(selector.includes('#art_tags_helper a')){
           text = $(this).attr('href');
        }
        if (tag_text.indexOf('|' + text + '|') == -1)
            tag_text += '|' + text + '|';
        else
            list_for_remove.push($(this));
    })
    $(list_for_remove).each(function () {
        $(this).remove();
    });
}

function process_iqdb_response(response){
    let href = $(response).find('th:contains("Best match")').parents('table').find('a').attr('href')
    let similarity = parseInt($(response).find('th:contains("Best match")').parents('table').find('td:contains("similarity")').text())
    if(href!=undefined && similarity>min_similarity){
$('#art_danbooru_url').val('https:'+href);
$('#art_get_danbooru').click()
    }else {
        if(href==undefined){
            window.alert(`SPFP: Арт не найден :(`)
        }
        else if(similarity<min_similarity){
            window.alert(`SPFP: Процент сходства найденного арта слишком низкий:${similarity}%`)
        }
    }
}

//Делаем Имя и Фамилию с большой буквы, передаем массив персонажей
function upper_case_names(arr) {
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

function link_handler(url) {
    let complete_link = {}
    if (url.includes("pixiv") || url.includes("pximg")) {
        let source = url.split(/\//ig)
        complete_link['Pixiv'] = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + parseInt(source[source.length - 1]);
    } else if (url.includes("twitter")) {
        complete_link['Twitter'] = url;
    } else {
        complete_link[url.split(/\//ig)[2]] = url;
    }
    return complete_link
}

function tags_helper_template() {
    return `<div class="section-group" id="art_tags_helper">
    <section>
        <p>
            <label>Tags Helper</label>
            <i class="fa fa-question-circle" aria-hidden="true" style="cursor:pointer"></i>
        </p>
        <p class="story-editor__meta-hint" id="art_help" style="display:none">
            Это окно создано расширением SPFP<br>
            Для использования введите ссылку на Danbooru и нажмите "Сделать запрос"<br>
            Или нажмите на необходимое изображение, чтобы отправить его на IQDB<br>
            В случае успешного запроса расширение создаст конструктор тегов.<br>
            Чтобы выбрать тег - нажмите на него.            
        </p>
        <p>
            <section class="input input_section input_tags">
                <div class="input__box">
                    <input class="input__input input__input_carriage" id="art_danbooru_url" type="text"
                           placeholder="Введите ссылку на Danbooru"
                           style="width: 100%;position: relative;left: 0px;">
                </div>
            </section>
            <div class="collapse-button collapse-button_active" id="art_get_danbooru" style="width:auto;text-align: center;margin-left: 0px; margin-top: 10px" >
            Сделать запрос
        </div>
        <div id="art_main_panel" style="display: block">
        </p>
        <p id="art_source" style="display:none">
            <label>Источник:</label>
        </p>
        <p id="art_copyrights" style="display:none">
            <label>Авторские права:</label>          
        </p>
        <p id="art_artists" style="display:none">
        <label>Художники:</label>
        </p>
        <p id="art_characters" style="display:none">
        <label>Персонажи:</label>
        </p>
        <p id="art_community_tags" style="display:none">
        <label>Теги сообщества:</label>
        </p>
        <section class="input input_section input_tags"style="margin-top: 0px; display:none">
            <div class="input__box" id="art_tags">
                <!--<span class="tag">Touhou</span>-->
            </div>
        </section>
        <div class="collapse-button collapse-button_active" style="width: auto;text-align: center; display:none" >
            Показать результат поиска IQDB
        </div>
        <p id="art_iqdb"></p>
        <p></p>
        </div>
    </section>
</div>`
}


/*function getInfoFromDanbooru() {
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
}*/





