
let ScriptSettings = {};
LoadSettings();
function addSettingsPanel(){
    var settingsPanel = document.createElement("div");
    settingsPanel.className = "section-group settings";
    settingsPanel.innerHTML += "<section class=\"section_gray\"><h4>Настройка Pikabu+</h4></section><section>\n" +
        "<table class=\"page-tings__table\">\n" +
        "<colgroup>\n" +
        "<col class=\"page-tings__col-general\">\n" +
        "<col class=\"page-tings__col\">\n" +
        "</colgroup>\n" +
        "<tbody>\n" +
        "<tr>\n" +
        "<td><label for=\"EasyTags\">Разделение тегов запятыми</label></td>\n" +
        "<td><span class=\""+UpdateSettings("EasyTags")+" tabindex=\"0\" unselectable=\"on\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon--ui__success icon--ui__success_checkbox\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#icon--ui__success\"></use></svg><input type=\"checkbox\" id=\"EasyTags\" name=\"EasyTags\" class=\"checkbox_switch\" value=\"1\" checked=\"checked\" style=\"display: none;\"></span></td>\n" +
        "</tr>\n" +
        "<tr>\n" +
        "<td><label for=\"IQDB\">Danbooru Linker</label></td>\n" +
        "<td><span class=\""+UpdateSettings("IQDB")+" tabindex=\"0\" unselectable=\"on\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon--ui__success icon--ui__success_checkbox\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#icon--ui__success\"></use></svg><input id=\"IQDB\" name=\"IQDB\" type=\"checkbox\" class=\"checkbox_switch\" value=\"2\" checked=\"checked\" style=\"display: none;\"></span></td>\n" +
        "</tr>\n" +
        "<tr>\n" +
        "<td><label for=\"CallModerator\">Кнопка быстрого вызова администрации</label></td>\n" +
        "<td><span class=\""+UpdateSettings("CallModerator")+" tabindex=\"0\" unselectable=\"on\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon--ui__success icon--ui__success_checkbox\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#icon--ui__success\"></use></svg><input id=\"CallModerator\" name=\"CallModerator\" type=\"checkbox\" class=\"checkbox_switch\" value=\"1\" checked=\"checked\" style=\"display: none;\"></span></td>\n" +
        "</tr>\n" +
        "<td><label for=\"Yukari\">Выглядывающая Юкари :D</label></td>\n" +
        "<td><span class=\""+UpdateSettings("Yukari")+" tabindex=\"0\" unselectable=\"on\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon--ui__success icon--ui__success_checkbox\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#icon--ui__success\"></use></svg><input id=\"Yukari\" name=\"Yukari\" type=\"checkbox\" class=\"checkbox_switch\" value=\"1\" checked=\"checked\" style=\"display: none;\"></span></td>\n" +
        "</tr>\n" +
        "</tbody>\n" +
        "</table>\n" +
        "</section>";

    document.body.appendChild(settingsPanel);
    var checkbox = document.getElementsByClassName("section-group settings")[0].getElementsByTagName("span");
    for(var i = 0;i<checkbox.length;i++){
        console.log(i);
     checkbox[i].onclick = function(){
       ChangeSettings(this);
     };
    }
}
function LoadSettings(){
chrome.storage.local.get("Settings",function(result){
ScriptSettings = result["Settings"];
addSettingsPanel();
	});
	
}
function UpdateSettings(SetClass){
    if(ScriptSettings[SetClass]){
     return "checkbox checkbox_switch checkbox_checked";
    }
    else{
     return "checkbox checkbox_switch" ;
    }
}
function ChangeSettings(elem){
if(elem.className=='checkbox checkbox_switch'){
   elem.className='checkbox checkbox_switch checkbox_checked';
   ScriptSettings[elem.children[1].id] = true;
}else{
   elem.className='checkbox checkbox_switch';
   ScriptSettings[elem.children[1].id] = false;
}
chrome.storage.local.set({"Settings":ScriptSettings});
}