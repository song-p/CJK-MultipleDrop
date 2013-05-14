$(function () {
    var commonComponentTypes = ['TWAPanel', 'TWAToolBar'];
    var commonComponentNames = [  'mmBaseDo', 'mmRcDelete', 'mmRcSave', 'mmRcLoad', 'mmBaseExit'
                                , 'mmView', 'mmToolBar', 'mmShowCaption', 'mmCaptionListed', 'mmEditCtrlPos'
                                , 'mmEditCtrlPosMode', 'mmBaseHelp', 'mmAbout'
                                , 'ActExit', 'ActShowAbout', 'ActShowCaption', 'ActCaptionListed'];
    
    var isCommonComponent = function(module) {
        var component = $("td:nth-child(2) > a", module).text().trim().split(':');
        var component_name = component[0].trim();
        var component_type = component[1].trim().split('[')[0].trim();
        
        // If already droped, return false
        if ($("td:nth-child(3) > select", module).val() == '破棄') {
            return false;
        }
        if ($.inArray(component_type, commonComponentTypes) != -1
                || $.inArray(component_name, commonComponentNames) != -1) {
            return true;
        }
        return false;
    }
    
    $("#task_list > thead > tr").prepend("<th role='columnheader'><input type='checkbox'></th>");
    $("#task_list > thead > tr > th:first > input:checkbox").click(function(){
        var checked_value = $(this).prop('checked');
        $("#task_list > tbody > tr > td > input:checkbox").each(function(){
            $(this).prop('checked', checked_value);
        });
    });
    
    $("#task_list > tbody > tr").each(function(){
        if (isCommonComponent($(this))) {
            $(this).prepend("<td class=' '><input type='checkbox' checked></td>");
        } else {
            $(this).prepend("<td class=' '><input type='checkbox'></td>");
        }
    });
    
    $("<input id='multi_drop_btn' type='submit' value='Drop Selected' style='background-color:red'>").insertBefore('#task_list_wrapper');
    $("#multi_drop_btn").click(function(){
        $("#task_list > tbody > tr > td > input:checked").each(function(){
            $("td:nth-child(4) > select", $(this).parents("tr:first")).val('破棄');
        });
    });
});