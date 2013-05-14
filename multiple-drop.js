var start_plugin = function () {
    
    // Check whether a component is shared, which do not need migrate
    var sharedComponentTypes = ['TWAPanel', 'TWAToolBar'];
    var sharedComponentNames = [  'mmBaseDo', 'mmRcDelete', 'mmRcSave', 'mmRcLoad', 'mmBaseExit'
                                , 'mmView', 'mmToolBar', 'mmShowCaption', 'mmCaptionListed', 'mmEditCtrlPos'
                                , 'mmEditCtrlPosMode', 'mmBaseHelp', 'mmAbout'
                                , 'ActExit', 'ActShowAbout', 'ActShowCaption', 'ActCaptionListed'];
    
    // Parameter: the <tr> node for the line
    var isSharedComponent = function(module) {
        var component = $("td:nth-child(3) > a", module).text().trim().split(':');
        var component_name = component[0].trim();
        var component_type = component[1].trim().split('[')[0].trim();
        
        // If already dropped, return false
        if ($("td:nth-child(4) > select", module).val() == '破棄') {
            return false;
        }
        if ($.inArray(component_type, sharedComponentTypes) != -1
                || $.inArray(component_name, sharedComponentNames) != -1) {
            return true;
        }
        return false;
    };
    
    // Parameter: the <tr> node for the line
    var isDisusedAction = function(module, actionCountsMap) {
        var component = $("td:nth-child(3) > a", module).text().trim().split(':');
        var component_name = component[0].trim();
        var component_type = component[1].trim().split('[')[0].trim();
        
        // If already dropped, return false
        if ($("td:nth-child(4) > select", module).val() == '破棄') {
            return false;
        }
        
        if (component_type == 'TAction' && actionCountsMap[component_name] == 0) {
            return true;
        }
        return false;
    };
    
    var getActionCountsMap = function() {
        var actionCountsMap = {};
        
        // get all the actions
        $("#task_list > tbody > tr > td:nth-child(3) > a").each(function() {
            var component = $(this).text().split(':');
            var component_name = component[0].trim();
            var component_type = component[1].trim().split('[')[0].trim();
            if (component_type == 'TAction') {
                actionCountsMap[component_name] = 0;
            }
        });
        
        // loop again to gather counts
        $("#task_list > tbody > tr > td:last-child > p").each(function() {
            var isEvent = false;
            var child = this.firstChild;
            while(child){
                if (isEvent) {
                    var action = child.textContent.trim();
                    actionCountsMap[action] = actionCountsMap[action] + 1;
                    isEvent = false;
                }
                if(child.nodeType == Node.TEXT_NODE && child.textContent == 'イベント: '){
                    isEvent = true;
                }
                child = child.nextSibling;
            }
        });
        
        return actionCountsMap;
    };
    
    // The main process that add checkbox column
    $("#task_list > thead > tr").prepend(
            "<th role='columnheader'>\n" +
            "<select>\n" +
            "  <option value='prompt' selected>Choices</option>\n" +
            "  <option value='all'>All</option>\n" +
            "  <option value='reverse'>Reverse</option>\n" +
            "  <option value='shared'>Shared</option>\n" +
            "  <option value='disused'>Disused</option>\n" +
            "  </select>" +
            "</th>"
    );
    $("#task_list > thead > tr > th:first > select").change(function(){
        if ($(this).val() == 'all') {
            $("#task_list > tbody > tr > td:first-child > input:checkbox").each(function(){
                $(this).prop('checked', true);
            });
        } else if ($(this).val() == 'reverse') {
            $("#task_list > tbody > tr > td:first-child > input:checkbox").each(function(){
                $(this).prop('checked', ! $(this).prop('checked'));
            });
        } else if ($(this).val() == 'shared') {
            $("#task_list > tbody > tr > td:first-child > input:checkbox").each(function(){
                $(this).prop('checked', isSharedComponent($(this).parents('tr:first')));
            });
        } else if ($(this).val() == 'disused') {
            var actionCountsMap = getActionCountsMap();
            $("#task_list > tbody > tr > td:first-child > input:checkbox").each(function(){
                $(this).prop('checked', isDisusedAction($(this).parents('tr:first'), actionCountsMap));
            });
        }
        update_selected_count();
    });
    
    var update_selected_count = function() {
        var selected_count = $("#task_list > tbody > tr > td:first-child > input:checked").length;
        $("#multi_drop_btn").val("Drop Selected [" + selected_count + "]")
    };
    
    $("#task_list > tbody > tr").each(function(){
        $(this).prepend("<td class=' '><input type='checkbox'></td>");
        $("td:first-child > input:checkbox", this).click(update_selected_count);
    });
    
    // Add button to the task list page
    $("<input id='multi_drop_btn' type='submit' value='Drop Selected' style='background-color:red'>").insertBefore('#task_list_wrapper');
    $("#multi_drop_btn").click(function(){
        $("#task_list > tbody > tr > td > input:checked").each(function(){
            $("td:nth-child(4) > select", $(this).parents("tr:first")).val('破棄');
        });
    });
};

$(function() {
    $("<input id='start_plugin_btn' type='submit' value='Start Multiple Drop Plugin'> style='background-color:blue'").insertBefore('#task_list_wrapper');
    $("#start_plugin_btn").click(function(){
        start_plugin();
        $(this).hide();
        return false;
    });
});