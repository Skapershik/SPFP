// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
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
function get(url){
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            url: url,
            anonymous: true,
            success: function (response) {
                resolve(response)
            },
            error: function (e) {
                reject('Error',e)
            }
        });
    })
}
function post(url, _data){
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'post',
            url: url,
            processData: false,
            contentType: false,
            data: _data,
            success: function (response) {
                resolve(response);
            },
            error: function (e) {
                reject('Error',e)
            }
        });
    })
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        request = JSON.parse(request)
        console.log(request)
        if (request.type !== undefined) {
            if (request['type'] === 'get') {
                if(request['url'].includes('danbooru.donmai.us/posts/')){
                    request['url']+='.json'
                }
                console.log(request['url'])
                get(request['url']).then(
                    resolve => {
                        console.log('resolve:', resolve)
                        sendResponse(resolve)
                    },
                    reject => {
                        console.log('reject:', reject)
                        sendResponse(reject)
                    }
                )
            }
            else if (request['type'] === 'post') {
                post(request['url'], request['data']).then(
                    resolve => {
                        console.log('resolve:', resolve)
                        sendResponse(resolve)
                    },
                    reject => {
                        console.log('reject:', reject)
                        sendResponse(reject)
                    }
                )
            }
        }
        return true;
    });