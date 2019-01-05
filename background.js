// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
        let ScriptSettings = {
            EasyTags: true, //Разделение тегов запятыми для удобного копирования
            Pixiv: true, //Формирование ссылки на Pixiv из названия файла
            IQDB: true, //Отправка файла на IQDB, получение тегов с Danbooru
            CallModerator: true, // Кнопка быстрого вызова администрации сообщества
            //IQDBModes\\
            BetaIQDB: true, //Пробный режим, вывод результатов поиска IQDB непосредственно на страницу создания поста
            IQDBAuto: true, //Автоматический запрос тегов по первому совпадению на IQDB, может выдать ахинею
            Youtube: true, //Youtube плеер в комментариях
            Yukari:true
        };
        chrome.storage.local.set({"Settings":ScriptSettings});

    }else if(details.reason == "update"){
        console.log("update!");
        chrome.storage.local.set({"NewVersion": true});
    }
});