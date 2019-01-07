$(document).ready(main_function());

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
    events_controller();
}

function events_controller() {
    $('#art_get_danbooru').on('click', function (ev) {
        let url = $('#art_danbooru_url').val();
        console.log(url);
        chrome.runtime.sendMessage(JSON.stringify({'type': 'get', 'url': url}), function (response) {
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
    //Нужно изменить, не нравится мне как это выглядит
    if ($('.tags__tag')[0] != undefined) {
        $('.tags__tag').on('click', function (ev) {
            $('[data-role = "tags"] [type = "text"]').focus()
            $('[data-role = "tags"] [type = "text"]').val(this.textContent)
            $('[data-role = "tags"] [type = "text"]').blur()
        })
        $('.tags__tag').clone(true).appendTo('#art_community_tags')
        duplicate_remover('#art_tags_helper .tags__tag')
        $('#art_community_tags').show()
    } else {
        $(document).on('click', function () {
            $('.tags__tag').on('click', function (ev) {
                $('[data-role = "tags"] [type = "text"]').focus()
                $('[data-role = "tags"] [type = "text"]').val(this.textContent)
                $('[data-role = "tags"] [type = "text"]').blur()
            })
            $('.tags__tag').clone(true).appendTo('#art_community_tags')
            if ($('#art_tags_helper .tags__tag').length > 0) {
                duplicate_remover('#art_tags_helper .tags__tag')
                $('#art_community_tags').show()
            }
        })
    }

}

//Избавляемся от дубликатов
function duplicate_remover(selector, mode) {
    let tag_text = '',
        tag_list = $(selector),
        list_for_remove = [];
    $(tag_list).each(function () {
        let text = $(this).text();
        if (tag_text.indexOf('|' + text + '|') == -1)
            tag_text += '|' + text + '|';
        else
            list_for_remove.push($(this));
    })
    $(list_for_remove).each(function () {
        $(this).remove();
    });
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
        complete_link[url] = url;
    }
    return complete_link
}

function tags_helper_template() {
    return `<div class="section-group" id="art_tags_helper">
    <section>
        <p>
            <label>Tags Helper</label>
        </p>
        <p class="story-editor__meta-hint" id="art_help" style="display:none">
            Содержание поста создано вами.<br>
            Например, вы сделали эту фотографию<br>
            или написали данный рассказ.
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





